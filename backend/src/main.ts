import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WinstonModule } from 'nest-winston';
import * as helmet from 'helmet';
import * as compression from 'compression';

import { AppModule } from './app.module';
import { winstonConfig } from './config/logger';
import { HttpExceptionFilter } from './middleware/error.middleware';
import { TransformInterceptor } from './middleware/transform.interceptor';

async function bootstrap() {
  const logger = WinstonModule.createLogger(winstonConfig);

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api');

  // ─── Security ───────────────────────────────────────────────
  app.use(helmet.default());
  app.use(compression());

  // ─── CORS ───────────────────────────────────────────────────
  const corsOrigins = configService
    .get<string>('CORS_ORIGINS', 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim());

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // ─── Versioning ─────────────────────────────────────────────
  app.setGlobalPrefix(apiPrefix);
  app.enableVersioning({ type: VersioningType.URI });

  // ─── Global Pipes ───────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ─── Global Filters & Interceptors ──────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // ─── Swagger ────────────────────────────────────────────────
  if (configService.get<string>('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('JanaSetu-AI API')
      .setDescription(
        'Multilingual Civic Demand Intelligence & Prioritization Platform — API Documentation',
      )
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT',
      )
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management')
      .addTag('submissions', 'Citizen submissions')
      .addTag('hotspots', 'Demand hotspots')
      .addTag('recommendations', 'AI-generated recommendations')
      .addTag('projects', 'Development projects')
      .addTag('analytics', 'Analytics & insights')
      .addTag('notifications', 'Notification management')
      .addTag('settings', 'Platform settings')
      .addTag('ai', 'AI processing pipeline')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }

  await app.listen(port);
  logger.log(`🚀 JanaSetu-AI Backend running on http://localhost:${port}`, 'Bootstrap');
  logger.log(`📚 Swagger docs at http://localhost:${port}/${apiPrefix}/docs`, 'Bootstrap');
}

bootstrap();
