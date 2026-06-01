import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'This is a fantastic blog post! Very educational.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ example: 1, description: 'ID of the parent comment being replied to' })
  @IsOptional()
  @IsNumber()
  parentId?: number;
}
