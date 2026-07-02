import { Injectable } from '@nestjs/common';

/** @todo Implement full analytics in Module 7 — Analytics */
@Injectable()
export class AnalyticsService {
  getDashboardStats() {
    return { message: 'Analytics module — coming in Module 7', data: {} };
  }
}
