import { Worker, Job, Queue } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES, JOB_NAMES } from '../queue/queues';
import { SttJobPayload } from '../queue/jobs';
import { SttService } from '../modules/ai/stt.service';
import { SubmissionsRepository } from '../modules/submissions/submissions.repository';
import { SubmissionStatus } from '@prisma/client';

const logger = new Logger('SttWorker');

export const createSttWorker = (
  redisConnection: any,
  sttService: SttService,
  submissionsRepository: SubmissionsRepository,
  translationQueue: Queue,
  entityExtractionQueue: Queue,
) =>
  new Worker<SttJobPayload>(
    QUEUE_NAMES.STT,
    async (job: Job<SttJobPayload>) => {
      const { submissionId, audioUrl, language } = job.data;
      logger.log(`Processing STT job ${job.id} for submission: ${submissionId}`);

      try {
        // Update status to processing
        await submissionsRepository.update(submissionId, {
          status: SubmissionStatus.PROCESSING,
          processingLog: { stage: 'STT', startedAt: new Date().toISOString() },
        });

        // Call STT Service
        const { transcript, confidence } = await sttService.transcribe(audioUrl, language);

        // Update database with transcript
        await submissionsRepository.update(submissionId, {
          rawText: transcript,
          sttConfidence: confidence,
          processingLog: { stage: 'STT', completedAt: new Date().toISOString() },
        });

        // Route to the next stage in queue
        const isEnglish = language.toUpperCase() === 'ENGLISH' || language.toUpperCase() === 'EN';
        if (isEnglish) {
          await entityExtractionQueue.add(JOB_NAMES.EXTRACT_ENTITIES, {
            submissionId,
            text: transcript,
            language: 'ENGLISH',
          });
        } else {
          await translationQueue.add(JOB_NAMES.TRANSLATE_TEXT, {
            submissionId,
            text: transcript,
            sourceLanguage: language,
          });
        }

        return { transcript, confidence };
      } catch (err) {
        logger.error(`STT worker failed for job ${job.id}: ${(err as Error).message}`);
        await submissionsRepository.update(submissionId, {
          status: SubmissionStatus.MANUAL_REVIEW_NEEDED,
          processingLog: { stage: 'STT', error: (err as Error).message },
        });
        throw err;
      }
    },
    { connection: redisConnection, concurrency: 5 },
  );
