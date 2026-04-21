import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty({ example: 'Google' })
  @IsString()
  company: string;

  @ApiProperty({ example: 'Software Engineer' })
  @IsString()
  role: string;

  @ApiProperty({ example: '2023-06-01' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  current?: boolean;

  @ApiProperty({ example: 'Built microservices architecture for analytics pipeline...' })
  @IsString()
  description: string;
}
