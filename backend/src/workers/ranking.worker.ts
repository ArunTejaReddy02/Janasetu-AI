import { Worker, Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES } from '../queue/queues';
import { RankingJobPayload } from '../queue/jobs';
import { PrismaService } from '../database/prisma.service';

const logger = new Logger('RankingWorker');

export const createRankingWorker = (redisConnection: any, prisma: PrismaService) =>
  new Worker<RankingJobPayload>(
    QUEUE_NAMES.RANKING,
    async (job: Job<RankingJobPayload>) => {
      const { hotspotId } = job.data;
      logger.log(`Processing ranking job for hotspot: ${hotspotId}`);
      if (!hotspotId) return { priorityScore: 0, recommendation: null };

      try {
        // 1. Fetch hotspot and associated submissions
        const hotspot = await prisma.hotspot.findUnique({
          where: { id: hotspotId },
          include: { submissions: true, adminUnit: true },
        });

        if (!hotspot) {
          logger.warn(`Hotspot ${hotspotId} not found for ranking`);
          return { priorityScore: 0, recommendation: null };
        }

        const count = hotspot.submissionCount || hotspot.submissions.length || 1;

        // 2. Fetch weights from settings table
        const defaultWeights = {
          'scoring.urgency_weight': 0.35,
          'scoring.impact_weight': 0.30,
          'scoring.feasibility_weight': 0.20,
          'scoring.cost_benefit_weight': 0.15,
          'scoring.plan_alignment_weight': 0.10,
        };

        const weights: Record<string, number> = {};
        for (const [key, defaultVal] of Object.entries(defaultWeights)) {
          const setting = await prisma.settings.findUnique({ where: { key } });
          weights[key] = setting && typeof setting.value === 'number' ? setting.value : defaultVal;
        }

        // Normalize weights if they don't sum to 1.0 (though they should)
        const sum = Object.values(weights).reduce((a, b) => a + b, 0);
        const normWeights = { ...weights };
        if (sum > 0 && Math.abs(sum - 1.0) > 0.001) {
          for (const key of Object.keys(normWeights)) {
            normWeights[key] = normWeights[key] / sum;
          }
        }

        // 3. Compute raw scores (0–100)
        // Citizen Demand: based on submission count
        const citizenDemandRaw = Math.min(count * 5, 100);
        // Demographic Need: population or default
        const population = hotspot.adminUnit?.population ?? 50000;
        const demographicNeedRaw = Math.min(Math.round(population / 1000), 100);
        // Infrastructure Gap: severity or default
        const severityMap: Record<string, number> = { LOW: 40, MEDIUM: 65, HIGH: 85, CRITICAL: 100 };
        const infrastructureGapRaw = severityMap[hotspot.severity] ?? 70;
        // Feasibility: default
        const feasibilityRaw = 80;
        // Plan Alignment: default
        const planAlignmentRaw = 75;

        // 4. Calculate composite score
        const urgencyScore = citizenDemandRaw / 100;
        const impactScore = demographicNeedRaw / 100;
        const feasibilityScore = feasibilityRaw / 100;
        const costBenefitScore = infrastructureGapRaw / 100; // mapped to gap
        const planAlignmentScore = planAlignmentRaw / 100;

        const compositeScoreValue =
          urgencyScore * (normWeights['scoring.urgency_weight'] ?? 0.35) +
          impactScore * (normWeights['scoring.impact_weight'] ?? 0.30) +
          feasibilityScore * (normWeights['scoring.feasibility_weight'] ?? 0.20) +
          costBenefitScore * (normWeights['scoring.cost_benefit_weight'] ?? 0.15) +
          planAlignmentScore * (normWeights['scoring.plan_alignment_weight'] ?? 0.10);

        const compositeScorePct = Math.round(compositeScoreValue * 10000) / 100; // 0 - 100 scale

        // 5. Update hotspot priorityScore
        await prisma.hotspot.update({
          where: { id: hotspotId },
          data: { priorityScore: compositeScorePct },
        });

        // 6. Create or update Recommendation
        const recommendationId = `REC-${hotspotId}`;
        const title = `Development Project — ${hotspot.title}`;
        const rationale = `Recommended due to concentrated citizen complaints (${count} reports) in ${hotspot.adminUnit?.name || 'Ward ' + hotspot.adminUnitId} for ${hotspot.category.toLowerCase().replace(/_/g, ' ')}.`;

        const rawScores = {
          citizen_demand: citizenDemandRaw,
          demographic_need: demographicNeedRaw,
          infrastructure_gap: infrastructureGapRaw,
          feasibility: feasibilityRaw,
          plan_alignment: planAlignmentRaw,
        };

        const rec = await prisma.recommendation.upsert({
          where: { id: recommendationId },
          update: {
            urgencyScore,
            impactScore,
            feasibilityScore,
            costBenefitScore,
            compositeScore: compositeScorePct,
            title,
            rationale,
            metadata: { rawScores, weights: normWeights },
          },
          create: {
            id: recommendationId,
            hotspotId,
            urgencyScore,
            impactScore,
            feasibilityScore,
            costBenefitScore,
            compositeScore: compositeScorePct,
            title,
            rationale,
            metadata: { rawScores, weights: normWeights },
          },
        });

        logger.log(`Generated recommendation ${rec.id} for hotspot: ${hotspotId} with score: ${compositeScorePct}`);
        return { priorityScore: compositeScorePct, recommendation: rec };
      } catch (err) {
        logger.error(`Failed to generate recommendation for hotspot ${hotspotId}: ${(err as Error).message}`);
        throw err;
      }
    },
    { connection: redisConnection, concurrency: 3 },
  );
