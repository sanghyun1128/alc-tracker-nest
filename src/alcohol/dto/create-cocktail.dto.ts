import { IsEnum, IsString } from 'class-validator';

import { CocktailCategoryEnum } from '../const/cocktail.const';

export class CreateCocktailDto {
  @IsString()
  name: string;

  @IsEnum(CocktailCategoryEnum)
  category: CocktailCategoryEnum;
}
