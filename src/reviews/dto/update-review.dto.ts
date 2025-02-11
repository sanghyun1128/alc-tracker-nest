import { IsEnum, IsString } from 'class-validator';

import { AlcoholType } from 'src/alcohol/const/alcohol-type.const';
import { enumValidationMessage, stringValidationMessage } from 'src/common/validation-message';
import { UserModel } from 'src/users/entity/user.entity';

export class UpdateReviewDto {
  @IsString({
    message: stringValidationMessage,
  })
  reviewId: UserModel['id'];

  @IsEnum(AlcoholType, {
    message: enumValidationMessage,
  })
  type: AlcoholType;
}
