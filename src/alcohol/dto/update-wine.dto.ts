import { IsEnum } from 'class-validator';

import { CreateWineDto } from './create-wine.dto';
import { AlcoholType } from '../const/alcohol-type.const';
import { enumValidationMessage } from 'src/common/validation-message';

export class UpdateWineDto extends CreateWineDto {
  @IsEnum(AlcoholType, {
    message: enumValidationMessage,
  })
  type: AlcoholType;
}
