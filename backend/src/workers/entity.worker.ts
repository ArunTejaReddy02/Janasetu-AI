import { Worker, Job, Queue } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES, JOB_NAMES } from '../queue/queues';
import { EntityExtractionService } from '../modules/ai/entity-extraction.service';
import { EmbeddingService } from '../modules/ai/embedding.service';
import { SubmissionsRepository } from '../modules/submissions/submissions.repository';
import { SubmissionStatus } from '@prisma/client';

const logger = new Logger('EntityWorker');

export const createEntityWorker = (
  redisConnection: any,
  entityExtractionService: EntityExtractionService,
  embeddingService: EmbeddingService,
  submissionsRepository: SubmissionsRepository,
  clusteringQueue: Queue,
) =>
  new Worker(
    QUEUE_NAMES.ENTITY_EXTRACTION,
    async (job: Job<any>) => {
      const { submissionId, text } = job.data;

      if (job.name === JOB_NAMES.EXTRACT_ENTITIES) {
        logger.log(`Processing entity extraction job ${job.id} for submission: ${submissionId}`);
        try {
          await submissionsRepository.update(submissionId, {
            status: SubmissionStatus.PROCESSING,
            processingLog: { stage: 'ENTITY_EXTRACTION', startedAt: new Date().toISOString() },
          });

          // Call Gemini Entity Extraction Service
          const result = await entityExtractionService.extract(text);

          // Map urgency level to numerical score
          let urgencyScore = 0.25; // default low
          if (result.urgency === 'critical') urgencyScore = 1.0;
          else if (result.urgency === 'high') urgencyScore = 0.75;
          else if (result.urgency === 'normal') urgencyScore = 0.5;

          // Update database with entities
          await submissionsRepository.update(submissionId, {
            category: result.facility_type.toUpperCase(),
            entities: result as any,
            sentiment: result.sentiment.toUpperCase(),
            urgencyScore,
            locationName: result.location_text || null,
            processingLog: { stage: 'ENTITY_EXTRACTION', completedAt: new Date().toISOString() },
          });

          // Enqueue embedding generation next
          await (job as any).queue.add(JOB_NAMES.GENERATE_EMBEDDING, {
            submissionId,
            text,
          });

          return result;
        } catch (err) {
          logger.error(`Entity extraction failed for job ${job.id}: ${(err as Error).message}`);
          await submissionsRepository.update(submissionId, {
            status: SubmissionStatus.MANUAL_REVIEW_NEEDED,
            processingLog: { stage: 'ENTITY_EXTRACTION', error: (err as Error).message },
          });
          throw err;
        }
      }

      if (job.name === JOB_NAMES.GENERATE_EMBEDDING) {
        logger.log(`Processing embedding generation job ${job.id} for submission: ${submissionId}`);
        try {
          await submissionsRepository.update(submissionId, {
            processingLog: { stage: 'EMBEDDING', startedAt: new Date().toISOString() },
          });

          // Generate embedding vector
          const vector = await embeddingService.generate(text);

          // Update database and finalize status to PROCESSED
          await submissionsRepository.update(submissionId, {
            embedding: vector,
            status: SubmissionStatus.PROCESSED,
            processedAt: new Date(),
            processingLog: { stage: 'EMBEDDING', completedAt: new Date().toISOString() },
          });

          // Trigger downstream spatial clustering queue
          await clusteringQueue.add(JOB_NAMES.CLUSTER_SUBMISSIONS, {
            submissionId,
          });

          return { embeddingSize: vector.length };
        } catch (err) {
          logger.error(`Embedding generation failed for job ${job.id}: ${(err as Error).message}`);
          await submissionsRepository.update(submissionId, {
            status: SubmissionStatus.MANUAL_REVIEW_NEEDED,
            processingLog: { stage: 'EMBEDDING', error: (err as Error).message },
          });
          throw err;
        }
      }

      logger.warn(`Unknown job name in entity extraction queue: ${job.name}`);
    },
    { connection: redisConnection, concurrency: 5 },
  );
