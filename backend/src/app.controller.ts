import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service.js';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Check connection status for Database, Cloudinary, SMTP, Google Calendar, Stripe, and Razorpay' })
  @ApiResponse({ status: 200, description: 'Health check report for all services' })
  getHealth() {
    return this.appService.getHealthStatus();
  }
}
