import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
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

  await app.init();
  isReady = true;
}

export async function createServer(): Promise<Express> {
  await bootstrap();
  return server;
}
