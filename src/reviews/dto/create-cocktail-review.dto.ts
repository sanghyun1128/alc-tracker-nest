import { PickType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

import { CocktailReviewModel } from '../entity/review.entity';
import { stringValidationMessage } from 'src/common/validation-message';

export class CreateCocktailReviewDto extends PickType(CocktailReviewModel, [
  'rating',
  'comment',
  'pairing',
  'nose',
  'palate',
  'finish',
  'ingredients',
  'recipe',
  'alc',
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
