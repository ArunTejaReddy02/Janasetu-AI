import { Module } from '@nestjs/common';
import { HotspotsController } from './hotspots.controller';
import { HotspotsService } from './hotspots.service';
import { HotspotsRepository } from './hotspots.repository';

@Module({
  controllers: [HotspotsController],
  providers: [HotspotsService, HotspotsRepository],
  exports: [HotspotsService],
})
export class HotspotsModule {}
