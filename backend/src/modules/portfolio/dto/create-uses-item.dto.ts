import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateUsesItemDto {
  @ApiProperty({ example: 'MacBook Pro 14"' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'M2 Pro, 32GB RAM' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Hardware' })
  @IsString()
  category: string;

  @ApiPropertyOptional({ example: 'https://apple.com/...' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
