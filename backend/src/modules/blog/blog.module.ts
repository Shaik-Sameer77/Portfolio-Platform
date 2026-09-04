import { Module, forwardRef } from '@nestjs/common';
import { BlogController } from './blog.controller.js';
import { BlogService } from './blog.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { ChatbotModule } from '../chatbot/chatbot.module.js';

@Module({
  imports: [PrismaModule, forwardRef(() => ChatbotModule)],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}

