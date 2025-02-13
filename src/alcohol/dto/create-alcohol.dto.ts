import { IsEnum, IsOptional } from 'class-validator';

import { AlcoholType } from '../const/alcohol-type.const';
import { stringValidationMessage } from 'src/common/validation-message';

export class CreateAlcoholDto {
  @IsEnum({
    message: stringValidationMessage,
  })
  alcoholType: AlcoholType;

  @IsOptional()
  images: {
    path: string;
    order: number;
    isNew: boolean;
  }[] = [];
}
