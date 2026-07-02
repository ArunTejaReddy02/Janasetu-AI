import { Queue, QueueOptions } from 'bullmq';
import { ConfigService } from '@nestjs/config';

/**
 * Factory to create BullMQ queue instances with shared Redis config.
 */
export const createBullMQQueue = (
  name: string,
  configService: ConfigService,
  options?: Partial<QueueOptions>,
): Queue => {
  return new Queue(name, {
    connection: {
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
      password: configService.get<string>('REDIS_PASSWORD'),
    },
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 50 },
    },
    ...options,
  });
};
