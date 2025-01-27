import { IsEnum } from 'class-validator';

import { CreateCocktailReviewDto } from './create-cocktail-review.dto';
import { AlcoholType } from 'src/alcohol/const/alcohol-type.const';
import { enumValidationMessage } from 'src/common/validation-message';

export class UpdateCocktailReviewDto extends CreateCocktailReviewDto {
  @IsEnum(AlcoholType, {
    message: enumValidationMessage,
  })
  type: AlcoholType;
}
