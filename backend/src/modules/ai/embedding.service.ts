import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private readonly genAI: GoogleGenerativeAI | null = null;
  private readonly modelName: string;
  private readonly dimensions: number;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('ai.gemini.apiKey');
    this.modelName = this.config.get<string>('ai.embedding.model') ?? 'text-embedding-004';
    this.dimensions = this.config.get<number>('ai.embedding.dimensions') ?? 768;

    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      this.logger.warn('ai.gemini.apiKey is not configured — EmbeddingService will return mock vectors');
    }
  }

  /**
   * Generate vector embedding for a given text.
   *
   * @param text The input string to embed.
   * @returns An array of floats representing the embedding vector.
   */
  async generate(text: string): Promise<number[]> {
    if (!text || text.trim() === '') {
      return new Array(this.dimensions).fill(0);
    }

    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({ model: this.modelName });
        const result = await model.embedContent(text);
        if (result && result.embedding && result.embedding.values) {
          return result.embedding.values;
        }
      } catch (err) {
        this.logger.error(`Failed to generate Gemini embedding: ${(err as Error).message}`);
      }
    }

    // Mock fallback (semi-deterministic based on text hash to be reliable in tests)
    this.logger.debug(`Returning mock vector of dimension ${this.dimensions}`);
    const mock = new Array(this.dimensions).fill(0);
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    for (let i = 0; i < this.dimensions; i++) {
      mock[i] = Math.sin(hash + i) * 0.1;
    }
    return mock;
  }
}
