import { PickType } from '@nestjs/mapped-types';

import { SpiritModel } from '../entities/alcohol.entity';

export class CreateSpiritDto extends PickType(SpiritModel, [
  'name',
  'category',
  'cask',
  'maker',
  'alc',
  'price',
  'purchaseLocation',
  'purchaseDate',
] as const) {}
