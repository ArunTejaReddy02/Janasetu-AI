import { Worker, Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES } from '../queue/queues';
import { EntityExtractionJobPayload } from '../queue/jobs';

const logger = new Logger('EntityWorker');

/** @todo Implement NER + categorization in Module 3 — AI Pipeline */
export const createEntityWorker = (redisConnection: any) =>
  new Worker<EntityExtractionJobPayload>(
    QUEUE_NAMES.ENTITY_EXTRACTION,
    async (job: Job<EntityExtractionJobPayload>) => {
      logger.log(`Processing entity extraction job: ${job.id}`);
      return { entities: {}, category: 'INFRASTRUCTURE', urgencyScore: 0.5 };
    },
    { connection: redisConnection, concurrency: 5 },
  );
