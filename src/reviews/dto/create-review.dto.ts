import { IsOptional, IsString } from 'class-validator';

import { AlcoholModel } from 'src/alcohol/entity/alcohol.entity';
import { stringValidationMessage } from 'src/common/validation-message';
import { UserModel } from 'src/users/entity/user.entity';

export class CreateReviewDto {
  @IsString({
    message: stringValidationMessage,
  })
  authorId: UserModel['id'];

  @IsString({
    message: stringValidationMessage,
  })
  alcoholId: AlcoholModel['id'];

  @IsOptional()
  images: {
    path: string;
    order: number;
    isNew: boolean;
  }[] = [];
}
