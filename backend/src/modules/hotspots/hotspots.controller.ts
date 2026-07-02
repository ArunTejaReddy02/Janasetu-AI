import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HotspotsService } from './hotspots.service';

@ApiTags('hotspots')
@Controller({ path: 'hotspots', version: '1' })
export class HotspotsController {
  constructor(private readonly hotspotsService: HotspotsService) {}

  @Get()
  findAll() {
    return this.hotspotsService.findAll();
  }
}
