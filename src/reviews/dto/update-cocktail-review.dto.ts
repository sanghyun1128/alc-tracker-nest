import { PickType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';

import { CreateCocktailReviewDto } from './create-cocktail-review.dto';
import { AlcoholType } from 'src/alcohol/const/alcohol-type.const';
import { enumValidationMessage } from 'src/common/validation-message';

export class UpdateCocktailReviewDto extends PickType(CreateCocktailReviewDto, [
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
] as const) {
  @IsEnum(AlcoholType, {
    message: enumValidationMessage,
  })
  type: AlcoholType;
}
