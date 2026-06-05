import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNumber,
  IsISO8601,
  IsNotEmpty,
} from 'class-validator';
import { AppointmentType } from '@prisma/client';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Full name of the client' })
  @IsString()
  clientName: string;

  @ApiProperty({ description: 'Email address of the client' })
  @IsEmail()
  clientEmail: string;

  @ApiPropertyOptional({ description: 'Company name' })
  @IsOptional()
  @IsString()
  clientCompany?: string;

  @ApiProperty({ description: 'Client mobile number' })
  @IsString()
  @IsNotEmpty()
  clientMobile: string;

  @ApiPropertyOptional({ description: 'Message for the appointment' })
  @IsOptional()
  @IsString()
  clientMessage?: string;

  @ApiProperty({
    enum: AppointmentType,
    description: 'Type of appointment',
    default: AppointmentType.CONSULTATION,
  })
  @IsEnum(AppointmentType)
  appointmentType: AppointmentType;

  @ApiProperty({ description: 'Scheduled start date and time (ISO 8601 UTC)' })
  @IsISO8601()
  scheduledAt: string;

  @ApiProperty({ description: 'Duration in minutes', default: 30 })
  @IsNumber()
  duration: number;

  @ApiProperty({ description: 'Timezone of the client (e.g., Asia/Kolkata)' })
  @IsString()
  timezone: string;
}
