import { PartialType, OmitType } from '@nestjs/mapped-types';

import { CreateCocktailDto } from './create-cocktail.dto';

export class UpdateCocktailDto extends OmitType(PartialType(CreateCocktailDto), [
  'images',
] as const) {}
