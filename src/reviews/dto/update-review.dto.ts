import { IsEnum, IsOptional } from 'class-validator';

import { AlcoholType } from 'src/alcohol/const/alcohol-type.const';
import { enumValidationMessage } from 'src/common/validation-message';

export class UpdateReviewDto {
  @IsEnum(AlcoholType, {
    message: enumValidationMessage,
  })
  alcoholType: AlcoholType;

  @IsOptional()
  deletedImages: {
    path: string;
  }[] = [];
}
