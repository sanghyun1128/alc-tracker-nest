import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { GenderEnum } from '../const/gender.const';
import { RoleEnum } from '../const/role.const';

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
}
