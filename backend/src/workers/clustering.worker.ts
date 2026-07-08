import { Worker, Job, Queue } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES, JOB_NAMES } from '../queue/queues';
import { ClusteringJobPayload } from '../queue/jobs';
import { PrismaService } from '../database/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as clustering from 'density-clustering';

const logger = new Logger('ClusteringWorker');

function cosineSimilarity(vecA: number[], vecB: number[]) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const createClusteringWorker = (
  redisConnection: any,
  prisma: PrismaService,
  config: ConfigService,
  rankingQueue: Queue,
) =>
  new Worker<ClusteringJobPayload>(
    QUEUE_NAMES.CLUSTERING,
    async (job: Job<ClusteringJobPayload>) => {
      const { submissionId } = job.data;
      logger.log(`Processing clustering job for submission: ${submissionId}`);

      try {
        // 1. Fetch target submission
        const submission = await prisma.submission.findUnique({
          where: { id: submissionId },
        });

        if (!submission || !submission.embedding || submission.embedding.length === 0) {
          logger.warn(`Submission ${submissionId} has no embedding or does not exist`);
          return { clusterId: null, isNew: false };
        }

        const { adminUnitId, category, embedding } = submission;
        if (!adminUnitId || !category) {
          logger.warn(`Submission ${submissionId} is missing adminUnitId or category`);
          return { clusterId: null, isNew: false };
        }

        // Load config limits
        const similarityThreshold = config.get<number>('ai.clustering.similarityThreshold') ?? 0.80;
        const epsilon = config.get<number>('ai.clustering.dbscanEpsilon') ?? 0.15;
        const minSamples = config.get<number>('ai.clustering.dbscanMinSamples') ?? 2;

        // 2. Fetch existing unclustered processed submissions in the same ward and category
        const unclustered = await prisma.submission.findMany({
          where: {
            adminUnitId,
            category,
            status: 'PROCESSED',
            clusterId: null,
            id: { not: submissionId },
          },
        });

        const eligible = [submission, ...unclustered].filter(
          (s) => s.embedding && s.embedding.length === embedding.length,
        );

        // Run DBSCAN if we have enough samples
        if (eligible.length >= minSamples) {
          const dataset = eligible.map((s) => s.embedding);
          const dbscan = new clustering.DBSCAN();
          
          const clusters = dbscan.run(dataset, epsilon, minSamples, (idx1, idx2) => {
            const sim = cosineSimilarity(dataset[idx1], dataset[idx2]);
            return 1.0 - sim;
          });

          // Find if the current submission is part of a newly formed cluster
          let targetClusterIdx = -1;
          for (let i = 0; i < clusters.length; i++) {
            if (clusters[i].includes(0)) {
              targetClusterIdx = i;
              break;
            }
          }

          if (targetClusterIdx !== -1) {
            // Cluster found! Create a new Hotspot
            const clusterMemberIndices = clusters[targetClusterIdx];
            const members = clusterMemberIndices.map((idx) => eligible[idx]);

            // Calculate average coordinates
            let totalLat = 0;
            let totalLng = 0;
            let geoCount = 0;
            members.forEach((m) => {
              if (m.latitude && m.longitude) {
                totalLat += m.latitude;
                totalLng += m.longitude;
                geoCount++;
              }
            });

            const avgLat = geoCount > 0 ? totalLat / geoCount : 17.705;
            const avgLng = geoCount > 0 ? totalLng / geoCount : 83.22;

            // Generate title from category and first member location text
            const firstLocation = members.find((m) => m.locationName)?.locationName || '';
            const locationStr = firstLocation ? ` near ${firstLocation}` : '';
            const categoryLabel = category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
            const title = `${categoryLabel} Issues${locationStr} in Ward ${adminUnitId.replace('AU-VZG-WARD-', '')}`;

            // Create hotspot
            const hotspot = await prisma.hotspot.create({
              data: {
                category,
                title,
                description: `Automatically created hotspot from DBSCAN cluster containing ${members.length} submissions.`,
                adminUnitId,
                latitude: avgLat,
                longitude: avgLng,
                submissionCount: members.length,
                isResolved: false,
              },
            });

            // Update all submissions in the cluster
            await prisma.submission.updateMany({
              where: { id: { in: members.map((m) => m.id) } },
              data: {
                clusterId: hotspot.id,
                status: 'VERIFIED',
              },
            });

            // Enqueue ranking job
            await rankingQueue.add(JOB_NAMES.RANK_HOTSPOTS, { hotspotId: hotspot.id });

            logger.log(`Created new Hotspot ${hotspot.id} with ${members.length} members`);
            return { clusterId: hotspot.id, isNew: true };
          }
        }

        // 3. Fallback: Check if we can merge into an existing active Hotspot in the same ward and category
        const existingHotspots = await prisma.hotspot.findMany({
          where: {
            adminUnitId,
            category,
            isResolved: false,
          },
          include: {
            submissions: {
              where: {
                embedding: { isEmpty: false },
              },
            },
          },
        });

        for (const hp of existingHotspots) {
          const hpSubmissions = hp.submissions.filter((s) => s.embedding && s.embedding.length > 0);
          if (hpSubmissions.length === 0) continue;

          // Calculate average similarity
          let totalSim = 0;
          hpSubmissions.forEach((s) => {
            totalSim += cosineSimilarity(embedding, s.embedding);
          });
          const avgSim = totalSim / hpSubmissions.length;

          if (avgSim >= similarityThreshold) {
            // Match found! Associate submission with existing hotspot
            await prisma.submission.update({
              where: { id: submissionId },
              data: {
                clusterId: hp.id,
                status: 'VERIFIED',
              },
            });

            // Update hotspot submission count
            await prisma.hotspot.update({
              where: { id: hp.id },
              data: {
                submissionCount: { increment: 1 },
              },
            });

            // Enqueue ranking job
            await rankingQueue.add(JOB_NAMES.RANK_HOTSPOTS, { hotspotId: hp.id });

            logger.log(`Merged submission ${submissionId} into existing Hotspot ${hp.id} (similarity: ${avgSim.toFixed(2)})`);
            return { clusterId: hp.id, isNew: false };
          }
        }

        logger.log(`No cluster formed or matched for submission: ${submissionId}`);
        return { clusterId: null, isNew: false };
      } catch (err) {
        logger.error(`Clustering failed for submission ${submissionId}: ${(err as Error).message}`);
        throw err;
      }
    },
    { connection: redisConnection, concurrency: 3 },
  );
