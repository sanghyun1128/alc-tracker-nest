import { IsEnum } from 'class-validator';

import { CreateSpiritDto } from './create-spirit.dto';
import { AlcoholType } from '../const/alcohol-type.const';
import { enumValidationMessage } from 'src/common/validation-message';

export class UpdateSpiritDto extends CreateSpiritDto {
  @IsEnum(AlcoholType, {
    message: enumValidationMessage,
  })
  type: AlcoholType;
}
