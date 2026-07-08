import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class RecommendationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.recommendation.findMany({
      include: {
        hotspot: {
          include: {
            submissions: true,
          },
        },
        project: true,
      },
      orderBy: { compositeScore: 'desc' },
    });
  }

  async upsert(id: string, data: any) {
    return this.prisma.recommendation.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });
  }
}
