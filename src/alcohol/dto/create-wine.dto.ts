import { PickType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

import { WineModel } from '../entity/alcohol.entity';
import { stringValidationMessage } from 'src/common/validation-message';

export class CreateWineDto extends PickType(WineModel, [
  'name',
  'category',
  'region',
  'appellation',
  'grape',
  'vintage',
  'maker',
  'alc',
  'price',
  'purchaseLocation',
  'purchaseDate',
] as const) {
  @IsString({
    each: true,
    message: stringValidationMessage,
  })
  @IsOptional()
  images: string[] = [];
}
