import { PickType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

import { WineReviewModel } from '../entity/review.entity';
import { stringValidationMessage } from 'src/common/validation-message';

export class CreateWineReviewDto extends PickType(WineReviewModel, [
  'rating',
  'comment',
  'pairing',
  'nose',
  'palate',
  'finish',
  'aeration',
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
