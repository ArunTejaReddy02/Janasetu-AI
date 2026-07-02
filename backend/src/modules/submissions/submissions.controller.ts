import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';

@ApiTags('submissions')
@Controller({ path: 'submissions', version: '1' })
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get()
  findAll() {
    return this.submissionsService.findAll();
  }
}
