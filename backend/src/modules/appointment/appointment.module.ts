import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller.js';
import { AppointmentService } from './appointment.service.js';
import { GoogleCalendarService } from './google-calendar.service.js';
import { MailModule } from '../mail/mail.module.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [AppointmentController],
  providers: [AppointmentService, GoogleCalendarService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
