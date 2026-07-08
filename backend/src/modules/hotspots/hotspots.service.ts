import { Injectable } from '@nestjs/common';

import { HotspotsRepository } from './hotspots.repository';

@Injectable()
export class HotspotsService {
  constructor(private readonly hotspotsRepository: HotspotsRepository) {}

  async findAll() {
    return this.hotspotsRepository.findAll();
  }
}
