import { IsEnum, IsOptional } from 'class-validator';

import { AlcoholType } from '../const/alcohol-type.const';
import { enumValidationMessage } from 'src/common/validation-message';

export class UpdateAlcoholDto {
  @IsEnum(AlcoholType, {
    message: enumValidationMessage,
  })
  type: AlcoholType;

  @IsOptional()
  deletedImages: {
    path: string;
  }[] = [];
}
