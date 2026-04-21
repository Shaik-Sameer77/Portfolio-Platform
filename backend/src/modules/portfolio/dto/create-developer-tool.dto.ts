import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateDeveloperToolDto {
  @ApiProperty({ example: 'Next.js Boilerplate' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'My personal Next.js starter kit.' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 'https://github.com/...' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ example: 'Starters' })
  @IsString()
  category: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/starter.png' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
