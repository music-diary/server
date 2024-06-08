import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { swaggerConfig } from './docs/swagger.options';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggerInterceptor } from './interceptors/logger.interceptor';

const PORT = process.env.PORT || 5000;
const SERVER_DOMAIN = process.env.SERVER_DOMAIN;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // cors
  const corsOptions = {
    origin: [
      'http://localhost:5000',
      'http://localhost:9988',
      `https://dev.${SERVER_DOMAIN}`,
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    exposedHeaders: 'Content-Type, Authorization',
    credentials: true,
  };
  app.enableCors(corsOptions);

  const config = swaggerConfig;
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/api-docs', app, document);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggerInterceptor());
  app.setGlobalPrefix('api/v1');
  await app.listen(PORT);
}
bootstrap();
