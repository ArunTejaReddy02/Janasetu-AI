import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { EntityExtractionService } from './entity-extraction.service';
import { SttService } from './stt.service';
import { TranslationService } from './translation.service';
import { EmbeddingService } from './embedding.service';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    EntityExtractionService,
    SttService,
    TranslationService,
    EmbeddingService,
  ],
  exports: [
    AiService,
    EntityExtractionService,
    SttService,
    TranslationService,
    EmbeddingService,
  ],
})
export class AiModule {}
