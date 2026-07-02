import { Injectable } from '@nestjs/common';
import { SettingsRepository } from './settings.repository';

/** @todo Full settings management in Module 9 — Settings */
@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async findAll() {
    return this.settingsRepository.findAll();
  }
}
