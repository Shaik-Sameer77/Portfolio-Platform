import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { PortfolioModule } from './modules/portfolio/portfolio.module.js';
import { UploadModule } from './modules/upload/upload.module.js';
import { AuthModule } from './modules/auth/auth.module.js';

@Module({
  imports: [
    PrismaModule,
    PortfolioModule,
    UploadModule,
    AuthModule,
  ],
  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
