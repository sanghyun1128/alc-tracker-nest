import { IsEnum } from 'class-validator';

import { CreateCocktailDto } from './create-cocktail.dto';
import { AlcoholType } from '../const/alcohol-type.const';
import { enumValidationMessage } from 'src/common/validation-message';

export class UpdateCocktailDto extends CreateCocktailDto {
  @IsEnum(AlcoholType, {
    message: enumValidationMessage,
  })
  type: AlcoholType;
}
