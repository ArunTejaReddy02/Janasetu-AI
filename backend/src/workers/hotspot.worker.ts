import { Worker, Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES } from '../queue/queues';
import { PrismaService } from '../database/prisma.service';

const logger = new Logger('HotspotWorker');

export const createHotspotWorker = (redisConnection: any, prisma: PrismaService) =>
  new Worker(
    QUEUE_NAMES.HOTSPOT,
    async (job: Job<any>) => {
      const { hotspotId } = job.data;
      logger.log(`Processing hotspot job ${job.id} for hotspot: ${hotspotId}`);
      if (!hotspotId) return;

      try {
        const hotspot = await prisma.hotspot.findUnique({
          where: { id: hotspotId },
          include: { submissions: true },
        });

        if (!hotspot) {
          logger.warn(`Hotspot ${hotspotId} not found`);
          return;
        }

        const submissions = hotspot.submissions;
        const count = submissions.length;
        if (count === 0) {
          await prisma.hotspot.update({
            where: { id: hotspotId },
            data: { isResolved: true, submissionCount: 0 },
          });
          return;
        }

        let totalLat = 0;
        let totalLng = 0;
        let geoCount = 0;
        submissions.forEach((s) => {
          if (s.latitude && s.longitude) {
            totalLat += s.latitude;
            totalLng += s.longitude;
            geoCount++;
          }
        });

        const avgLat = geoCount > 0 ? totalLat / geoCount : hotspot.latitude;
        const avgLng = geoCount > 0 ? totalLng / geoCount : hotspot.longitude;

        await prisma.hotspot.update({
          where: { id: hotspotId },
          data: {
            submissionCount: count,
            latitude: avgLat,
            longitude: avgLng,
          },
        });

        logger.log(`Hotspot ${hotspotId} updated metrics (Submissions: ${count})`);
      } catch (err) {
        logger.error(`Failed to process hotspot ${hotspotId}: ${(err as Error).message}`);
        throw err;
      }
    },
    { connection: redisConnection, concurrency: 2 },
  );
