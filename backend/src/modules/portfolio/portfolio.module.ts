import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller.js';
import { PortfolioService } from './portfolio.service.js';
import { BlogModule } from '../blog/blog.module.js';
import { ChatbotModule } from '../chatbot/chatbot.module.js';

@Module({
  imports: [BlogModule, ChatbotModule],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}

