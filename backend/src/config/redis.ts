import { registerAs } from '@nestjs/config';

/**
 * Redis configuration factory.
 * Registered as a namespaced config key 'redis'.
 */
export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  // BullMQ connection options
  maxRetriesPerRequest: null,
  retryStrategy: (times: number) => Math.min(times * 50, 2000),
}));
