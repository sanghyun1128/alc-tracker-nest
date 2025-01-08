import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

import { CaskEnum, SpiritCategoryEnum } from '../const/spirit.const';

export class CreateSpiritDto {
  @IsString()
  name: string;

  @IsEnum(SpiritCategoryEnum)
  category: SpiritCategoryEnum;

  @IsEnum(CaskEnum)
  cask: CaskEnum;

  @IsString()
  maker: string;

  @IsNumber()
  alc: number;

  @IsNumber()
  price: number;

  @IsString()
  purchaseLocation: string;

  @IsDate()
  purchaseDate: Date;
}
