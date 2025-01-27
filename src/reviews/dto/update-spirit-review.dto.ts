import { IsEnum } from 'class-validator';

import { CreateSpiritReviewDto } from './create-spirit-review.dto';
import { AlcoholType } from 'src/alcohol/const/alcohol-type.const';
import { enumValidationMessage } from 'src/common/validation-message';

export class UpdateSpiritReviewDto extends CreateSpiritReviewDto {
  @IsEnum(AlcoholType, {
    message: enumValidationMessage,
  })
  type: AlcoholType;
}
