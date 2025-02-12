import { IntersectionType } from '@nestjs/mapped-types';

import { CreateSpiritDto } from './create-spirit.dto';
import { UpdateAlcoholDto } from './update-alcohol.dto';

export class UpdateSpiritDto extends IntersectionType(UpdateAlcoholDto, CreateSpiritDto) {}
