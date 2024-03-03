import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      maxAge: 600,
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8190);
}
bootstrap();
