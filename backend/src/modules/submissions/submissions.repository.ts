import { Injectable } from '@nestjs/common';
import { Prisma, Submission } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SubmissionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.SubmissionCreateInput): Promise<Submission> {
    return this.prisma.submission.create({ data });
  }

  async findById(id: string): Promise<Submission | null> {
    return this.prisma.submission.findUnique({
      where: { id },
      include: {
        submittedBy: true,
      },
    });
  }

  async update(id: string, data: Prisma.SubmissionUpdateInput): Promise<Submission> {
    return this.prisma.submission.update({
      where: { id },
      data,
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SubmissionWhereUniqueInput;
    where?: Prisma.SubmissionWhereInput;
    orderBy?: Prisma.SubmissionOrderByWithRelationInput;
  }): Promise<{ data: Submission[]; total: number }> {
    const { skip, take, cursor, where, orderBy } = params;
    const [data, total] = await Promise.all([
      this.prisma.submission.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy: orderBy ?? { submittedAt: 'desc' },
      }),
      this.prisma.submission.count({ where }),
    ]);
    return { data, total };
  }
}
