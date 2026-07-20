import { Controller, Post, Body, Get, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('contact')
  async submitContactForm(@Body() data: { name: string; email: string; subject: string; message: string }) {
    await this.mailService.saveContactMessage(data);
    return { success: true, message: 'Message sent successfully.' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('contact')
  async getMessages() {
    return this.mailService.getContactMessages();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('contact/:id/read')
  async markAsRead(@Param('id') id: string) {
    return this.mailService.markContactAsRead(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('contact/:id')
  async deleteMessage(@Param('id') id: string) {
    return this.mailService.deleteContactMessage(+id);
  }
}
