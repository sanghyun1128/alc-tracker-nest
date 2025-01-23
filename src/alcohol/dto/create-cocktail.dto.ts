import { PickType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

import { CocktailModel } from '../entity/alcohol.entity';
import { stringValidationMessage } from 'src/common/validation-message';

export class CreateCocktailDto extends PickType(CocktailModel, ['name', 'category'] as const) {
  @IsString({
    each: true,
    message: stringValidationMessage,
  })
  @IsOptional()
  images: string[] = [];
}
