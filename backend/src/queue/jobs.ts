// ─── Job Payload Types ────────────────────────────────────────

export interface SttJobPayload {
  submissionId: string;
  audioUrl: string;
  language: string;
  provider?: 'bhashini' | 'google' | 'whisper';
}

export interface TranslationJobPayload {
  submissionId: string;
  text: string;
  sourceLanguage: string;
  targetLanguage?: string; // defaults to 'ENGLISH'
  provider?: 'bhashini' | 'google';
}

export interface EntityExtractionJobPayload {
  submissionId: string;
  text: string;
  language: string;
}

export interface EmbeddingJobPayload {
  submissionId: string;
  text: string;
}

export interface ClusteringJobPayload {
  submissionId: string;
  wardId?: string;
  latitude?: number;
  longitude?: number;
  category?: string;
}

export interface RankingJobPayload {
  hotspotId: string;
}

export interface NotificationJobPayload {
  notificationId: string;
  userId?: string;
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'IN_APP';
  template?: string;
  data?: Record<string, any>;
}
