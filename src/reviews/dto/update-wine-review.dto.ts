import { IsEnum } from 'class-validator';

import { CreateWineReviewDto } from './create-wine-review.dto';
import { AlcoholType } from 'src/alcohol/const/alcohol-type.const';
import { enumValidationMessage } from 'src/common/validation-message';

export class UpdateWineReviewDto extends CreateWineReviewDto {
  @IsEnum(AlcoholType, {
    message: enumValidationMessage,
  })
  type: AlcoholType;
}
