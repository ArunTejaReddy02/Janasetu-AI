import { Worker, Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES } from '../queue/queues';
import { ClusteringJobPayload } from '../queue/jobs';

const logger = new Logger('ClusteringWorker');

/** @todo Implement DBSCAN clustering in Module 4 — Hotspots */
export const createClusteringWorker = (redisConnection: any) =>
  new Worker<ClusteringJobPayload>(
    QUEUE_NAMES.CLUSTERING,
    async (job: Job<ClusteringJobPayload>) => {
      logger.log(`Processing clustering job: ${job.id}`);
      return { clusterId: null, isNew: false };
    },
    { connection: redisConnection, concurrency: 3 },
  );
