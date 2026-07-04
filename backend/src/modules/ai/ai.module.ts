import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { EntityExtractionService } from './entity-extraction.service';

@Module({
  controllers: [AiController],
  providers: [AiService, EntityExtractionService],
  exports: [AiService, EntityExtractionService],
})
export class AiModule {}
