import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'JanaSetu-AI Backend',
      version: '1.0.0',
      uptime: process.uptime(),
    };
  }

  getRoot() {
    return {
      name: 'JanaSetu-AI Backend',
      description: 'Multilingual Civic Demand Intelligence & Prioritization Platform',
      version: '1.0.0',
      docs: '/api/docs',
    };
  }
}
