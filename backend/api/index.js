import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let bootstrapPromise = null;

async function bootstrap() {
  // Dynamic import from pre-compiled dist/ to avoid @vercel/node TS compilation
  const { AppModule } = await import('../dist/app.module.js');
  const { EncryptInterceptor } = await import('../dist/common/interceptors/encrypt.interceptor.js');

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
}

export default async function handler(req, res) {
  if (!bootstrapPromise) {
    bootstrapPromise = bootstrap();
  }
  await bootstrapPromise;
  server(req, res);
}
