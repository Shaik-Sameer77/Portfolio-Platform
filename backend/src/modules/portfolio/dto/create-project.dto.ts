import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Portfolio Platform' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'A backend-driven portfolio built with NestJS and Next.js.' })
  @IsString()
  description: string;

  @ApiProperty({ example: ['NestJS', 'Next.js', 'PostgreSQL', 'Kafka'] })
  @IsArray()
  @IsString({ each: true })
  techStack: string[];

  @ApiPropertyOptional({ example: 'https://github.com/Shaik-Sameer77/portfolio-platform' })
  @IsOptional()
  @IsString()
  githubUrl?: string;

  @ApiPropertyOptional({ example: 'https://sameer.dev' })
  @IsOptional()
  @IsString()
  liveUrl?: string;

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/...' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

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
