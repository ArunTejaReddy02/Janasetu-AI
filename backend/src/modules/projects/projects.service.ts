import { Injectable } from '@nestjs/common';

/** @todo Implement in Module 6 — Projects */
@Injectable()
export class ProjectsService {
  findAll() {
    return { message: 'Projects module — coming in Module 6', data: [] };
  }
}
