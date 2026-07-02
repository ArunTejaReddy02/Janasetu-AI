import { Injectable } from '@nestjs/common';

/** @todo Implement ranking engine in Module 5 — Recommendations */
@Injectable()
export class RecommendationService {
  findAll() {
    return { message: 'Recommendations module — coming in Module 5', data: [] };
  }
}
