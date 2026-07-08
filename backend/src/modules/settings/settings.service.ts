import { Injectable } from '@nestjs/common';
import { SettingsRepository } from './settings.repository';

/** @todo Full settings management in Module 9 — Settings */
@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async findAll() {
    return this.settingsRepository.findAll();
  }

  async getRankingWeights(): Promise<Record<string, number>> {
    const keys = {
      'scoring.urgency_weight': 'citizen_demand',
      'scoring.impact_weight': 'demographic_need',
      'scoring.feasibility_weight': 'feasibility',
      'scoring.cost_benefit_weight': 'infrastructure_gap',
      'scoring.plan_alignment_weight': 'plan_alignment',
    };

    const weights: Record<string, number> = {
      citizen_demand: 0.30,
      demographic_need: 0.20,
      infrastructure_gap: 0.25,
      feasibility: 0.15,
      plan_alignment: 0.10,
    };

    for (const [dbKey, frontendKey] of Object.entries(keys)) {
      const setting = await this.settingsRepository.findByKey(dbKey);
      if (setting && typeof setting.value === 'number') {
        weights[frontendKey] = setting.value;
      }
    }

    return weights;
  }

  async updateRankingWeights(weights: Record<string, number>) {
    const keys = {
      citizen_demand: 'scoring.urgency_weight',
      demographic_need: 'scoring.impact_weight',
      feasibility: 'scoring.feasibility_weight',
      infrastructure_gap: 'scoring.cost_benefit_weight',
      plan_alignment: 'scoring.plan_alignment_weight',
    };

    for (const [frontendKey, dbKey] of Object.entries(keys)) {
      if (weights[frontendKey] !== undefined) {
        await this.settingsRepository.upsert(
          dbKey,
          weights[frontendKey],
          `Weight for ${frontendKey} in composite ranking`,
          'scoring',
        );
      }
    }

    return { success: true, weights };
  }
}
