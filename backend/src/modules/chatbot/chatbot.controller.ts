import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ChatbotService } from './chatbot.service.js';
import { ChatInputDto } from './dto/chat-input.dto.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Public()
  @Post('stream')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // Max 10 chat requests per minute per IP
  @ApiOperation({ summary: 'Stream AI chatbot response via SSE' })
  async streamChat(
    @Body() dto: ChatInputDto,
    @Res() res: Response,
  ) {
    return this.chatbotService.streamChat(dto.message, dto.sessionId, res);
  }
}
