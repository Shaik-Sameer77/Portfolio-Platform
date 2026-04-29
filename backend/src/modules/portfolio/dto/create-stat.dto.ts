import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStatDto {
  @ApiProperty({ example: 'projects shipped' })
  @IsString()
  label: string;

  @ApiProperty({ example: '5+' })
  @IsString()
  value: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;
}
