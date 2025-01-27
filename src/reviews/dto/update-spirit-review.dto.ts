import { PickType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';

import { CreateSpiritReviewDto } from './create-spirit-review.dto';
import { AlcoholType } from 'src/alcohol/const/alcohol-type.const';
import { enumValidationMessage } from 'src/common/validation-message';

export class UpdateSpiritReviewDto extends PickType(CreateSpiritReviewDto, [
  'rating',
  'comment',
  'pairing',
  'nose',
  'palate',
  'finish',
  'bottleCondition',
  'images',
] as const) {
  @IsEnum(AlcoholType, {
    message: enumValidationMessage,
  })
  type: AlcoholType;
}
