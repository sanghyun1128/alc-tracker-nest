import { PartialType } from '@nestjs/mapped-types';

import { CreateSpiritDto } from './create-spirit.dto';

export class UpdateSpiritDto extends PartialType(CreateSpiritDto) {}
