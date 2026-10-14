import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const origin = process.env.CORS_ORIGIN ?? 'http://localhost:3000';
  app.enableCors({ origin, credentials: true });

  const port = Number(process.env.API_PORT ?? 4100);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`WedLink API listening on http://localhost:${port}/api`);
}

bootstrap();
