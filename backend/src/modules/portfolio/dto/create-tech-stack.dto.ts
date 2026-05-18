import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateTechStackDto {
  @ApiProperty({ example: 'Next.js' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'nextdotjs' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Frontend' })
  @IsString()
  category: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/logo.png' })
  @IsOptional()
  @IsString()
  iconUrl?: string;

  @ApiPropertyOptional({ example: '#38bdf8' })
  @IsOptional()
  @IsString()
  color?: string;


}
