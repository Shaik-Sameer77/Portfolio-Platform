import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller.js';
import { PaymentService } from './payment.service.js';
import { StripeProvider } from './providers/stripe.provider.js';
import { RazorpayProvider } from './providers/razorpay.provider.js';
import { WebhookController } from './webhooks/webhook.controller.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { CurrencyService } from './currency.service.js';

@Module({
  imports: [PrismaModule, AuthModule, ConfigModule],
  controllers: [PaymentController, WebhookController],
  providers: [PaymentService, StripeProvider, RazorpayProvider, CurrencyService],
  exports: [PaymentService, CurrencyService],
})
export class PaymentModule {}
