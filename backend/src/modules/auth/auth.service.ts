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
    const adminEmail = 'sameer.developer14@gmail.com';
    const adminPassword = '@Rajabali77';

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

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
