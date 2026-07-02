import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RecommendationService } from './recommendation.service';

@ApiTags('recommendations')
@Controller({ path: 'recommendations', version: '1' })
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get()
  findAll() {
    return this.recommendationService.findAll();
  }
}
