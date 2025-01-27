import { PickType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';

import { WineReviewModel } from '../entity/review.entity';

export class CreateWineDto extends PickType(WineReviewModel, [
  'rating',
  'comment',
  'pairing',
  'nose',
  'palate',
  'finish',
  'aeration',
] as const) {
  @IsOptional()
  images: {
    path: string;
    order: number;
    isNew: boolean;
  }[] = [];
}
