import { Module, Global } from '@nestjs/common';
import { MailService } from './mail.service.js';
import { MailController } from './mail.controller.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
