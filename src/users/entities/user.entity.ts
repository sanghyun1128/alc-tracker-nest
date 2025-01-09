import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { GenderEnum } from '../const/gender.const';
import { RoleEnum } from '../const/role.const';
import { AlcoholModel } from 'src/alcohol/entities/alcohol.entity';
import { BaseModel } from 'src/common/entities/base.entity';
import { BaseReviewModel } from 'src/reviews/entities/review.entity';

@Entity()
export class UserModel extends BaseModel {
  @Column({
    unique: true,
    nullable: false,
  })
  @IsString()
  @IsEmail()
  email: string;

  @Column({
    nullable: false,
  })
  @IsString()
  @Length(8, 16)
  password: string;

  @Column({
    length: 20,
    unique: true,
    nullable: false,
  })
  @IsString()
  @Length(2, 20)
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
    default: GenderEnum.OTHER,
    nullable: false,
  })
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @Column({
    type: 'date',
    nullable: false,
  })
  @IsDate()
  @Type(() => Date)
  birth: Date;

  @OneToMany(() => BaseReviewModel, (review) => review.author)
  reviews: BaseReviewModel[];

  @OneToMany(() => AlcoholModel, (alcohol) => alcohol.owner)
  alcohols: AlcoholModel[];
}
