import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Invygo scheduler')
    .setDescription('The Invygo scheduler API docs')
    .setVersion('1.0')
    .addTag('scheduler')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
    }),
  );
  app.use(cookieParser());

  await app.listen(80);
}
bootstrap();
