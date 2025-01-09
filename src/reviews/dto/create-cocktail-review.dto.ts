import { IsJSON, IsNumber } from 'class-validator';

import { CreateBaseReviewDto } from './create-base-review.dto';

export class CreateCocktailReviewDto extends CreateBaseReviewDto {
  @IsNumber()
  cocktailId: number;

  @IsJSON()
  ingredients: string;

  @IsJSON()
  recipe: string;

  @IsNumber()
  alc: number;
}
