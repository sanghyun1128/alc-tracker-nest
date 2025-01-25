import { PickType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';

import { CocktailModel } from '../entity/alcohol.entity';

export class CreateCocktailDto extends PickType(CocktailModel, ['name', 'category'] as const) {
  @IsOptional()
  images: {
    path: string;
    order: number;
    isNew: boolean;
  }[] = [];
}
