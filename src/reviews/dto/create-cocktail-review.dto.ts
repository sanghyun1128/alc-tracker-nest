import { PickType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';

import { CocktailReviewModel } from '../entity/review.entity';

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
  @IsOptional()
  images: {
    path: string;
    order: number;
    isNew: boolean;
  }[] = [];
}
