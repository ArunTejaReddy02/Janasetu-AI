import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';

@ApiTags('settings')
@Controller({ path: 'settings', version: '1' })
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @Get('ranking-weights')
  getRankingWeights() {
    return this.settingsService.getRankingWeights();
  }

  @Put('ranking-weights')
  updateRankingWeights(@Body() weights: Record<string, number>) {
    return this.settingsService.updateRankingWeights(weights);
  }
}
