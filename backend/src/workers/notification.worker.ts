import { Worker, Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES } from '../queue/queues';
import { NotificationJobPayload } from '../queue/jobs';

const logger = new Logger('NotificationWorker');

/** @todo Implement email/WhatsApp/SMS dispatch in Module 8 — Notifications */
export const createNotificationWorker = (redisConnection: any) =>
  new Worker<NotificationJobPayload>(
    QUEUE_NAMES.NOTIFICATION,
    async (job: Job<NotificationJobPayload>) => {
      logger.log(`Processing notification job: ${job.id} via ${job.data.channel}`);
    },
    { connection: redisConnection, concurrency: 10 },
  );
