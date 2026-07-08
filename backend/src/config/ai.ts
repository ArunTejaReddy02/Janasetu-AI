import { registerAs } from '@nestjs/config';

/**
 * AI Services configuration factory.
 * Centralizes all AI provider keys & settings.
 *
 * Primary entity-extraction provider: Google Gemini (@google/generative-ai)
 * Uses native responseSchema / JSON mode for schema-locked output.
 * Model selection:
 *   - gemini-2.5-flash       → high throughput, better quality (default)
 *   - gemini-2.5-pro         → richer model for complex/low-confidence texts
 */
export default registerAs('ai', () => ({
  // ─── Primary: Google Gemini (entity extraction + fallback generation) ────
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    /** High-throughput default; override with 'gemini-2.5-flash' */
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    /** Richer model for complex/low-confidence texts */
    qualityModel: process.env.GEMINI_QUALITY_MODEL || 'gemini-2.5-pro',
  },

  // ─── Google Cloud Platform (STT, project-scoped services) ────────────────
  google: {
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    /** Google Cloud Speech-to-Text v1 language codes supported */
    sttLanguages: ['te-IN', 'hi-IN', 'mr-IN', 'kn-IN', 'ta-IN', 'en-IN'],
  },

  // ─── Bhashini (fallback STT/translation for low-resource Indian languages) 
  bhashini: {
    userId: process.env.BHASHINI_USER_ID,
    apiKey: process.env.BHASHINI_API_KEY,
    inferenceApiKey: process.env.BHASHINI_INFERENCE_API_KEY,
    baseUrl: 'https://dhruva-api.bhashini.gov.in',
  },

  // ─── Sarvam AI (alternative STT/TTS for Indian languages) ────────────────
  sarvam: {
    apiKey: process.env.SARVAM_API_KEY,
    baseUrl: 'https://api.sarvam.ai',
  },

  // ─── OpenAI (retained as stub fallback — not primary) ────────────────────
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  },

  // ─── Embeddings (for semantic clustering — LaBSE preferred for Indian langs)
  embedding: {
    /**
     * Providers (in priority order):
     *   'labse'  → local @xenova/transformers LaBSE (best for Indian languages)
     *   'gemini' → text-embedding-004 via Gemini API (easiest setup)
     *   'openai' → text-embedding-3-small (English-centric, lower quality for Telugu/Hindi)
     */
    provider: process.env.EMBEDDING_PROVIDER || 'gemini',
    model: process.env.EMBEDDING_MODEL || 'text-embedding-004',
    dimensions: parseInt(process.env.EMBEDDING_DIMENSIONS || '768', 10),
  },

  // ─── Clustering tuning (read by clustering.service.ts) ───────────────────
  clustering: {
    /** Cosine similarity threshold for dedup gate (PRD FR-5: ≥0.80) */
    similarityThreshold: parseFloat(process.env.SIMILARITY_THRESHOLD || '0.80'),
    /** DBSCAN parameters on semantic distance matrix */
    dbscanEpsilon: parseFloat(process.env.DBSCAN_EPSILON || '0.15'),
    dbscanMinSamples: parseInt(process.env.DBSCAN_MIN_SAMPLES || '2', 10),
  },
}));
