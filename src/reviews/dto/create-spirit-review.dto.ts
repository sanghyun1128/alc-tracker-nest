import { PickType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

import { SpiritReviewModel } from '../entity/review.entity';
import { stringValidationMessage } from 'src/common/validation-message';

export class CreateSpiritReviewDto extends PickType(SpiritReviewModel, [
  'rating',
  'comment',
  'pairing',
  'nose',
  'palate',
  'finish',
  'bottleCondition',
] as const) {
  @IsString({
    message: stringValidationMessage,
  })
  alcoholId: string;

  @IsOptional()
  images: {
    path: string;
    order: number;
    isNew: boolean;
  }[] = [];
}
