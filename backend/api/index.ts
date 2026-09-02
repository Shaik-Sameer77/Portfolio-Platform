import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module.js';
import { EncryptInterceptor } from '../src/common/interceptors/encrypt.interceptor.js';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let isInitialized = false;

async function bootstrap() {
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

  const config = new DocumentBuilder()
    .setTitle('Portfolio Platform API')
    .setDescription(
      'Backend-driven portfolio platform — serves all content to the public site and admin dashboard.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,Authorization',
    credentials: true,
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.init();
  isInitialized = true;
}

export default async function handler(req: any, res: any) {
  if (!isInitialized) {
    await bootstrap();
  }
  server(req, res);
}
