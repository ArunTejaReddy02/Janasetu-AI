import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto, SubmissionQueryDto } from './submissions.schema';
import { SubmissionStatus, SubmissionChannel, SubmissionLanguage } from '@prisma/client';

@ApiTags('submissions')
@Controller({ path: 'submissions', version: '1' })
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new citizen complaint (Web/Voice/WhatsApp)' })
  @ApiResponse({ status: 201, description: 'Submission successfully received and queued' })
  create(@Body() dto: CreateSubmissionDto) {
    return this.submissionsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated list of submissions' })
  findAll(@Query() query: SubmissionQueryDto) {
    return this.submissionsService.findAll({
      page: query.page,
      limit: query.limit,
      status: query.status as SubmissionStatus,
      channel: query.channel as SubmissionChannel,
      language: query.language as SubmissionLanguage,
      wardId: query.wardId,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a single submission' })
  findOne(@Param('id') id: string) {
    return this.submissionsService.findOne(id);
  }
}
