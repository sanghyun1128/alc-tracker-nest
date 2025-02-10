import { IntersectionType, PickType } from '@nestjs/mapped-types';

import { CreateCocktailReviewDto } from './create-cocktail-review.dto';
import { UpdateReviewDto } from './update-review.dto';

export class UpdateCocktailReviewDto extends IntersectionType(
  UpdateReviewDto,
  PickType(CreateCocktailReviewDto, [
    'rating',
    'comment',
    'pairing',
    'nose',
    'palate',
    'finish',
    'ingredients',
    'recipe',
    'alc',
    'images',
  ] as const),
) {}
