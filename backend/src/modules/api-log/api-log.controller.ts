import { Controller, Get, Query, Delete, UseGuards } from '@nestjs/common';
import { ApiLogService } from './api-log.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('api-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class ApiLogController {
  constructor(private readonly apiLogService: ApiLogService) {}

  @Get()
  async findAll(@Query('limit') limit?: string) {
    return this.apiLogService.findAll(limit ? parseInt(limit) : 100);
  }

  @Delete()
  async clearLogs() {
    return this.apiLogService.clearLogs();
  }
}
