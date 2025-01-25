import { PickType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';

import { WineModel } from '../entity/alcohol.entity';

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
  @IsOptional()
  images: {
    path: string;
    order: number;
    isNew: boolean;
  }[] = [];
}
