import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret === 'super_secret_jwt_key_you_should_change_in_production') {
  throw new Error('JWT_SECRET is not configured securely. Please set a strong JWT_SECRET in production.');
}

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
