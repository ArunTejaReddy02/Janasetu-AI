import { registerAs } from '@nestjs/config';

/**
 * Database configuration factory.
 * Registered as a namespaced config key 'database'.
 */
export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  logLevel:
    process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
}));
