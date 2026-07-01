/** Default weights from PRD Section 11 */
export const DEFAULT_WEIGHTS = {
  citizen_demand: 0.30,
  demographic_need: 0.20,
  infrastructure_gap: 0.25,
  feasibility: 0.15,
  plan_alignment: 0.10,
};

/**
 * Recalculate weighted scores and final_score when weights change.
 * Uses existing raw (0–100) values from each recommendation.
 */
export function applyWeights(recommendations, weights) {
  return recommendations
    .map((rec) => {
      const score_breakdown = {};
      let final_score = 0;

      for (const [key, val] of Object.entries(rec.score_breakdown)) {
        const w = weights[key] ?? val.weight;
        const weighted = val.raw * w;
        score_breakdown[key] = { raw: val.raw, weight: w, weighted };
        final_score += weighted;
      }

      return {
        ...rec,
        score_breakdown,
        final_score: Math.round(final_score * 100) / 100,
      };
    })
    .sort((a, b) => b.final_score - a.final_score);
}

export function normalizeWeights(weights) {
  const sum = Object.values(weights).reduce((a, b) => a + b, 0);
  if (sum === 0) return { ...DEFAULT_WEIGHTS };
  const normalized = {};
  for (const [k, v] of Object.entries(weights)) {
    normalized[k] = v / sum;
  }
  return normalized;
}

export function weightsSum(weights) {
  return Object.values(weights).reduce((a, b) => a + b, 0);
}
