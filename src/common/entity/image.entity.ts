import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { join } from 'path';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { BaseModel } from './base.entity';
import { ImageModelEnum } from '../const/image-model.const';
import {
  ALCOHOL_IMAGES_ACCESS_PATH,
  REVIEW_IMAGES_ACCESS_PATH,
  USER_IMAGES_ACCESS_PATH,
} from '../const/path.const';
import {
  enumValidationMessage,
  stringValidationMessage,
  integerValidationMessage,
} from '../validation-message';
import { AlcoholModel } from 'src/alcohol/entity/alcohol.entity';
import { ReviewModel } from 'src/reviews/entity/review.entity';
import { UserModel } from 'src/users/entity/user.entity';

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

  @ManyToOne(() => ReviewModel, (review) => review.images)
  @JoinColumn({ name: 'reviewId' })
  review?: ReviewModel;

  @ManyToOne(() => AlcoholModel, (alcohol) => alcohol.images)
  @JoinColumn({ name: 'alcoholId' })
  alcohol?: AlcoholModel;

  @OneToOne(() => UserModel, (user) => user.profileImage)
  @JoinColumn({ name: 'userId' })
  user?: UserModel;
}
