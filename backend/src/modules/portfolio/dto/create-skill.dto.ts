import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ example: 'TypeScript' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Languages' })
  @IsString()
  category: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/ts-icon.svg' })
  @IsOptional()
  @IsString()
  iconUrl?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
