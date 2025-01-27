import { PickType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';

import { CreateWineReviewDto } from './create-wine-review.dto';
import { AlcoholType } from 'src/alcohol/const/alcohol-type.const';
import { enumValidationMessage } from 'src/common/validation-message';

export class UpdateWineReviewDto extends PickType(CreateWineReviewDto, [
  'rating',
  'comment',
  'pairing',
  'nose',
  'palate',
  'finish',
  'aeration',
  'images',
] as const) {
  @IsEnum(AlcoholType, {
    message: enumValidationMessage,
  })
  type: AlcoholType;
}
