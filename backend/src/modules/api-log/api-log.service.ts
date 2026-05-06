import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class ApiLogService {
  constructor(private prisma: PrismaService) {}

  async createLog(data: {
    method: string;
    url: string;
    statusCode?: number;
    duration?: number;
    ip?: string;
    userAgent?: string;
    requestBody?: string;
    responseBody?: string;
  }) {
    return this.prisma.apiLog.create({
      data,
    });
  }

  async findAll(limit = 100) {
    return this.prisma.apiLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async clearLogs() {
    return this.prisma.apiLog.deleteMany();
  }
}
