import { PickType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';

import { SpiritModel } from '../entity/alcohol.entity';

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
  @IsOptional()
  images: {
    path: string;
    order: number;
    isNew: boolean;
  }[] = [];
}
