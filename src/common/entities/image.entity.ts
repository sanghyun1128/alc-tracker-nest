import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { join } from 'path';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';

import { BaseModel } from './base.entity';
import { ImageModelEnum } from '../const/image-model.const';
import { ALCOHOL_IMAGES_ACCESS_PATH, REVIEW_IMAGES_ACCESS_PATH, USER_IMAGES_ACCESS_PATH } from '../const/path.const';
import { enumValidationMessage, stringValidationMessage, integerValidationMessage } from '../validation-message';
import { AlcoholModel } from 'src/alcohol/entities/alcohol.entity';
import { BaseReviewModel } from 'src/reviews/entities/review.entity';
import { UserModel } from 'src/users/entities/user.entity';

@Entity()
export class ImageModel extends BaseModel {
  @Column({
    default: 0,
  })
  @IsInt({
    message: integerValidationMessage,
  })
  @IsOptional()
  order?: number;

  @Column()
  @IsEnum(ImageModelEnum, {
    message: enumValidationMessage,
  })
  type: ImageModelEnum;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  @Transform(({ value, obj }) => {
    if (obj.type === ImageModelEnum.ALCOHOL_IMAGE) {
      return join(ALCOHOL_IMAGES_ACCESS_PATH, value);
    } else if (obj.type === ImageModelEnum.USER_IMAGE) {
      return join(USER_IMAGES_ACCESS_PATH, value);
    } else if (obj.type === ImageModelEnum.REVIEW_IMAGE) {
      return join(REVIEW_IMAGES_ACCESS_PATH, value);
    } else {
      return value;
    }
  })
  path: string;

  @ManyToOne(() => BaseReviewModel, (review) => review.images)
  review?: BaseReviewModel;

  @ManyToOne(() => AlcoholModel, (alcohol) => alcohol.images)
  alcohol?: AlcoholModel;

  @OneToOne(() => UserModel, (user) => user.image)
  user?: UserModel;
}
