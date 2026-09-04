import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChatInputDto {
  @ApiProperty({ description: 'User message text', example: 'What projects has Sameer built?' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  message: string;

  @ApiPropertyOptional({ description: 'Session identifier for conversation history', example: 'session-12345' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sessionId?: string;
}
