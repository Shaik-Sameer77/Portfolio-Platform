import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';
import { v2 as cloudinary } from 'cloudinary';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import Stripe from 'stripe';
import Razorpay from 'razorpay';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger('ServiceHealth');

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // Run startup health check silently in background so startup isn't blocked
    setImmediate(() => this.logStartupHealth());
  }

  private async logStartupHealth() {
    this.logger.log('--------------------------------------------------');
    this.logger.log('🔍 Checking All External Service Connections...');
    const health = await this.getHealthStatus();

    for (const [service, data] of Object.entries(health.services)) {
      const nameFormatted = service.padEnd(15);
      if (data.status === 'connected') {
        const latency = (data as any).latencyMs !== undefined ? ` (${(data as any).latencyMs}ms)` : '';
        this.logger.log(`  ✅ ${nameFormatted} : CONNECTED${latency}`);
      } else {
        this.logger.error(`  ❌ ${nameFormatted} : DISCONNECTED -> ${(data as any).error}`);
      }
    }
    this.logger.log(`System Status: [${health.status.toUpperCase()}]`);
    this.logger.log('--------------------------------------------------');
  }

  getHello(): string {
    return 'Portfolio Platform API is running!';
  }

  async getHealthStatus() {
    const results = await Promise.allSettled([
      this.checkDatabase(),
      this.checkCloudinary(),
      this.checkSmtp(),
      this.checkGoogleCalendar(),
      this.checkStripe(),
      this.checkRazorpay(),
    ]);

    const services = {
      database: results[0].status === 'fulfilled' ? results[0].value : { status: 'disconnected', error: (results[0] as any).reason?.message || 'Database check failed' },
      cloudinary: results[1].status === 'fulfilled' ? results[1].value : { status: 'disconnected', error: (results[1] as any).reason?.message || 'Cloudinary check failed' },
      smtp: results[2].status === 'fulfilled' ? results[2].value : { status: 'disconnected', error: (results[2] as any).reason?.message || 'SMTP check failed' },
      googleCalendar: results[3].status === 'fulfilled' ? results[3].value : { status: 'disconnected', error: (results[3] as any).reason?.message || 'Google Calendar check failed' },
      stripe: results[4].status === 'fulfilled' ? results[4].value : { status: 'disconnected', error: (results[4] as any).reason?.message || 'Stripe check failed' },
      razorpay: results[5].status === 'fulfilled' ? results[5].value : { status: 'disconnected', error: (results[5] as any).reason?.message || 'Razorpay check failed' },
    };

    const isAllConnected = Object.values(services).every((s) => s.status === 'connected');

    return {
      status: isAllConnected ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      services,
    };
  }

  private async checkDatabase() {
    const start = Date.now();
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'connected', latencyMs: Date.now() - start };
  }

  private async checkCloudinary() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return { status: 'disconnected', error: 'Missing Cloudinary environment variables' };
    }

    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
    const res = await cloudinary.api.ping();
    return { status: 'connected', ping: res.status };
  }

  private async checkSmtp() {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      return { status: 'disconnected', error: 'Missing SMTP_USER or SMTP_PASS environment variables' };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.verify();
    return { status: 'connected', host, port };
  }

  private async checkGoogleCalendar() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      return { status: 'disconnected', error: 'Missing Google OAuth environment variables' };
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    await calendar.calendars.get({ calendarId });
    return { status: 'connected', calendarId };
  }

  private async checkStripe() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return { status: 'disconnected', error: 'Missing STRIPE_SECRET_KEY' };
    }

    const stripe = new Stripe(secretKey);
    const balance = await stripe.balance.retrieve();
    return { status: 'connected', livemode: balance.livemode };
  }

  private async checkRazorpay() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return { status: 'disconnected', error: 'Missing Razorpay API credentials' };
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    await razorpay.orders.all({ count: 1 });
    return { status: 'connected', keyId: `${keyId.substring(0, 8)}...` };
  }
}
