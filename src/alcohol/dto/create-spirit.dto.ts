import { IntersectionType, PickType } from '@nestjs/mapped-types';

import { CreateAlcoholDto } from './create-alcohol.dto';
import { SpiritModel } from '../entity/alcohol.entity';

export class CreateSpiritDto extends IntersectionType(
  CreateAlcoholDto,
  PickType(SpiritModel, [
    'name',
    'category',
    'cask',
    'maker',
    'alc',
    'price',
    'purchaseLocation',
    'purchaseDate',
  ] as const),
) {}
