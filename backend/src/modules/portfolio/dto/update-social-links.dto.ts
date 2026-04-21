import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSocialLinksDto {
  @ApiPropertyOptional({ example: 'https://github.com/Shaik-Sameer77' })
  @IsOptional()
  @IsString()
  github?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/shaik-sameer' })
  @IsOptional()
  @IsString()
  linkedin?: string;

  @ApiPropertyOptional({ example: 'https://twitter.com/example' })
  @IsOptional()
  @IsString()
  twitter?: string;

  @ApiPropertyOptional({ example: 'sameer@example.com' })
  @IsOptional()
  @IsString()
  email?: string;
}
