import { IsString, IsOptional, IsBoolean, IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExperienceDto {
  @ApiProperty()
  @IsString()
  company: string;

  @ApiProperty()
  @IsString()
  role: string;

  @ApiProperty()
  @IsString()
  startDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  current?: boolean;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  bullets: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  stack: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  order?: number;
}
