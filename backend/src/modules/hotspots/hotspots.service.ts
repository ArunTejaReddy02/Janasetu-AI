import { Injectable } from '@nestjs/common';

/** @todo Implement geographic clustering in Module 4 — Hotspots */
@Injectable()
export class HotspotsService {
  findAll() {
    return { message: 'Hotspots module — coming in Module 4', data: [] };
  }
}
