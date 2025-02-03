import { Exclude, Type } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { GenderEnum } from '../const/gender.const';
import { RoleEnum } from '../const/role.const';
import { AlcoholModel } from 'src/alcohol/entity/alcohol.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import { ImageModel } from 'src/common/entity/image.entity';
import {
  emailValidationMessage,
  stringValidationMessage,
  enumValidationMessage,
  dateValidationMessage,
  lengthValidationMessage,
} from 'src/common/validation-message';
import { ReviewModel } from 'src/reviews/entity/review.entity';

@Entity()
export class UserModel extends BaseModel {
  @Column({
    unique: true,
    nullable: false,
  })
  @IsString({ message: stringValidationMessage })
  @IsEmail({}, { message: emailValidationMessage })
  email: string;

  @Column({
    nullable: false,
  })
  @IsString({ message: stringValidationMessage })
  @Length(8, 16, {
    message: lengthValidationMessage,
  })
  @Exclude({
    toPlainOnly: true,
  })
  password: string;

  @Column({
    length: 20,
    unique: true,
    nullable: false,
  })
  @IsString({ message: stringValidationMessage })
  @Length(2, 20, {
    message: lengthValidationMessage,
  })
  nickname: string;

  //TODO: ADMIN이 함부로 설정되지 않도록 조치 필요
  @Column({
    type: 'enum',
    enum: Object.values(RoleEnum),
    default: RoleEnum.USER,
    nullable: false,
  })
  role: RoleEnum;

  @Column({
    type: 'enum',
    enum: Object.values(GenderEnum),
    nullable: false,
  })
  @IsEnum(GenderEnum, {
    message: enumValidationMessage,
  })
  gender: GenderEnum;

  @Column({
    type: 'date',
    nullable: false,
  })
  @IsDate({
    message: dateValidationMessage,
  })
  @Type(() => Date)
  birth: Date;

  @Column({
    length: 50,
    nullable: false,
  })
  comment: string;

  @OneToMany(() => ReviewModel, (review) => review.author)
  reviews: ReviewModel[];

  @OneToMany(() => AlcoholModel, (alcohol) => alcohol.owner)
  alcohols: AlcoholModel[];

  @OneToOne(() => ImageModel, (image) => image.user)
  profileImage: ImageModel;
}
