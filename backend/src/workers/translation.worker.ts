import { Worker, Job, Queue } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES, JOB_NAMES } from '../queue/queues';
import { TranslationJobPayload } from '../queue/jobs';
import { TranslationService } from '../modules/ai/translation.service';
import { SubmissionsRepository } from '../modules/submissions/submissions.repository';
import { SubmissionStatus } from '@prisma/client';

const logger = new Logger('TranslationWorker');

export const createTranslationWorker = (
  redisConnection: any,
  translationService: TranslationService,
  submissionsRepository: SubmissionsRepository,
  entityExtractionQueue: Queue,
) =>
  new Worker<TranslationJobPayload>(
    QUEUE_NAMES.TRANSLATION,
    async (job: Job<TranslationJobPayload>) => {
      const { submissionId, text, sourceLanguage, targetLanguage } = job.data;
      logger.log(`Processing translation job ${job.id} for submission: ${submissionId}`);

      try {
        await submissionsRepository.update(submissionId, {
          status: SubmissionStatus.PROCESSING,
          processingLog: { stage: 'TRANSLATION', startedAt: new Date().toISOString() },
        });

        // Call Translation Service
        const target = targetLanguage ?? 'ENGLISH';
        const translated = await translationService.translate(text, sourceLanguage, target);

        // Update database with translated text
        await submissionsRepository.update(submissionId, {
          translatedText: translated,
          processingLog: { stage: 'TRANSLATION', completedAt: new Date().toISOString() },
        });

        // Route to entity extraction
        await entityExtractionQueue.add(JOB_NAMES.EXTRACT_ENTITIES, {
          submissionId,
          text: translated,
          language: target,
        });

        return { translatedText: translated, targetLanguage: target };
      } catch (err) {
        logger.error(`Translation worker failed for job ${job.id}: ${(err as Error).message}`);
        await submissionsRepository.update(submissionId, {
          status: SubmissionStatus.MANUAL_REVIEW_NEEDED,
          processingLog: { stage: 'TRANSLATION', error: (err as Error).message },
        });
        throw err;
      }
    },
    { connection: redisConnection, concurrency: 10 },
  );
