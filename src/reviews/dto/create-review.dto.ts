import { IsEnum, IsOptional, IsString } from 'class-validator';

import { AlcoholType } from 'src/alcohol/const/alcohol-type.const';
import { AlcoholModel } from 'src/alcohol/entity/alcohol.entity';
import { enumValidationMessage, stringValidationMessage } from 'src/common/validation-message';

export class CreateReviewDto {
  @IsString({
    message: stringValidationMessage,
  })
  alcoholId: AlcoholModel['id'];

  @IsEnum({
    message: enumValidationMessage,
  })
  alcoholType: AlcoholType;

  @IsOptional()
  images: {
    path: string;
    order: number;
    isNew: boolean;
  }[] = [];
}
