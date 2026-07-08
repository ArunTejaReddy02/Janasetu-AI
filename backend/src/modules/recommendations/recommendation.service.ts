import { Injectable } from '@nestjs/common';

import { RecommendationRepository } from './recommendation.repository';

@Injectable()
export class RecommendationService {
  constructor(private readonly recommendationRepository: RecommendationRepository) {}

  async findAll() {
    return this.recommendationRepository.findAll();
  }
}
