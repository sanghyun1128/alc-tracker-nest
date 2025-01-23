import { PartialType, OmitType } from '@nestjs/mapped-types';

import { CreateSpiritDto } from './create-spirit.dto';

export class UpdateSpiritDto extends OmitType(PartialType(CreateSpiritDto), ['images'] as const) {}
