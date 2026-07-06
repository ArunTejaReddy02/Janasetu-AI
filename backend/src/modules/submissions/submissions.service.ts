import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Submission, SubmissionStatus, SubmissionChannel, SubmissionLanguage, Prisma } from '@prisma/client';
import { SubmissionsRepository } from './submissions.repository';
import { JOB_NAMES } from '../../queue/queues';
import { CreateSubmissionDto } from './submissions.schema';

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly repository: SubmissionsRepository,
    @Inject('STT_QUEUE') private readonly sttQueue: Queue,
    @Inject('TRANSLATION_QUEUE') private readonly translationQueue: Queue,
    @Inject('ENTITY_EXTRACTION_QUEUE') private readonly entityExtractionQueue: Queue,
  ) {}

  async create(dto: CreateSubmissionDto): Promise<Submission> {
    // 1. Prepare location coords / admin unit logic
    let latitude = dto.location?.lat;
    let longitude = dto.location?.lng;
    let adminUnitId = dto.location?.admin_unit_id;

    // 2. Create in DB
    const submission = await this.repository.create({
      channel: dto.channel as SubmissionChannel,
      status: SubmissionStatus.PENDING,
      language: (dto.language ?? 'ENGLISH') as SubmissionLanguage,
      rawText: dto.text,
      audioUrl: dto.audioUrl,
      latitude,
      longitude,
      adminUnitId,
      consentState: dto.consent ? 'given' : 'not_given',
    });

    // 3. Queue Initial Stage
    if (dto.audioUrl) {
      await this.sttQueue.add(JOB_NAMES.TRANSCRIBE_AUDIO, {
        submissionId: submission.id,
        audioUrl: dto.audioUrl,
        language: submission.language,
      });
    } else if (dto.text) {
      const isEnglish = submission.language === 'ENGLISH';
      if (isEnglish) {
        await this.entityExtractionQueue.add(JOB_NAMES.EXTRACT_ENTITIES, {
          submissionId: submission.id,
          text: dto.text,
          language: 'ENGLISH',
        });
      } else {
        await this.translationQueue.add(JOB_NAMES.TRANSLATE_TEXT, {
          submissionId: submission.id,
          text: dto.text,
          sourceLanguage: submission.language,
        });
      }
    }

    return submission;
  }

  async findOne(id: string): Promise<Submission> {
    const submission = await this.repository.findById(id);
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
    return submission;
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    status?: SubmissionStatus;
    channel?: SubmissionChannel;
    language?: SubmissionLanguage;
    wardId?: string;
  }) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.SubmissionWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.channel) where.channel = query.channel;
    if (query.language) where.language = query.language;
    if (query.wardId) where.wardId = query.wardId;

    const { data, total } = await this.repository.findMany({
      skip,
      take: limit,
      where,
      orderBy: { submittedAt: 'desc' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
