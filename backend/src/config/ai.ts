import { registerAs } from '@nestjs/config';

/**
 * AI Services configuration factory.
 * Centralizes all AI provider keys & settings.
 */
export default registerAs('ai', () => ({
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
  },
  bhashini: {
    userId: process.env.BHASHINI_USER_ID,
    apiKey: process.env.BHASHINI_API_KEY,
    inferenceApiKey: process.env.BHASHINI_INFERENCE_API_KEY,
    baseUrl: 'https://dhruva-api.bhashini.gov.in',
  },
  sarvam: {
    apiKey: process.env.SARVAM_API_KEY,
    baseUrl: 'https://api.sarvam.ai',
  },
  google: {
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  },
  embedding: {
    provider: process.env.EMBEDDING_PROVIDER || 'openai',
    model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
    dimensions: parseInt(process.env.EMBEDDING_DIMENSIONS || '1536', 10),
  },
}));
