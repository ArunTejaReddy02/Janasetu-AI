import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidationSchema } from './config/env';
import { PrismaModule } from './database/prisma.module';

import databaseConfig from './config/database';
import redisConfig from './config/redis';
import aiConfig from './config/ai';

// Auth & Users
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

// Feature Modules (stubs — filled in subsequent phases)
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { AiModule } from './modules/ai/ai.module';
import { QueueModule } from './queue/queue.module';
import { HotspotsModule } from './modules/hotspots/hotspots.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    // ─── Config (global) ──────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, redisConfig, aiConfig],
      envFilePath: ['.env.local', '.env'],
      validationSchema: envValidationSchema,
      validationOptions: { allowUnknown: true, abortEarly: false },
    }),

    // ─── Rate Limiting ────────────────────────────────────────
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),

    // ─── Database ─────────────────────────────────────────────
    PrismaModule,

    // ─── Core Modules ─────────────────────────────────────────
    AuthModule,
    UsersModule,

    // ─── Feature Modules (stubs) ──────────────────────────────
    SubmissionsModule,
    AiModule,
    QueueModule,
    HotspotsModule,
    RecommendationsModule,
    ProjectsModule,
    AnalyticsModule,
    NotificationsModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
