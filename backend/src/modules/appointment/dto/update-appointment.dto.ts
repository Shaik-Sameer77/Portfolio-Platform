import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsBoolean, IsNumber, IsISO8601 } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class UpdateAppointmentDto {
  @ApiPropertyOptional({
    enum: AppointmentStatus,
    description: 'Status of the appointment',
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiPropertyOptional({ description: 'Admin private notes' })
  @IsOptional()
  @IsString()
  adminNotes?: string;

  @ApiPropertyOptional({ description: 'Reason for cancellation if cancelled' })
  @IsOptional()
  @IsString()
  cancelReason?: string;
}

export class CreateAvailabilitySlotDto {
  @ApiPropertyOptional({ description: 'Day of week (0-6)' })
  @IsNumber()
  dayOfWeek: number;

  @ApiPropertyOptional({ description: 'Start time (e.g. 10:00)' })
  @IsString()
  startTime: string;

  @ApiPropertyOptional({ description: 'End time (e.g. 14:00)' })
  @IsString()
  endTime: string;
}

export class CreateBlockedDateDto {
  @ApiPropertyOptional({ description: 'Specific date to block (ISO string)' })
  @IsISO8601()
  date: string;

  @ApiPropertyOptional({ description: 'Reason for blocking' })
  @IsOptional()
  @IsString()
  reason?: string;
}
