import { PickType } from '@nestjs/mapped-types';

import { CreateAlcoholImageDto } from './create-alcohol-image';

export class UpdateAlcoholImageDto extends PickType(CreateAlcoholImageDto, ['order'] as const) {}
