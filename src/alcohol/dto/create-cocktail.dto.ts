import { PickType } from '@nestjs/mapped-types';

import { CocktailModel } from '../entities/alcohol.entity';

export class CreateCocktailDto extends PickType(CocktailModel, [
  'name',
  'category',
] as const) {}
