import { PickType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';

import { SpiritReviewModel } from '../entity/review.entity';

export class CreateSpiritReviewDto extends PickType(SpiritReviewModel, [
  'rating',
  'comment',
  'pairing',
  'nose',
  'palate',
  'finish',
  'bottleCondition',
] as const) {
  @IsOptional()
  images: {
    path: string;
    order: number;
    isNew: boolean;
  }[] = [];
}
