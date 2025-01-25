import { PickType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

import { SpiritModel } from '../entity/alcohol.entity';
import { stringValidationMessage } from 'src/common/validation-message';

export class CreateSpiritDto extends PickType(SpiritModel, [
  'name',
  'category',
  'cask',
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
  images: {
    path: string;
    order: number;
    isNew: boolean;
  }[] = [];
}
