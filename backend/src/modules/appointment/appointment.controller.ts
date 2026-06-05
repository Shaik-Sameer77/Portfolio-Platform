import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { UpdateAppointmentDto, CreateAvailabilitySlotDto, CreateBlockedDateDto } from './dto/update-appointment.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  // ─── Public Endpoints ────────────────────────────────────────────────────────

  @Get('availability')
  getAvailability(@Query('date') date: string, @Query('timezone') timezone: string) {
    if (!date) return [];
    return this.appointmentService.getAvailableSlots(date, timezone);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createAppointment(@Body() dto: CreateAppointmentDto) {
    return this.appointmentService.createAppointment(dto);
  }

  // ─── Admin Endpoints ─────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAllAppointments() {
    return this.appointmentService.findAllAppointments();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  updateAppointmentStatus(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.appointmentService.updateAppointmentStatus(+id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('slots')
  getSlots() {
    return this.appointmentService.getAvailabilitySlots();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('slots')
  createSlot(@Body() dto: CreateAvailabilitySlotDto) {
    return this.appointmentService.setAvailabilitySlot(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('slots/:id')
  deleteSlot(@Param('id') id: string) {
    return this.appointmentService.deleteAvailabilitySlot(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('blocked-dates')
  getBlockedDates() {
    return this.appointmentService.getBlockedDates();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('blocked-dates')
  createBlockedDate(@Body() dto: CreateBlockedDateDto) {
    return this.appointmentService.addBlockedDate(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('blocked-dates/:id')
  deleteBlockedDate(@Param('id') id: string) {
    return this.appointmentService.deleteBlockedDate(+id);
  }
}
