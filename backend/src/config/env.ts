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
  API_VERSION: Joi.string().default('v1'),

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
  REDIS_PASSWORD: Joi.string().optional().allow(''),
  REDIS_URL: Joi.string().default('redis://localhost:6379'),

  // Rate limiting
  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(100),

  // CORS
  CORS_ORIGINS: Joi.string().default('http://localhost:5173'),

  // Swagger
  SWAGGER_ENABLED: Joi.boolean().default(true),
  SWAGGER_PATH: Joi.string().default('api/docs'),

  // AI & Storage Configuration
  EMBEDDING_PROVIDER: Joi.string().default('gemini'),
  EMBEDDING_MODEL: Joi.string().default('text-embedding-004'),
  EMBEDDING_DIMENSIONS: Joi.number().default(768),
  SIMILARITY_THRESHOLD: Joi.number().default(0.80),
  DBSCAN_EPSILON: Joi.number().default(0.15),
  DBSCAN_MIN_SAMPLES: Joi.number().default(2),
  STT_CONFIDENCE_THRESHOLD: Joi.number().default(0.50),

  // Storage
  STORAGE_PROVIDER: Joi.string().default('local'),
  GCS_BUCKET_NAME: Joi.string().optional().allow(''),
  GCS_BASE_URL: Joi.string().default('https://storage.googleapis.com'),
  LOCAL_UPLOAD_PATH: Joi.string().default('./uploads'),

  // Optional AI & Third Party Integration Keys
  OPENAI_API_KEY: Joi.string().optional().allow(''),
  GEMINI_API_KEY: Joi.string().optional().allow(''),
  SARVAM_API_KEY: Joi.string().optional().allow(''),
  BHASHINI_API_KEY: Joi.string().optional().allow(''),
  BHASHINI_USER_ID: Joi.string().optional().allow(''),
  BHASHINI_INFERENCE_API_KEY: Joi.string().optional().allow(''),
  GOOGLE_CLOUD_PROJECT_ID: Joi.string().optional().allow(''),
  GOOGLE_APPLICATION_CREDENTIALS: Joi.string().optional().allow(''),
  TWILIO_ACCOUNT_SID: Joi.string().optional().allow(''),
  TWILIO_AUTH_TOKEN: Joi.string().optional().allow(''),
  TWILIO_WHATSAPP_NUMBER: Joi.string().optional().allow(''),
  SMTP_HOST: Joi.string().optional().allow(''),
  SMTP_PORT: Joi.number().default(587),
  SMTP_USER: Joi.string().optional().allow(''),
  SMTP_PASS: Joi.string().optional().allow(''),
  EMAIL_FROM: Joi.string().optional().allow(''),
});
