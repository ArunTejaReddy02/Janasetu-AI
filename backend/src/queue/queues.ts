// ─── Queue Names ──────────────────────────────────────────────

export const QUEUE_NAMES = {
  STT: 'stt-queue',
  TRANSLATION: 'translation-queue',
  ENTITY_EXTRACTION: 'entity-extraction-queue',
  CLUSTERING: 'clustering-queue',
  RANKING: 'ranking-queue',
  HOTSPOT: 'hotspot-queue',
  NOTIFICATION: 'notification-queue',
} as const;

// ─── Job Names ────────────────────────────────────────────────

export const JOB_NAMES = {
  // STT
  TRANSCRIBE_AUDIO: 'transcribe-audio',

  // Translation
  TRANSLATE_TEXT: 'translate-text',

  // Entity Extraction
  EXTRACT_ENTITIES: 'extract-entities',
  GENERATE_EMBEDDING: 'generate-embedding',

  // Clustering
  CLUSTER_SUBMISSIONS: 'cluster-submissions',
  UPDATE_HOTSPOT: 'update-hotspot',

  // Ranking
  RANK_HOTSPOTS: 'rank-hotspots',
  GENERATE_RECOMMENDATION: 'generate-recommendation',

  // Notification
  SEND_EMAIL: 'send-email',
  SEND_WHATSAPP: 'send-whatsapp',
  SEND_SMS: 'send-sms',
} as const;

// ─── Job Default Options ──────────────────────────────────────

export const DEFAULT_JOB_OPTIONS = {
  attempts: 3,
  backoff: {
    type: 'exponential' as const,
    delay: 2000,
  },
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 50 },
};
