import { Module } from '@nestjs/common';
import { ApiLogService } from './api-log.service.js';
import { ApiLogController } from './api-log.controller.js';

@Module({
  providers: [ApiLogService],
  controllers: [ApiLogController],
  exports: [ApiLogService],
})
export class ApiLogModule {}
