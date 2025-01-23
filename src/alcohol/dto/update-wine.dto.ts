import { PartialType, OmitType } from '@nestjs/mapped-types';

import { CreateWineDto } from './create-wine.dto';

export class UpdateWineDto extends OmitType(PartialType(CreateWineDto), ['images'] as const) {}
