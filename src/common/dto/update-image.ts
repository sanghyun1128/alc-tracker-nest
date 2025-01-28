import { PickType } from '@nestjs/mapped-types';

import { CreateImageDto } from './create-image';

export class UpdateImageDto extends PickType(CreateImageDto, ['order'] as const) {}
