import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Full Stack Development' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Custom web apps...' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 'code-xml' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
