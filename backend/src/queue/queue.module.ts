import { Module, Inject, OnModuleInit, OnApplicationShutdown, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, Worker } from 'bullmq';
import { createBullMQQueue } from './bullmq';
import { QUEUE_NAMES } from './queues';
import { SubmissionsModule } from '../modules/submissions/submissions.module';
import { AiModule } from '../modules/ai/ai.module';
import { PrismaService } from '../database/prisma.service';

// Services
import { SttService } from '../modules/ai/stt.service';
import { TranslationService } from '../modules/ai/translation.service';
import { EntityExtractionService } from '../modules/ai/entity-extraction.service';
import { EmbeddingService } from '../modules/ai/embedding.service';
import { SubmissionsRepository } from '../modules/submissions/submissions.repository';

// Worker factories
import { createSttWorker } from '../workers/stt.worker';
import { createTranslationWorker } from '../workers/translation.worker';
import { createEntityWorker } from '../workers/entity.worker';
import { createClusteringWorker } from '../workers/clustering.worker';
import { createHotspotWorker } from '../workers/hotspot.worker';
import { createRankingWorker } from '../workers/ranking.worker';

@Module({
  imports: [
    forwardRef(() => SubmissionsModule),
    AiModule,
  ],
  providers: [
    {
      provide: 'STT_QUEUE',
      useFactory: (config: ConfigService) => createBullMQQueue(QUEUE_NAMES.STT, config),
      inject: [ConfigService],
    },
    {
      provide: 'TRANSLATION_QUEUE',
      useFactory: (config: ConfigService) => createBullMQQueue(QUEUE_NAMES.TRANSLATION, config),
      inject: [ConfigService],
    },
    {
      provide: 'ENTITY_EXTRACTION_QUEUE',
      useFactory: (config: ConfigService) => createBullMQQueue(QUEUE_NAMES.ENTITY_EXTRACTION, config),
      inject: [ConfigService],
    },
    {
      provide: 'CLUSTERING_QUEUE',
      useFactory: (config: ConfigService) => createBullMQQueue(QUEUE_NAMES.CLUSTERING, config),
      inject: [ConfigService],
    },
    {
      provide: 'RANKING_QUEUE',
      useFactory: (config: ConfigService) => createBullMQQueue(QUEUE_NAMES.RANKING, config),
      inject: [ConfigService],
    },
    {
      provide: 'HOTSPOT_QUEUE',
      useFactory: (config: ConfigService) => createBullMQQueue(QUEUE_NAMES.HOTSPOT, config),
      inject: [ConfigService],
    },
  ],
  exports: [
    'STT_QUEUE',
    'TRANSLATION_QUEUE',
    'ENTITY_EXTRACTION_QUEUE',
    'CLUSTERING_QUEUE',
    'RANKING_QUEUE',
    'HOTSPOT_QUEUE',
  ],
})
export class QueueModule implements OnModuleInit, OnApplicationShutdown {
  private workers: Worker[] = [];

  constructor(
    private readonly configService: ConfigService,
    private readonly sttService: SttService,
    private readonly translationService: TranslationService,
    private readonly entityExtractionService: EntityExtractionService,
    private readonly embeddingService: EmbeddingService,
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => SubmissionsRepository))
    private readonly submissionsRepository: SubmissionsRepository,
    @Inject('TRANSLATION_QUEUE') private readonly translationQueue: Queue,
    @Inject('ENTITY_EXTRACTION_QUEUE') private readonly entityExtractionQueue: Queue,
    @Inject('CLUSTERING_QUEUE') private readonly clusteringQueue: Queue,
    @Inject('RANKING_QUEUE') private readonly rankingQueue: Queue,
  ) {}

  onModuleInit() {
    const redisConfig = this.configService.get('redis');
    const redisConnection = {
      host: redisConfig?.host ?? 'localhost',
      port: redisConfig?.port ?? 6379,
      password: redisConfig?.password,
      maxRetriesPerRequest: null,
    };

    // Instantiate workers
    const sttWorker = createSttWorker(
      redisConnection,
      this.sttService,
      this.submissionsRepository,
      this.translationQueue,
      this.entityExtractionQueue,
    );

    const translationWorker = createTranslationWorker(
      redisConnection,
      this.translationService,
      this.submissionsRepository,
      this.entityExtractionQueue,
    );

    const entityWorker = createEntityWorker(
      redisConnection,
      this.entityExtractionService,
      this.embeddingService,
      this.submissionsRepository,
      this.clusteringQueue,
    );

    const clusteringWorker = createClusteringWorker(
      redisConnection,
      this.prisma,
      this.configService,
      this.rankingQueue,
    );

    const hotspotWorker = createHotspotWorker(
      redisConnection,
      this.prisma,
    );

    const rankingWorker = createRankingWorker(
      redisConnection,
      this.prisma,
    );

    this.workers.push(
      sttWorker,
      translationWorker,
      entityWorker,
      clusteringWorker,
      hotspotWorker,
      rankingWorker,
    );
  }

  async onApplicationShutdown() {
    for (const worker of this.workers) {
      await worker.close().catch((err) => {
        console.error(`Error shutting down worker: ${err.message}`);
      });
    }
  }
}
