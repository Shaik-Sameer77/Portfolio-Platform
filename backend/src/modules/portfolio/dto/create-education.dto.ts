import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateEducationDto {
  @ApiProperty({ example: 'JNTU Hyderabad' })
  @IsString()
  institution: string;

  @ApiProperty({ example: 'B.Tech in Computer Science' })
  @IsString()
  degree: string;

  @ApiProperty({ example: 2020 })
  @IsInt()
  @Min(1980)
  startYear: number;

  @ApiPropertyOptional({ example: 2024 })
  @IsOptional()
  @IsInt()
  endYear?: number;
}
