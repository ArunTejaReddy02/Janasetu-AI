import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

/** @todo Implement in Module 2 — Submissions */
@Injectable()
export class SubmissionsRepository {
  constructor(private readonly prisma: PrismaService) {}
}
