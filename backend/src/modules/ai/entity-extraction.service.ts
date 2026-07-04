import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GoogleGenerativeAI,
  SchemaType,
  type Schema,
} from '@google/generative-ai';

// ─── Output shape (downstream NLP worker depends on this exactly) ─────────────

export type FacilityType =
  | 'water_infrastructure'
  | 'roads'
  | 'education'
  | 'sanitation'
  | 'lighting'
  | 'health'
  | 'other';

export type UrgencyLevel = 'critical' | 'high' | 'normal' | 'low';
export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface ExtractedEntities {
  facility_type: FacilityType;
  urgency: UrgencyLevel;
  location_text: string;
  population_affected_estimate: number | null;
  duration_mentioned: string | null;
  summary: string;
  sentiment: Sentiment;
  /** 0.0 – 1.0 confidence in the extraction; caller uses this for routing */
  extraction_confidence: number;
}

// ─── Gemini responseSchema (native JSON mode — schema-locked) ─────────────────
// Using SchemaType from @google/generative-ai to constrain model output.
// This is more reliable than prompt-only JSON instructions because sampling is
// constrained to valid JSON matching the schema at the model's decode step.

const ENTITY_RESPONSE_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    facility_type: {
      type: SchemaType.STRING,
      enum: [
        'water_infrastructure',
        'roads',
        'education',
        'sanitation',
        'lighting',
        'health',
        'other',
      ],
      description: 'Primary civic facility type the complaint relates to',
    } as Schema,
    urgency: {
      type: SchemaType.STRING,
      enum: ['critical', 'high', 'normal', 'low'],
      description:
        'Urgency level — critical = immediate safety risk, high = significant disruption, normal = inconvenience, low = minor or aspirational',
    } as Schema,
    location_text: {
      type: SchemaType.STRING,
      description:
        'Verbatim or cleaned location reference from the text (ward, landmark, street name). Empty string if none mentioned.',
    },
    population_affected_estimate: {
      type: SchemaType.NUMBER,
      description:
        'Estimated number of people affected. Return 0 if not mentioned. Do not guess beyond what the text implies.',
      nullable: true,
    },
    duration_mentioned: {
      type: SchemaType.STRING,
      description:
        'Duration the problem has persisted as stated in the text (e.g. "2 weeks", "since monsoon"). Null if not mentioned.',
      nullable: true,
    },
    summary: {
      type: SchemaType.STRING,
      description:
        'Neutral 1–2 sentence summary of the civic issue. Do not editorialize. Max 200 characters.',
    },
    sentiment: {
      type: SchemaType.STRING,
      enum: ['positive', 'negative', 'neutral'],
      description: 'Overall sentiment of the citizen report',
    } as Schema,
    extraction_confidence: {
      type: SchemaType.NUMBER,
      description:
        'Your confidence in the extraction as a float 0.0–1.0. Use < 0.5 if the text is ambiguous, incomplete, or unrelated to civic needs.',
    },
  },
  required: [
    'facility_type',
    'urgency',
    'location_text',
    'summary',
    'sentiment',
    'extraction_confidence',
  ],
};

// ─── Keyword fallback (PRD §10, §19) ─────────────────────────────────────────
// Used when Gemini API is unavailable or returns extraction_confidence < 0.3.
// Covers English + common transliterations of Telugu, Hindi, Marathi keywords.

const KEYWORD_MAP: Record<FacilityType, string[]> = {
  water_infrastructure: [
    'water', 'borewell', 'bore well', 'hand pump', 'handpump', 'pipe', 'tap',
    'supply', 'pani', 'neeru', 'jal', 'borewells',
  ],
  roads: [
    'road', 'pothole', 'rasta', 'street', 'path', 'highway', 'pavement',
    'bridge', 'junction', 'damaged road',
  ],
  education: [
    'school', 'college', 'anganwadi', 'iti', 'education', 'teacher',
    'student', 'class', 'training',
  ],
  sanitation: [
    'garbage', 'waste', 'drain', 'sewage', 'toilet', 'dustbin', 'smell',
    'kachara', 'safai', 'cleanliness',
  ],
  lighting: [
    'light', 'street light', 'lamp', 'dark', 'electricity', 'bulb',
    'flickering', 'lighting',
  ],
  health: [
    'hospital', 'clinic', 'doctor', 'medicine', 'health centre', 'ambulance',
    'dispensary', 'medical',
  ],
  other: [],
};

function keywordFallback(text: string): ExtractedEntities {
  const lower = text.toLowerCase();
  let bestType: FacilityType = 'other';
  let bestCount = 0;

  for (const [type, keywords] of Object.entries(KEYWORD_MAP) as [FacilityType, string[]][]) {
    const count = keywords.filter((kw) => lower.includes(kw)).length;
    if (count > bestCount) {
      bestCount = count;
      bestType = type;
    }
  }

  return {
    facility_type: bestType,
    urgency: 'normal',
    location_text: '',
    population_affected_estimate: null,
    duration_mentioned: null,
    summary: text.slice(0, 200),
    sentiment: 'negative',
    extraction_confidence: 0.2, // signals to caller that this is a degraded fallback
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class EntityExtractionService {
  private readonly logger = new Logger(EntityExtractionService.name);
  private readonly genAI: GoogleGenerativeAI;
  /** High-throughput model for most requests */
  private readonly defaultModel: string;
  /** Higher-quality model for retries on borderline confidence */
  private readonly qualityModel: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('ai.gemini.apiKey');
    if (!apiKey) {
      this.logger.warn(
        'GEMINI_API_KEY is not set — entity extraction will use keyword fallback only',
      );
    }
    this.genAI = new GoogleGenerativeAI(apiKey ?? '');
    this.defaultModel =
      this.config.get<string>('ai.gemini.model') ?? 'gemini-2.0-flash-lite';
    this.qualityModel =
      this.config.get<string>('ai.gemini.qualityModel') ?? 'gemini-2.5-flash';
  }

  /**
   * Extract structured civic entities from English text.
   *
   * @param englishText  Text already translated to English (translation-first pipeline).
   * @param useQualityModel  Set true to use gemini-2.5-flash (auto-triggered on low confidence).
   * @returns ExtractedEntities — identical shape regardless of which path fills it.
   *          The NLP worker does not need to branch on extraction path.
   */
  async extract(
    englishText: string,
    useQualityModel = false,
  ): Promise<ExtractedEntities> {
    const modelName = useQualityModel ? this.qualityModel : this.defaultModel;

    try {
      const model = this.genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          // Native JSON mode: model output is constrained to valid JSON matching
          // ENTITY_RESPONSE_SCHEMA at the token-decode level (not prompt-only).
          responseMimeType: 'application/json',
          responseSchema: ENTITY_RESPONSE_SCHEMA,
          temperature: 0.1, // low → deterministic, schema-faithful output
          maxOutputTokens: 512,
        },
      });

      const result = await model.generateContent(this.buildPrompt(englishText));
      const raw = result.response.text();
      const parsed: ExtractedEntities = JSON.parse(raw);

      // Auto-retry with higher-quality model if confidence is borderline
      if (parsed.extraction_confidence < 0.45 && !useQualityModel) {
        this.logger.debug(
          `Low confidence (${parsed.extraction_confidence}) from ${modelName} — retrying with ${this.qualityModel}`,
        );
        return this.extract(englishText, true);
      }

      this.logger.debug(
        `Extracted: facility=${parsed.facility_type} urgency=${parsed.urgency} ` +
        `confidence=${parsed.extraction_confidence} model=${modelName}`,
      );

      return parsed;
    } catch (err) {
      this.logger.error(
        `Gemini entity extraction failed (model=${modelName}): ${(err as Error).message}` +
        ` — falling back to keyword matching`,
      );
      return keywordFallback(englishText);
    }
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private buildPrompt(text: string): string {
    return `You are a civic complaint analyst for an Indian constituency dashboard.

Extract structured information from the following citizen complaint text.
The text has already been translated to English.

Rules:
- Use ONLY information present in the text. Do not infer beyond what is stated.
- location_text: copy the location reference verbatim or slightly cleaned — do not geocode it.
- summary: must be neutral, factual, 1–2 sentences, max 200 characters.
- extraction_confidence: reflect how clearly the text maps to a specific civic facility complaint.
  Use < 0.5 if the text is unrelated to civic needs, nonsensical, or too ambiguous.

Citizen complaint:
"""
${text}
"""`;
  }
}
