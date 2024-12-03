import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { GenderEnum } from '../const/gender.const';
import { RoleEnum } from '../const/role.const';
import { AlcoholModel } from 'src/alcohol/entities/alcohol.entity';
import { BaseReviewModel } from 'src/reviews/entities/review.entity';

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    length: 30,
    nullable: false,
  })
  password: string;

  @Column({
    length: 20,
    unique: true,
    nullable: false,
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
    default: GenderEnum.OTHER,
    nullable: false,
  })
  gender: GenderEnum;

  @Column({
    type: 'date',
    nullable: false,
  })
  birth: Date;

  @OneToMany(() => BaseReviewModel, (review) => review.author)
  reviews: BaseReviewModel[];

  @OneToMany(() => AlcoholModel, (alcohol) => alcohol.owner)
  alcohols: AlcoholModel[];
}
