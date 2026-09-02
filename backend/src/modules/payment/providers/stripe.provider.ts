import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PaymentProvider, PaymentOrderResult } from '../interfaces/payment-provider.interface.js';

@Injectable()
export class StripeProvider implements PaymentProvider {
  private stripe: Stripe;

  constructor(private config: ConfigService) {
    this.stripe = new Stripe(this.config.get('STRIPE_SECRET_KEY') as string);
  }

  async createOrder(params: {
    amount: number;
    currency: string;
    description: string;
    customerEmail: string;
    customerName: string;
    metadata: Record<string, string>;
    successUrl?: string;
    cancelUrl?: string;
  }): Promise<PaymentOrderResult> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: params.customerEmail,
      line_items: [{
        price_data: {
          currency: params.currency.toLowerCase(),
          product_data: {
            name: params.description,
          },
          unit_amount: Math.round(params.amount),
        },
        quantity: 1,
      }],
      metadata: params.metadata,
      success_url: params.successUrl || `${this.config.get('FRONTEND_URL')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: params.cancelUrl || `${this.config.get('FRONTEND_URL')}/payment/cancel`,
    });

    return {
      gatewayOrderId: session.id,
      amount: params.amount,
      currency: params.currency,
      gateway: 'STRIPE',
      checkoutUrl: session.url || undefined,
    };
  }

  verifyWebhook(payload: Buffer, signature: string): boolean {
    try {
      this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.config.get('STRIPE_WEBHOOK_SECRET') as string,
      );
      return true;
    } catch {
      return false;
    }
  }

  async getSession(sessionId: string) {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }
}
