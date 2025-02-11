import { IntersectionType, PickType } from '@nestjs/mapped-types';

import { CreateAlcoholDto } from './create-alcohol.dto';
import { CocktailModel } from '../entity/alcohol.entity';

export class CreateCocktailDto extends IntersectionType(
  CreateAlcoholDto,
  PickType(CocktailModel, ['name', 'category'] as const),
) {}
