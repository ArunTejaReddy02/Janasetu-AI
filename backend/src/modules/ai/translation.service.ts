import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v2 } from '@google-cloud/translate';

const ISO_MAP: Record<string, string> = {
  ENGLISH: 'en',
  HINDI: 'hi',
  TELUGU: 'te',
  KANNADA: 'kn',
  TAMIL: 'ta',
  MARATHI: 'mr',
  BENGALI: 'bn',
  GUJARATI: 'gu',
  PUNJABI: 'pa',
  MALAYALAM: 'ml',
  ODIA: 'or',
  URDU: 'ur',
};

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);
  private readonly translateClient: v2.Translate | null = null;
  private readonly genAI: GoogleGenerativeAI | null = null;
  private readonly modelName: string;

  constructor(private readonly config: ConfigService) {
    const projectId = this.config.get<string>('ai.google.projectId');
    const keyFilename = this.config.get<string>('ai.google.credentialsPath');
    const geminiApiKey = this.config.get<string>('ai.gemini.apiKey');
    this.modelName = this.config.get<string>('ai.gemini.model') ?? 'gemini-2.0-flash-lite';

    // 1. Initialize Google Cloud Translate if configured
    if (projectId || keyFilename || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      this.translateClient = new v2.Translate({
        ...(projectId ? { projectId } : {}),
        ...(keyFilename ? { keyFilename } : {}),
      });
      this.logger.log('Google Cloud Translation client initialized');
    }

    // 2. Initialize Gemini (as primary fallback)
    if (geminiApiKey) {
      this.genAI = new GoogleGenerativeAI(geminiApiKey);
    }

    if (!this.translateClient && !this.genAI) {
      this.logger.warn(
        'Neither Google Cloud Translate nor Gemini configuration found — TranslationService will use mock responses',
      );
    }
  }

  /**
   * Translate text to English or another target language.
   *
   * @param text The text to translate.
   * @param sourceLang The language code/name of the input text.
   * @param targetLang The target language name/code (defaults to 'ENGLISH').
   * @returns The translated string.
   */
  async translate(text: string, sourceLang: string, targetLang = 'ENGLISH'): Promise<string> {
    if (!text || text.trim() === '') {
      return '';
    }

    const sourceIso = ISO_MAP[sourceLang.toUpperCase()] ?? 'auto';
    const targetIso = ISO_MAP[targetLang.toUpperCase()] ?? 'en';

    if (sourceIso === targetIso) {
      return text;
    }

    // Try Google Cloud Translation Client first
    if (this.translateClient) {
      try {
        this.logger.debug(`Sending translation request to Google Cloud Translate API...`);
        const [translation] = await this.translateClient.translate(text, {
          from: sourceIso === 'auto' ? undefined : sourceIso,
          to: targetIso,
        });
        if (translation) {
          this.logger.log(`Google Cloud successfully translated text from ${sourceIso} to ${targetIso}`);
          return translation;
        }
      } catch (err) {
        this.logger.error(
          `Google Cloud Translate API failed: ${(err as Error).message} — falling back to Gemini`,
        );
      }
    }

    // Fallback 1: Translate using Google Gemini API
    if (this.genAI) {
      try {
        this.logger.debug(`Falling back to Google Gemini Translate prompt...`);
        const model = this.genAI.getGenerativeModel({ model: this.modelName });
        const prompt = `You are a translation assistant for a civic feedback system in India.
Translate the following text from source language "${sourceLang}" to target language "${targetLang}".
Only output the translated text. Do not add explanations, quotes, or markdown.

Text to translate:
"""
${text}
"""`;

        const result = await model.generateContent(prompt);
        const translated = result.response.text().trim();
        return translated.replace(/^"|"$/g, '');
      } catch (err) {
        this.logger.error(`Gemini translation failed: ${(err as Error).message}`);
      }
    }

    // Fallback 2: Basic Mock translation
    this.logger.warn(`All translation engines failed. Returning text with mock prefix.`);
    return `[Translated from ${sourceLang}]: ${text}`;
  }
}
