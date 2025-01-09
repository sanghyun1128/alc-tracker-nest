import { Type } from 'class-transformer';
import { IsJSON, IsNumber, IsString, ValidateNested } from 'class-validator';

import { CreateDetailEvaluationDto } from './create-detail-evaluation.dto';

export class CreateBaseReviewDto {
  @IsNumber()
  rating: number;

  @IsString()
  comment: string;

  @IsJSON()
  pairing: string;

  @ValidateNested()
  @Type(() => CreateDetailEvaluationDto)
  nose: CreateDetailEvaluationDto;

  @ValidateNested()
  @Type(() => CreateDetailEvaluationDto)
  palate: CreateDetailEvaluationDto;

  @ValidateNested()
  @Type(() => CreateDetailEvaluationDto)
  finish: CreateDetailEvaluationDto;
}
