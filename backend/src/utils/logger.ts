import * as winston from 'winston';
import { winstonConfig } from '../config/logger';

/**
 * Standalone logger for use outside NestJS DI context
 * (workers, scripts, etc.)
 */
export const logger = winston.createLogger(winstonConfig);
