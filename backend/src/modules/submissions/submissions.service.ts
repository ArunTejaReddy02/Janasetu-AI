import { Injectable } from '@nestjs/common';

/** @todo Implement in Module 2 — Submissions */
@Injectable()
export class SubmissionsService {
  findAll() {
    return { message: 'Submissions module — coming in Module 2', data: [] };
  }
}
