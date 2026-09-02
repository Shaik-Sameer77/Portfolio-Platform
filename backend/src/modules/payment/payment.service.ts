import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { StripeProvider } from './providers/stripe.provider.js';
import { RazorpayProvider } from './providers/razorpay.provider.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { PaymentGateway, PaymentStatus, OrderType } from '@prisma/client';
import { CurrencyService } from './currency.service.js';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private prisma: PrismaService,
    private stripeProvider: StripeProvider,
    private razorpayProvider: RazorpayProvider,
    private currencyService: CurrencyService,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    let { item, amount, currency } = await this.resolveItem(dto);

    if (dto.gateway === 'RAZORPAY') {
      const rate = await this.currencyService.getUsdToInrRate();
      amount = amount * rate;
      currency = 'INR';
    } else {
      currency = 'USD';
    }

    const provider = dto.gateway === 'STRIPE' 
      ? this.stripeProvider 
      : this.razorpayProvider;

    const itemName = (item as any).name || (item as any).title || 'Appointment';
    const description = `Payment for ${dto.type}: ${itemName}`;

    const gatewayResult = await provider.createOrder({
      amount: this.toSmallestUnit(amount, currency),
      currency,
      description,
      customerEmail: dto.customerEmail,
      customerName: dto.customerName,
      metadata: {
        orderId: '', 
        type: dto.type,
        itemId: String(dto.itemId || (item as any).id),
      },
      successUrl: dto.successUrl,
      cancelUrl: dto.cancelUrl,
    });

    const order = await this.prisma.order.create({
      data: {
        type: dto.type as OrderType,
        productId: dto.type === 'PRODUCT' ? (dto.itemId || (item as any).id) : null,
        serviceId: dto.type === 'SERVICE' ? (dto.itemId || (item as any).id) : null,
        appointmentId: dto.type === 'APPOINTMENT' ? (dto.itemId || (item as any).id) : null,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        userId: dto.userId || null,
        amount: this.toSmallestUnit(amount, currency),
        currency,
        gateway: dto.gateway as PaymentGateway,
        gatewayOrderId: gatewayResult.gatewayOrderId,
        status: PaymentStatus.PENDING,
      },
    });

    return {
      order,
      ...gatewayResult,
    };
  }

  private async resolveItem(dto: CreateOrderDto) {
    switch (dto.type) {
      case 'PRODUCT': {
        const product = dto.itemId 
          ? await this.prisma.product.findUnique({ where: { id: dto.itemId } })
          : await this.prisma.product.findUnique({ where: { slug: dto.itemSlug } });
        if (!product) throw new BadRequestException('Product not found');
        if (!product.price) throw new BadRequestException('This product has no price set');
        return { item: product, amount: product.price, currency: dto.currency || 'USD' };
      }
      case 'SERVICE': {
        const service = await this.prisma.service.findUnique({ where: { id: dto.itemId! } });
        if (!service) throw new BadRequestException('Service not found');
        if (!service.price) throw new BadRequestException('This service has no price set');
        return { item: service, amount: service.price, currency: service.currency || 'USD' };
      }
      case 'APPOINTMENT': {
        const appointment = await this.prisma.appointment.findUnique({ where: { id: dto.itemId! } });
        if (!appointment) throw new BadRequestException('Appointment not found');
        if (dto.amount === undefined) throw new BadRequestException('Amount is required for appointments');
        return { item: appointment, amount: dto.amount, currency: dto.currency || 'USD' };
      }
      default:
        throw new BadRequestException('Invalid order type');
    }
  }

  private toSmallestUnit(amount: number, currency: string): number {
    const zeroDecimalCurrencies = ['JPY', 'KRW', 'VND'];
    if (zeroDecimalCurrencies.includes(currency.toUpperCase())) {
      return Math.round(amount);
    }
    return Math.round(amount * 100);
  }

  async markOrderPaid(gatewayOrderId: string, gatewayPaymentId: string) {
    const order = await this.prisma.order.findFirst({
      where: { gatewayOrderId },
    });

    if (!order) {
      this.logger.warn(`Order not found for gateway ID: ${gatewayOrderId}`);
      return;
    }

    if (order.status === 'COMPLETED') return order;

    const updatedOrder = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: PaymentStatus.COMPLETED,
        gatewayPaymentId,
        paidAt: new Date(),
      },
    });

    if (updatedOrder.type === 'APPOINTMENT' && updatedOrder.appointmentId) {
      await this.prisma.appointment.update({
        where: { id: updatedOrder.appointmentId },
        data: { status: 'CONFIRMED' }
      });
    }

    return updatedOrder;
  }

  async markOrderFailed(gatewayOrderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { gatewayOrderId },
    });
    if (!order || order.status === 'FAILED') return;

    return this.prisma.order.update({
      where: { id: order.id },
      data: { status: PaymentStatus.FAILED },
    });
  }

  async verifyRazorpayPayment(body: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; }) {
    const isValid = this.razorpayProvider.verifyPaymentSignature(
      body.razorpay_order_id,
      body.razorpay_payment_id,
      body.razorpay_signature
    );

    if (!isValid) {
      throw new BadRequestException('Invalid payment signature');
    }

    await this.markOrderPaid(body.razorpay_order_id, body.razorpay_payment_id);
    return { success: true };
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { product: true, service: true, appointment: true },
    });
  }
}
