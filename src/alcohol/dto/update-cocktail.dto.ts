import { IntersectionType } from '@nestjs/mapped-types';

import { CreateCocktailDto } from './create-cocktail.dto';
import { UpdateAlcoholDto } from './update-alcohol.dto';

export class UpdateCocktailDto extends IntersectionType(UpdateAlcoholDto, CreateCocktailDto) {}
