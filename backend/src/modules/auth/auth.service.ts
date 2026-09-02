import { BadRequestException, ForbiddenException, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service.js';
import { MailService } from '../mail/mail.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async onModuleInit() {
    // Seed default admin user on startup
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.warn('[Auth] ADMIN_EMAIL or ADMIN_PASSWORD not provided in environment variables. Skipping default admin seed.');
      return;
    }

    const existingAdmin = await this.prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      await this.prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: 'Shaik Sameer',
          role: 'ADMIN',
          isVerified: true, // Seeded admin is verified by default
        },
      });
      console.log(`[Auth] Seeded default admin user: ${adminEmail}`);
    }
  }

  async register(dto: RegisterDto) {
    const { email, password, name } = dto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate random 32-byte crypto verification token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24); // 24-hour expiry

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER',
        isVerified: false,
        verificationToken: token,
        verificationTokenExpires: tokenExpires,
      },
    });

    // Fire-and-forget sending verification mail asynchronously
    try {
      await this.mailService.sendVerificationEmail(email, name, token);
    } catch (err) {
      console.error('[Auth] Failed to send verification email during signup:', err);
    }

    return {
      message: 'Registration successful! Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async verifyEmail(token: string) {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    // Verify token expiry
    if (user.verificationTokenExpires && user.verificationTokenExpires < new Date()) {
      throw new BadRequestException('Verification token has expired. Please sign up again.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });

    return {
      message: 'Email address successfully verified! You may now log in.',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Lock unverified USER logins
    if (user.role === 'USER' && !user.isVerified) {
      throw new ForbiddenException('Please verify your email address to continue.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    return this.generateTokens(user.id, payload, user);
  }

  async generateTokens(userId: number, payload: any, user: any) {
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refreshTokens(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_SECRET || 'default_secret' });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.hashedRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.hashedRefreshToken);

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = { sub: user.id, email: user.email, role: user.role };
      return this.generateTokens(user.id, newPayload, user);
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getStatusFromRequest(req: any) {
    let token: string | null = null;

    if (req && req.headers && req.headers.cookie) {
      const rawCookies = (req.headers.cookie as string).split(';');
      for (const cookie of rawCookies) {
        const [key, val] = cookie.trim().split('=');
        if (key === 'access_token') {
          token = val;
          break;
        }
      }
    }

    if (!token && req && req.headers && req.headers.authorization) {
      const authHeader = req.headers.authorization as string;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return { authenticated: false, user: null };
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'default_secret',
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, name: true, role: true, isVerified: true },
      });

      if (!user) {
        return { authenticated: false, user: null };
      }

      return { authenticated: true, user };
    } catch {
      return { authenticated: false, user: null };
    }
  }
}
