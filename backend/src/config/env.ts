import * as Joi from 'joi';

/**
 * Joi validation schema for all environment variables.
 * Ensures the app fails fast on misconfiguration.
 */
export const envValidationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  PORT: Joi.number().default(3000),
  APP_NAME: Joi.string().default('JanaSetu-AI-Backend'),
  API_PREFIX: Joi.string().default('api'),

  // Database
  DATABASE_URL: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // Redis
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_URL: Joi.string().default('redis://localhost:6379'),

  // Rate limiting
  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(100),

  // CORS
  CORS_ORIGINS: Joi.string().default('http://localhost:5173'),

  // Swagger
  SWAGGER_ENABLED: Joi.boolean().default(true),

  // Optional AI & Storage keys
  OPENAI_API_KEY: Joi.string().optional().allow(''),
  GEMINI_API_KEY: Joi.string().optional().allow(''),
  SARVAM_API_KEY: Joi.string().optional().allow(''),
  BHASHINI_API_KEY: Joi.string().optional().allow(''),
  GOOGLE_CLOUD_PROJECT_ID: Joi.string().optional().allow(''),
  GCS_BUCKET_NAME: Joi.string().optional().allow(''),
  TWILIO_ACCOUNT_SID: Joi.string().optional().allow(''),
  TWILIO_AUTH_TOKEN: Joi.string().optional().allow(''),
  SMTP_HOST: Joi.string().optional().allow(''),
  SMTP_PORT: Joi.number().default(587),
  SMTP_USER: Joi.string().optional().allow(''),
  SMTP_PASS: Joi.string().optional().allow(''),
  EMAIL_FROM: Joi.string().optional().allow(''),
});
