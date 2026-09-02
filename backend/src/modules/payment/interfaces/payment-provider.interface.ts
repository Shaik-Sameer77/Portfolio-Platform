export interface PaymentOrderResult {
  gatewayOrderId: string;
  amount: number;
  currency: string;
  gateway: 'STRIPE' | 'RAZORPAY';
  checkoutUrl?: string;
  clientSecret?: string;
  razorpayKeyId?: string;
}

export interface PaymentProvider {
  createOrder(params: {
    amount: number;
    currency: string;
    description: string;
    customerEmail: string;
    customerName: string;
    metadata: Record<string, string>;
    successUrl?: string;
    cancelUrl?: string;
  }): Promise<PaymentOrderResult>;

  verifyWebhook(payload: Buffer, signature: string): boolean;
}
