import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { PortfolioModule } from './modules/portfolio/portfolio.module.js';
import { UploadModule } from './modules/upload/upload.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { BlogModule } from './modules/blog/blog.module.js';
import { DecryptMiddleware } from './common/middleware/decrypt.middleware.js';

@Module({
  imports: [
    PrismaModule,
    PortfolioModule,
    UploadModule,
    AuthModule,
    BlogModule,
  ],
  controllers: [AppController],

  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DecryptMiddleware).forRoutes('*');
  }
}
