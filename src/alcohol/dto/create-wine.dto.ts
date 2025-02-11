import { IntersectionType, PickType } from '@nestjs/mapped-types';

import { CreateAlcoholDto } from './create-alcohol.dto';
import { WineModel } from '../entity/alcohol.entity';

export class CreateWineDto extends IntersectionType(
  CreateAlcoholDto,
  PickType(WineModel, [
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
  ] as const),
) {}
