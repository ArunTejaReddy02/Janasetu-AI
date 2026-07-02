export interface RecommendationScore {
  urgency: number;
  impact: number;
  feasibility: number;
  costBenefit: number;
  composite: number;
  weights: {
    urgency: number;
    impact: number;
    feasibility: number;
    costBenefit: number;
  };
}

export interface RecommendationActionItem {
  title: string;
  description: string;
  responsible?: string;
  dueDate?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface GeneratedRecommendation {
  title: string;
  rationale: string;
  actionItems: RecommendationActionItem[];
  estimatedCost?: number;
  estimatedBenefit?: number;
  timelineMonths?: number;
  score: RecommendationScore;
}
