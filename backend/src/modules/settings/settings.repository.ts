import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SettingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.settings.findMany({ orderBy: { category: 'asc' } });
  }

  async findByKey(key: string) {
    return this.prisma.settings.findUnique({ where: { key } });
  }

  async update(key: string, value: any) {
    return this.prisma.settings.update({
      where: { key },
      data: { value },
    });
  }

  async upsert(key: string, value: any, description?: string, category?: string) {
    return this.prisma.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value, description, category },
    });
  }
}
