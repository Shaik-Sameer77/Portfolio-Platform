import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductType } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({ enum: ProductType, example: 'SOFTWARE' })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty({ example: 'kctl' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'kctl' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Kafka topic inspector and replayer for debugging event-driven systems.' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'kctl is a developer CLI tool that lets you inspect, replay, and debug Kafka topics...' })
  @IsString()
  longDescription: string;

  @ApiProperty({ example: 'Built by me' })
  @IsString()
  category: string;

  @ApiProperty({ example: ['/image1.png'] })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiPropertyOptional({ example: 'https://tsx.is' })
  @IsOptional()
  @IsString()
  url?: string;

  // Software specific
  @ApiPropertyOptional({ example: ['Node.js', 'TypeScript'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];

  @ApiPropertyOptional({ example: ['Inspect topic messages', 'Replay messages'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({ example: 'https://github.com/...' })
  @IsOptional()
  @IsString()
  liveUrl?: string;

  // Ecommerce specific
  @ApiPropertyOptional({ example: 1999 })
  @IsOptional()
  @IsNumber()
  price?: number;
}
