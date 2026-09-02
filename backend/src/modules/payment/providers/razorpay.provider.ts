import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import { createHmac } from 'crypto';
import { PaymentProvider, PaymentOrderResult } from '../interfaces/payment-provider.interface.js';

@Injectable()
export class RazorpayProvider implements PaymentProvider {
  private razorpay: Razorpay;

  constructor(private config: ConfigService) {
    this.razorpay = new Razorpay({
      key_id: this.config.get('RAZORPAY_KEY_ID') as string,
      key_secret: this.config.get('RAZORPAY_KEY_SECRET') as string,
    });
  }

  async createOrder(params: {
    amount: number;
    currency: string;
    description: string;
    customerEmail: string;
    customerName: string;
    metadata: Record<string, string>;
  }): Promise<PaymentOrderResult> {
    const order = await this.razorpay.orders.create({
      amount: Math.round(params.amount), 
      currency: params.currency.toUpperCase(),
      receipt: `receipt_${Date.now()}`,
      notes: {
        ...params.metadata,
        customerEmail: params.customerEmail,
        customerName: params.customerName,
      },
    });

    return {
      gatewayOrderId: order.id,
      amount: params.amount,
      currency: params.currency,
      gateway: 'RAZORPAY',
      razorpayKeyId: this.config.get('RAZORPAY_KEY_ID') as string,
    };
  }

  verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
    const body = orderId + '|' + paymentId;
    const expectedSignature = createHmac('sha256', this.config.get('RAZORPAY_KEY_SECRET') as string)
      .update(body)
      .digest('hex');
    return expectedSignature === signature;
  }

  verifyWebhook(payload: Buffer, signature: string): boolean {
    const expectedSignature = createHmac('sha256', this.config.get('RAZORPAY_WEBHOOK_SECRET') as string)
      .update(payload)
      .digest('hex');
    return expectedSignature === signature;
  }
}
