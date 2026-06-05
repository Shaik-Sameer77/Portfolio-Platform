import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { GoogleCalendarService } from './google-calendar.service.js';
import { MailService } from '../mail/mail.service.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { UpdateAppointmentDto, CreateAvailabilitySlotDto, CreateBlockedDateDto } from './dto/update-appointment.dto.js';
import { AppointmentStatus, AppointmentType } from '@prisma/client';
import { startOfDay, endOfDay, parseISO, isSameDay, addMinutes, format, parse } from 'date-fns';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);

  constructor(
    private prisma: PrismaService,
    private calendarService: GoogleCalendarService,
    private mailService: MailService,
  ) {}

  // ─── Booking Logic ─────────────────────────────────────────────────────────────

  async createAppointment(dto: CreateAppointmentDto) {
    const scheduledAt = new Date(dto.scheduledAt);
    
    // 1. Validate slot is still available
    const isAvailable = await this.checkSlotAvailability(scheduledAt, dto.duration);
    if (!isAvailable) {
      throw new BadRequestException('This time slot is no longer available. Please select another time.');
    }

    // 2. Generate Google Meet link
    let meetLink = '';
    let eventLink = '';
    let eventId = '';
    
    try {
      const gCalRes = await this.calendarService.createMeetingEvent({
        summary: `Meeting: ${dto.clientName} - ${dto.appointmentType}`,
        description: `Client Email: ${dto.clientEmail}\nCompany: ${dto.clientCompany || 'N/A'}\nMessage: ${dto.clientMessage || 'None'}\n\nBooked via Portfolio Platform.`,
        startDateTime: dto.scheduledAt,
        durationMinutes: dto.duration,
        attendeeEmail: dto.clientEmail,
        attendeeName: dto.clientName,
      });
      meetLink = gCalRes.meetLink;
      eventLink = gCalRes.eventLink;
      eventId = gCalRes.eventId;
    } catch (e) {
      this.logger.error('Failed to create calendar event during booking, falling back to empty link', e);
      // We could fail the booking here, but let's allow it and admin can manually add link if needed.
    }

    // 3. Save to database
    const appointment = await this.prisma.appointment.create({
      data: {
        type: dto.appointmentType,
        status: AppointmentStatus.CONFIRMED, // Auto-confirm for now
        clientName: dto.clientName,
        clientEmail: dto.clientEmail,
        clientCompany: dto.clientCompany,
        clientMobile: dto.clientMobile,
        clientMessage: dto.clientMessage,
        scheduledAt,
        duration: dto.duration,
        timezone: dto.timezone,
        meetingUrl: meetLink,
        calendarEventId: eventId,
      },
    });

    // 4. Send Notifications in parallel (don't block response)
    Promise.allSettled([
      this.mailService.sendBookingConfirmation({
        clientEmail: dto.clientEmail,
        clientName: dto.clientName,
        appointmentType: dto.appointmentType,
        scheduledAt,
        duration: dto.duration,
        meetLink,
        timezone: dto.timezone,
      }),
      this.mailService.sendAdminBookingAlert({
        clientName: dto.clientName,
        clientEmail: dto.clientEmail,
        clientCompany: dto.clientCompany,
        clientMessage: dto.clientMessage,
        appointmentType: dto.appointmentType,
        scheduledAt,
        duration: dto.duration,
        meetLink,
      })
    ]).catch(e => this.logger.error('Error sending notifications', e));

    return appointment;
  }

  // ─── Availability Engine ───────────────────────────────────────────────────────

  async getAvailableSlots(dateStr: string, timezone: string = 'UTC') {
    // 1. Check if the date is blocked
    const targetDate = parseISO(dateStr);
    const dayOfWeek = targetDate.getUTCDay();

    const isBlocked = await this.prisma.blockedDate.findFirst({
      where: {
        date: {
          gte: startOfDay(targetDate),
          lte: endOfDay(targetDate),
        }
      }
    });

    if (isBlocked) {
      return []; // Completely blocked
    }

    // 2. Get standard availability for this day of week
    const slots = await this.prisma.availabilitySlot.findMany({
      where: { dayOfWeek, isActive: true },
    });

    if (slots.length === 0) {
      return []; // Admin doesn't work on this day
    }

    // 3. Get existing appointments for this day to subtract them
    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        scheduledAt: {
          gte: startOfDay(targetDate),
          lte: endOfDay(targetDate),
        },
        status: { in: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING] }
      },
    });

    // 4. Generate discrete 30-min blocks
    const availableTimes: string[] = [];
    
    for (const slot of slots) {
      // slot.startTime is e.g. "09:00" in UTC (or Admin's tz, let's assume UTC for simplicity of algorithm, though it should ideally be converted)
      // Since admin defines slots in their timezone, we should handle this carefully.
      // For this implementation, let's assume the DB stores the UTC time string for simplicity, or we compute based on target date.
      
      const start = parse(slot.startTime, 'HH:mm', targetDate);
      const end = parse(slot.endTime, 'HH:mm', targetDate);

      let current = start;
      while (current < end) {
        // Check if `current` overlaps with any existing appointment
        const conflict = existingAppointments.some(app => {
          const appStart = new Date(app.scheduledAt);
          const appEnd = addMinutes(appStart, app.duration);
          return current >= appStart && current < appEnd;
        });

        if (!conflict) {
          availableTimes.push(current.toISOString());
        }

        current = addMinutes(current, 30);
      }
    }

    return availableTimes;
  }

  private async checkSlotAvailability(scheduledAt: Date, duration: number): Promise<boolean> {
    // Simplified conflict check
    const overlapping = await this.prisma.appointment.findFirst({
      where: {
        status: { in: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING] },
        scheduledAt: {
          gte: scheduledAt,
          lt: addMinutes(scheduledAt, duration),
        }
      }
    });
    return !overlapping;
  }

  // ─── Admin Management ──────────────────────────────────────────────────────────

  async findAllAppointments() {
    return this.prisma.appointment.findMany({
      orderBy: { scheduledAt: 'desc' },
    });
  }

  async updateAppointmentStatus(id: number, dto: UpdateAppointmentDto) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new BadRequestException('Appointment not found');

    if (dto.status === AppointmentStatus.CANCELLED && appointment.calendarEventId) {
      await this.calendarService.deleteMeetingEvent(appointment.calendarEventId);
    }

    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: dto.status,
        adminNotes: dto.adminNotes,
        cancelReason: dto.cancelReason,
        ...(dto.status === AppointmentStatus.CANCELLED ? { cancelledAt: new Date() } : {})
      },
    });
  }

  // Availability Management
  async getAvailabilitySlots() {
    return this.prisma.availabilitySlot.findMany({ orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }] });
  }

  async setAvailabilitySlot(dto: CreateAvailabilitySlotDto) {
    return this.prisma.availabilitySlot.create({ data: dto });
  }

  async deleteAvailabilitySlot(id: number) {
    return this.prisma.availabilitySlot.delete({ where: { id } });
  }

  // Blocked Dates Management
  async getBlockedDates() {
    return this.prisma.blockedDate.findMany({ orderBy: { date: 'asc' } });
  }

  async addBlockedDate(dto: CreateBlockedDateDto) {
    return this.prisma.blockedDate.create({ data: { date: new Date(dto.date), reason: dto.reason } });
  }

  async deleteBlockedDate(id: number) {
    return this.prisma.blockedDate.delete({ where: { id } });
  }
}
