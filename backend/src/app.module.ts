import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { PortfolioModule } from './modules/portfolio/portfolio.module.js';
import { UploadModule } from './modules/upload/upload.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { BlogModule } from './modules/blog/blog.module.js';
import { ApiLogModule } from './modules/api-log/api-log.module.js';
import { ProductModule } from './modules/product/product.module.js';
import { MailModule } from './modules/mail/mail.module.js';
import { AppointmentModule } from './modules/appointment/appointment.module.js';
import { PaymentModule } from './modules/payment/payment.module.js';
import { ChatbotModule } from './modules/chatbot/chatbot.module.js';
import { DecryptMiddleware } from './common/middleware/decrypt.middleware.js';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';

@Module({
  imports: [
    PrismaModule,
    PortfolioModule,
    UploadModule,
    AuthModule,
    BlogModule,
    ApiLogModule,
    ProductModule,
    MailModule,
    AppointmentModule,
    PaymentModule,
    ChatbotModule,
  ],
  controllers: [AppController],

  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DecryptMiddleware).forRoutes('*');
  }
}
