import { PickType } from '@nestjs/mapped-types';

import { ImageModel } from 'src/common/entities/image.entity';

export class CreateAlcoholImageDto extends PickType(ImageModel, ['alcohol', 'order', 'path', 'type'] as const) {}
