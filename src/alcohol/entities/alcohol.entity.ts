import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { ChildEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, TableInheritance } from 'typeorm';

import { CocktailCategoryEnum } from '../const/cocktail.const';
import { SpiritCategoryEnum, CaskEnum } from '../const/spirit.const';
import {
  WineCategoryEnum,
  WineRegionEnum,
  CombinedAppellationEnum,
  CombinedAppellationType,
  GrapeVarietyEnum,
} from '../const/wine.const';
import { BaseModel } from 'src/common/entities/base.entity';
import { ImageModel } from 'src/common/entities/image.entity';
import {
  dateValidationMessage,
  enumValidationMessage,
  numberValidationMessage,
  stringValidationMessage,
} from 'src/common/validation-message';
import { UserModel } from 'src/users/entities/user.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class AlcoholModel extends BaseModel {
  @Column({
    length: 100,
    nullable: false,
  })
  @IsString({
    message: stringValidationMessage,
  })
  name: string;

  @ManyToOne(() => UserModel, (user) => user.alcohols)
  @JoinColumn({ name: 'ownerId' })
  owner: UserModel;

  @OneToMany(() => ImageModel, (image) => image.alcohol)
  images: ImageModel[];
}

@ChildEntity()
export class SpiritModel extends AlcoholModel {
  @Column({
    type: 'enum',
    enum: Object.values(SpiritCategoryEnum),
    nullable: true,
  })
  @IsEnum(SpiritCategoryEnum, {
    message: enumValidationMessage,
  })
  category: SpiritCategoryEnum;

  @Column({
    type: 'enum',
    enum: Object.values(CaskEnum),
    nullable: true,
  })
  @IsEnum(CaskEnum, {
    message: enumValidationMessage,
  })
  cask: CaskEnum;

  @Column({ length: 100, nullable: true })
  @IsString({
    message: stringValidationMessage,
  })
  maker: string;

  @Column('float', { nullable: true })
  @IsNumber(
    {},
    {
      message: numberValidationMessage,
    },
  )
  alc: number;

  @Column({ nullable: true })
  @IsNumber(
    {},
    {
      message: numberValidationMessage,
    },
  )
  price: number;

  @Column({ length: 100, nullable: true })
  @IsString({
    message: stringValidationMessage,
  })
  purchaseLocation: string;

  @Column({ type: 'date', nullable: true })
  @IsDate({
    message: dateValidationMessage,
  })
  purchaseDate: Date;
}

@ChildEntity()
export class WineModel extends AlcoholModel {
  @Column({
    type: 'enum',
    enum: Object.values(WineCategoryEnum),
    nullable: true,
  })
  @IsEnum(WineCategoryEnum, {
    message: enumValidationMessage,
  })
  category: WineCategoryEnum;

  @Column({
    type: 'enum',
    enum: Object.values(WineRegionEnum),
    nullable: true,
  })
  @IsEnum(WineRegionEnum, {
    message: enumValidationMessage,
  })
  region: WineRegionEnum;

  @Column({
    type: 'enum',
    enum: Object.values(CombinedAppellationEnum),
    nullable: true,
  })
  @IsEnum(CombinedAppellationEnum, {
    message: enumValidationMessage,
  })
  appellation: CombinedAppellationType;

  @Column({
    type: 'enum',
    enum: Object.values(GrapeVarietyEnum),
    nullable: true,
  })
  @IsEnum(GrapeVarietyEnum, {
    message: enumValidationMessage,
  })
  grape: GrapeVarietyEnum;

  @Column({ nullable: true })
  @IsNumber(
    {},
    {
      message: numberValidationMessage,
    },
  )
  vintage: number;

  @Column({ length: 100, nullable: true })
  @IsString({
    message: stringValidationMessage,
  })
  maker: string;

  @Column('float', { nullable: true })
  @IsNumber(
    {},
    {
      message: numberValidationMessage,
    },
  )
  alc: number;

  @Column({ nullable: true })
  @IsNumber(
    {},
    {
      message: numberValidationMessage,
    },
  )
  price: number;

  @Column({ length: 100, nullable: true })
  @IsString({
    message: stringValidationMessage,
  })
  purchaseLocation: string;

  @Column({ type: 'date', nullable: true })
  @IsDate({
    message: dateValidationMessage,
  })
  purchaseDate: Date;
}

@ChildEntity()
export class CocktailModel extends AlcoholModel {
  @Column({
    type: 'enum',
    enum: Object.values(CocktailCategoryEnum),
    nullable: true,
  })
  @IsEnum(CocktailCategoryEnum, {
    message: enumValidationMessage,
  })
  category: CocktailCategoryEnum;
}
