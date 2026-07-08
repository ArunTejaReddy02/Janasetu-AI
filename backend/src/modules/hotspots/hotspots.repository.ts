import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class HotspotsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.hotspot.findMany({
      include: {
        submissions: true,
      },
      orderBy: { priorityScore: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.hotspot.findUnique({
      where: { id },
      include: { submissions: true },
    });
  }

  async upsert(id: string, data: any) {
    // Separate submissions connect/disconnect if specified
    const { submissionIds, ...fields } = data;
    const connectSubmissions = submissionIds
      ? { submissions: { connect: submissionIds.map((sid: string) => ({ id: sid })) } }
      : {};

    return this.prisma.hotspot.upsert({
      where: { id },
      update: { ...fields, ...connectSubmissions },
      create: { id, ...fields, ...connectSubmissions },
    });
  }
}
