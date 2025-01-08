import { IsEnum, IsNumber, IsString, IsDate } from 'class-validator';

import {
  CombinedAppellationType,
  GrapeVarietyEnum,
  WineCategoryEnum,
  WineRegionEnum,
} from '../const/wine.const';

export class CreateWineDto {
  @IsString()
  name: string;

  @IsEnum(WineCategoryEnum)
  category: WineCategoryEnum;

  @IsEnum(WineRegionEnum)
  region: WineRegionEnum;

  appellation: CombinedAppellationType;

  @IsEnum(GrapeVarietyEnum)
  grape: GrapeVarietyEnum;

  @IsNumber()
  vintage: number;

  @IsString()
  maker: string;

  @IsNumber()
  alc: number;

  @IsNumber()
  price: number;

  @IsString()
  purchaseLocation: string;

  @IsDate()
  purchaseDate?: Date;
}
