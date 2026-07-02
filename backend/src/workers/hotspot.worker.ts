import { Worker, Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES } from '../queue/queues';

const logger = new Logger('HotspotWorker');

/** @todo Implement hotspot detection in Module 4 — Hotspots */
export const createHotspotWorker = (redisConnection: any) =>
  new Worker(
    QUEUE_NAMES.HOTSPOT,
    async (job: Job) => {
      logger.log(`Processing hotspot job: ${job.id}`);
    },
    { connection: redisConnection, concurrency: 2 },
  );
