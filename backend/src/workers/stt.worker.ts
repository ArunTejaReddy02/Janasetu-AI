import { Worker, Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES, JOB_NAMES } from '../queue/queues';
import { SttJobPayload } from '../queue/jobs';

const logger = new Logger('SttWorker');

/** @todo Implement STT processing in Module 3 — AI Pipeline */
export const createSttWorker = (redisConnection: any) =>
  new Worker<SttJobPayload>(
    QUEUE_NAMES.STT,
    async (job: Job<SttJobPayload>) => {
      logger.log(`Processing STT job: ${job.id} for submission: ${job.data.submissionId}`);
      // TODO: Call Bhashini/Google STT API
      return { transcript: 'stub', language: job.data.language };
    },
    { connection: redisConnection, concurrency: 5 },
  );
