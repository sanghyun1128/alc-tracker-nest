import { IntersectionType, PickType } from '@nestjs/mapped-types';

import { CreateReviewDto } from './create-review.dto';
import { CocktailReviewModel } from '../entity/review.entity';

export class CreateCocktailReviewDto extends IntersectionType(
  CreateReviewDto,
  PickType(CocktailReviewModel, [
    'rating',
    'comment',
    'pairing',
    'nose',
    'palate',
    'finish',
    'ingredients',
    'recipe',
    'alc',
  ] as const),
) {}
