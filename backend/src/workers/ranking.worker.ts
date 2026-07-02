import { Worker, Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES } from '../queue/queues';
import { RankingJobPayload } from '../queue/jobs';

const logger = new Logger('RankingWorker');

/** @todo Implement composite scoring in Module 5 — Recommendations */
export const createRankingWorker = (redisConnection: any) =>
  new Worker<RankingJobPayload>(
    QUEUE_NAMES.RANKING,
    async (job: Job<RankingJobPayload>) => {
      logger.log(`Processing ranking job for hotspot: ${job.data.hotspotId}`);
      return { priorityScore: 0, recommendation: null };
    },
    { connection: redisConnection, concurrency: 3 },
  );
