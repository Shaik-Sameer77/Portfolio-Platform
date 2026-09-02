import { Controller, Post, Req, Headers, RawBodyRequest, HttpCode } from '@nestjs/common';
import { Request } from 'express';
import { PaymentService } from '../payment.service.js';
import { StripeProvider } from '../providers/stripe.provider.js';
import { RazorpayProvider } from '../providers/razorpay.provider.js';

@Controller('webhooks')
export class WebhookController {
  constructor(
    private paymentService: PaymentService,
    private stripeProvider: StripeProvider,
    private razorpayProvider: RazorpayProvider,
  ) {}

  @Post('stripe')
  @HttpCode(200)
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.rawBody;
    
    if (!rawBody) return { received: false, error: 'No raw body' };

    if (!this.stripeProvider.verifyWebhook(rawBody, signature)) {
      return { received: false, error: 'Invalid signature' };
    }

    const event = JSON.parse(rawBody.toString());

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await this.paymentService.markOrderPaid(
          session.id,
          session.payment_intent,
        );
        break;
      }
      case 'payment_intent.payment_failed': {
        const intent = event.data.object;
        await this.paymentService.markOrderFailed(intent.id);
        break;
      }
    }

    return { received: true };
  }

  @Post('razorpay')
  @HttpCode(200)
  async handleRazorpayWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    const rawBody = req.rawBody;
    
    if (!rawBody) return { received: false, error: 'No raw body' };
    
    if (!this.razorpayProvider.verifyWebhook(rawBody, signature)) {
      return { received: false, error: 'Invalid signature' };
    }

    const event = JSON.parse(rawBody.toString());

    switch (event.event) {
      case 'order.paid': {
        const payment = event.payload.payment.entity;
        await this.paymentService.markOrderPaid(
          payment.order_id,
          payment.id,
        );
        break;
      }
      case 'payment.failed': {
        const payment = event.payload.payment.entity;
        await this.paymentService.markOrderFailed(payment.order_id);
        break;
      }
    }

    return { received: true };
  }
}
