import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { EncryptInterceptor } from './common/interceptors/encrypt.interceptor.js';
import express, { Express } from 'express';

const server: Express = express();
let isReady = false;

async function bootstrap() {
  if (isReady) return;

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
    { rawBody: true },
  );

  app.useGlobalInterceptors(new EncryptInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,Authorization',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Portfolio Platform API')
    .setDescription(
      'Backend-driven portfolio platform — serves all content to the public site and admin dashboard.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.init();
  isReady = true;
}

export async function createServer(): Promise<Express> {
  await bootstrap();
  return server;
}
