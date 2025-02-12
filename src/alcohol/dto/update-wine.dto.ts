import { IntersectionType } from '@nestjs/mapped-types';

import { CreateWineDto } from './create-wine.dto';
import { UpdateAlcoholDto } from './update-alcohol.dto';

export class UpdateWineDto extends IntersectionType(UpdateAlcoholDto, CreateWineDto) {}
