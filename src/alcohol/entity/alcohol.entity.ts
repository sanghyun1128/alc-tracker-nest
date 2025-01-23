import { IsDate, IsEnum, IsInt, IsNumber, IsString } from 'class-validator';
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
import { BaseModel } from 'src/common/entity/base.entity';
import { ImageModel } from 'src/common/entity/image.entity';
import {
  dateValidationMessage,
  enumValidationMessage,
  integerValidationMessage,
  numberValidationMessage,
  stringValidationMessage,
} from 'src/common/validation-message';
import { ReviewModel } from 'src/reviews/entity/review.entity';
import { UserModel } from 'src/users/entity/user.entity';

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

  /**
   * price is in KRW.
   */
  @Column({ nullable: true })
  @IsInt({
    message: integerValidationMessage,
  })
  price: number;

  @Column({ length: 100, nullable: true })
  @IsString({
    message: stringValidationMessage,
  })
  maker: string;

  @Column({ nullable: true })
  @IsInt({
    message: integerValidationMessage,
  })
  vintage: number;

  @Column('float', { nullable: true })
  @IsNumber(
    {},
    {
      message: numberValidationMessage,
    },
  )
  alc: number;

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

  @ManyToOne(() => UserModel, (user) => user.alcohols)
  @JoinColumn({ name: 'ownerId' })
  owner: UserModel;

  @OneToMany(() => ImageModel, (image) => image.alcohol)
  images: ImageModel[];

  @OneToMany(() => ReviewModel, (review) => review.alcohols)
  reviews: ReviewModel[];
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
