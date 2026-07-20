import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private prisma: PrismaService) {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER || '';
    const pass = process.env.SMTP_PASS || '';

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });
  }

  async sendVerificationEmail(email: string, name: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;
    const from = process.env.SMTP_FROM || '"Admin" <admin@example.com>';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
            border: 1px solid #e2e8f0;
          }
          .header {
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
            padding: 40px 20px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.02em;
          }
          .content {
            padding: 40px 30px;
            color: #334155;
            line-height: 1.6;
          }
          .content h2 {
            font-size: 20px;
            font-weight: 700;
            margin-top: 0;
            color: #0f172a;
          }
          .btn-container {
            text-align: center;
            margin: 35px 0;
          }
          .btn {
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 30px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 16px;
            display: inline-block;
            box-shadow: 0 8px 20px rgba(99, 102, 241, 0.25);
            transition: all 0.2s;
          }
          .footer {
            background-color: #f8fafc;
            padding: 25px;
            text-align: center;
            font-size: 13px;
            color: #64748b;
            border-top: 1px solid #f1f5f9;
          }
          .footer a {
            color: #6366f1;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Sameer Developer</h1>
          </div>
          <div class="content">
            <h2>Verify your email address</h2>
            <p>Hello ${name || 'there'},</p>
            <p>Thank you for signing up on the Portfolio Platform! To participate in blog discussions and publish comments, please verify your email address by clicking the secure button below.</p>
            
            <div class="btn-container">
              <a href="${verificationUrl}" class="btn" target="_blank">Verify Email Address</a>
            </div>
            
            <p style="font-size: 14px; color: #64748b;">If the button above does not work, copy and paste this URL into your browser:</p>
            <p style="font-size: 14px; word-break: break-all;"><a href="${verificationUrl}" style="color: #6366f1;">${verificationUrl}</a></p>
            
            <p>This verification link will expire in 24 hours.</p>
            <p>Best regards,<br>Sameer Developer Support Team</p>
          </div>
          <div class="footer">
            <p>You received this because you signed up on Shaik Sameer's Portfolio Platform.</p>
            <p>&copy; 2026 Sameer.dev. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from,
        to: email,
        subject: 'Verify Your Email — Sameer Developer',
        html: htmlContent,
      });
      this.logger.log(`Verification email successfully sent to: ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to: ${email}`, error.stack);
      throw error;
    }
  }

  async sendBookingConfirmation(params: {
    clientEmail: string;
    clientName: string;
    appointmentType: string;
    scheduledAt: Date;
    duration: number;
    meetLink: string;
    timezone: string;
  }) {
    const from = process.env.SMTP_FROM || '"Admin" <admin@example.com>';
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: params.timezone,
    }).format(params.scheduledAt);

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a;">Booking Confirmed! 🎉</h2>
        <p>Hi ${params.clientName},</p>
        <p>Your <strong>${params.appointmentType}</strong> with Sameer is confirmed.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>When:</strong> ${formattedDate} (${params.timezone})</p>
          <p style="margin: 5px 0;"><strong>Duration:</strong> ${params.duration} minutes</p>
          <p style="margin: 5px 0;"><strong>Where:</strong> Google Meet</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${params.meetLink}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Join Google Meet</a>
        </div>

        <p style="color: #64748b; font-size: 14px;">A calendar invitation has also been sent to this email address.</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from,
        to: params.clientEmail,
        subject: `Booking Confirmed: ${params.appointmentType} with Sameer`,
        html: htmlContent,
      });
      this.logger.log(`Booking confirmation sent to: ${params.clientEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send booking confirmation to: ${params.clientEmail}`, error.stack);
    }
  }

  async sendAdminBookingAlert(params: {
    clientName: string;
    clientEmail: string;
    clientCompany?: string;
    clientMessage?: string;
    appointmentType: string;
    scheduledAt: Date;
    duration: number;
    meetLink: string;
  }) {
    const from = process.env.SMTP_FROM || '"Portfolio System" <admin@example.com>';
    const to = process.env.SMTP_USER || 'admin@example.com';
    
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata',
    }).format(params.scheduledAt);

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a;">🚨 New Booking: ${params.appointmentType}</h2>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Client:</strong> ${params.clientName}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${params.clientEmail}</p>
          ${params.clientCompany ? `<p style="margin: 5px 0;"><strong>Company:</strong> ${params.clientCompany}</p>` : ''}
          <p style="margin: 5px 0; margin-top: 15px;"><strong>When:</strong> ${formattedDate} (IST)</p>
          <p style="margin: 5px 0;"><strong>Duration:</strong> ${params.duration} minutes</p>
        </div>

        ${params.clientMessage ? `
        <div style="background-color: #fffbeb; padding: 15px; border-radius: 6px; border: 1px solid #fde68a;">
          <p style="margin: 0; font-weight: bold;">Message from client:</p>
          <p style="margin: 5px 0;">${params.clientMessage}</p>
        </div>
        ` : ''}

        <div style="text-align: center; margin: 30px 0;">
          <a href="${params.meetLink}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Google Meet Link</a>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: `New Booking: ${params.clientName} - ${params.appointmentType}`,
        html: htmlContent,
      });
      this.logger.log(`Admin booking alert sent to: ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send admin booking alert to: ${to}`, error.stack);
    }
  }

  async saveContactMessage(data: { name: string; email: string; subject: string; message: string }) {
    // Save to DB
    const contact = await this.prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      },
    });

    // Send email notification to Admin
    const from = process.env.SMTP_FROM || '"Portfolio System" <admin@example.com>';
    const to = process.env.SMTP_USER || 'admin@example.com';
    
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a;">📩 New Contact Message</h2>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>From:</strong> ${data.name} (${data.email})</p>
          <p style="margin: 5px 0;"><strong>Subject:</strong> ${data.subject}</p>
        </div>
        <div style="background-color: #fffbeb; padding: 15px; border-radius: 6px; border: 1px solid #fde68a;">
          <p style="margin: 0; font-weight: bold;">Message:</p>
          <p style="margin: 5px 0; white-space: pre-wrap;">${data.message}</p>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: `New Contact Message from ${data.name}`,
        html: htmlContent,
      });
      this.logger.log(`Admin contact alert sent to: ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send admin contact alert to: ${to}`, error.stack);
    }

    return contact;
  }

  async getContactMessages() {
    return this.prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async markContactAsRead(id: number) {
    return this.prisma.contact.update({
      where: { id },
      data: { read: true },
    });
  }

  async deleteContactMessage(id: number) {
    return this.prisma.contact.delete({
      where: { id },
    });
  }
}
