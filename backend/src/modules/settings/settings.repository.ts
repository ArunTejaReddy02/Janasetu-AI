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
}
