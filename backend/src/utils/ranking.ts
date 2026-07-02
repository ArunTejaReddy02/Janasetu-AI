import { DEFAULT_SCORING_WEIGHTS } from './constants';

export interface ScoringWeights {
  urgency: number;
  impact: number;
  feasibility: number;
  costBenefit: number;
}

export interface ScoringInputs {
  urgencyScore: number;       // 0-100
  impactScore: number;        // 0-100
  feasibilityScore: number;   // 0-100
  costBenefitScore: number;   // 0-100
  submissionCount?: number;
  affectedCount?: number;
  recencyBonus?: number;      // 0-1 multiplier for recent submissions
}

/**
 * Calculate composite priority score for a hotspot.
 * Uses weighted sum of normalised sub-scores.
 */
export function calculateCompositeScore(
  inputs: ScoringInputs,
  weights: ScoringWeights = {
    urgency: DEFAULT_SCORING_WEIGHTS.URGENCY,
    impact: DEFAULT_SCORING_WEIGHTS.IMPACT,
    feasibility: DEFAULT_SCORING_WEIGHTS.FEASIBILITY,
    costBenefit: DEFAULT_SCORING_WEIGHTS.COST_BENEFIT,
  },
): number {
  const base =
    inputs.urgencyScore * weights.urgency +
    inputs.impactScore * weights.impact +
    inputs.feasibilityScore * weights.feasibility +
    inputs.costBenefitScore * weights.costBenefit;

  const recencyMultiplier = inputs.recencyBonus ?? 1;

  return Math.min(100, Math.round(base * recencyMultiplier * 100) / 100);
}

/**
 * Normalise a raw count (0 to maxVal) to a 0–100 score using log scaling.
 */
export function normaliseCount(value: number, maxVal: number = 1000): number {
  if (value <= 0) return 0;
  return Math.min(100, (Math.log1p(value) / Math.log1p(maxVal)) * 100);
}
