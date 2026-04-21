import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateGalleryPhotoDto {
  @ApiProperty({ example: 'https://cdn.example.com/photo.jpg' })
  @IsString()
  imageUrl: string;

  @ApiPropertyOptional({ example: 'A beautiful sunset' })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({ example: 'San Francisco, CA' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: '2023-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  takenAt?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
