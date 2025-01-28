import { PickType } from '@nestjs/mapped-types';

import { ImageModel } from 'src/common/entity/image.entity';

export class CreateImageDto extends PickType(ImageModel, [
  'alcohol',
  'review',
  'user',
  'order',
  'path',
  'type',
] as const) {}
