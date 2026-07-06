import { IsString, IsOptional, IsBoolean, IsNumber, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { SubmissionChannel, SubmissionLanguage } from '@prisma/client';

export class SubmissionLocationDto {
  @IsNumber()
  @IsOptional()
  lat?: number;

  @IsNumber()
  @IsOptional()
  lng?: number;

  @IsString()
  @IsOptional()
  admin_unit_id?: string;

  @IsString()
  @IsOptional()
  source?: string;
}

export class CreateSubmissionDto {
  @IsEnum(SubmissionChannel)
  channel: SubmissionChannel;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  audioUrl?: string;

  @IsEnum(SubmissionLanguage)
  @IsOptional()
  language?: SubmissionLanguage;

  @IsBoolean()
  consent: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => SubmissionLocationDto)
  location?: SubmissionLocationDto;
}

export class SubmissionQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  channel?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  wardId?: string;
}
