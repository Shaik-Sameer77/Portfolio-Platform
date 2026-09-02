import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrencyService } from './currency.service.js';

@Controller('payments')
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private currencyService: CurrencyService,
  ) {}

  @Get('exchange-rate')
  async getExchangeRate() {
    const rate = await this.currencyService.getUsdToInrRate();
    return { rate };
  }

  @Post('create-order')
  createOrder(@Body() dto: CreateOrderDto) {
    return this.paymentService.createOrder(dto);
  }

  @Post('verify-razorpay')
  verifyRazorpay(@Body() body: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    return this.paymentService.verifyRazorpayPayment(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('orders')
  getAllOrders() {
    return this.paymentService.getAllOrders();
  }
}
