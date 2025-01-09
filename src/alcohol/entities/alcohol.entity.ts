import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CocktailCategoryEnum } from '../const/cocktail.const';
import { CaskEnum, SpiritCategoryEnum } from '../const/spirit.const';
import {
  CombinedAppellationEnum,
  CombinedAppellationType,
  GrapeVarietyEnum,
  WineCategoryEnum,
  WineRegionEnum,
} from '../const/wine.const';
import { BaseModel } from 'src/common/entities/base.entity';
import {
  CocktailReviewModel,
  SpiritReviewModel,
  WineReviewModel,
} from 'src/reviews/entities/review.entity';
import { UserModel } from 'src/users/entities/user.entity';

@Entity()
export class AlcoholModel extends BaseModel {
  @Column({
    length: 100,
    nullable: false,
  })
  @IsString()
  name: string;

  @ManyToOne(() => UserModel, (user) => user.alcohols)
  @JoinColumn({ name: 'ownerId' })
  owner: UserModel;

  // @OneToMany(() => ImageModel, (image) => image.spirit)
  // images: ImageModel[];
}

@Entity()
export class SpiritModel extends AlcoholModel {
  @OneToMany(() => SpiritReviewModel, (review) => review.spirit)
  reviews: SpiritReviewModel[];

  @Column({
    type: 'enum',
    enum: Object.values(SpiritCategoryEnum),
    default: SpiritCategoryEnum.OTHER,
    nullable: false,
  })
  @IsEnum(SpiritCategoryEnum)
  category: SpiritCategoryEnum;

  @Column({
    type: 'enum',
    enum: Object.values(CaskEnum),
    default: CaskEnum.OTHER,
    nullable: false,
  })
  @IsEnum(CaskEnum)
  cask: CaskEnum;

  @Column({ length: 100, nullable: true })
  @IsString()
  maker: string;

  @Column('float', { nullable: true })
  @IsNumber()
  alc: number;

  @Column({ nullable: true })
  @IsNumber()
  price: number;

  @Column({ length: 100, nullable: true })
  @IsString()
  purchaseLocation: string;

  @Column({ type: 'date', nullable: true })
  @IsDate()
  purchaseDate: Date;
}

@Entity()
export class WineModel extends AlcoholModel {
  @OneToMany(() => WineReviewModel, (review) => review.wine)
  reviews: WineReviewModel[];

  @Column({
    type: 'enum',
    enum: Object.values(WineCategoryEnum),
    default: WineCategoryEnum.OTHER,
    nullable: false,
  })
  @IsEnum(WineCategoryEnum)
  category: WineCategoryEnum;

  @Column({
    type: 'enum',
    enum: Object.values(WineRegionEnum),
    default: WineRegionEnum.OTHER,
    nullable: false,
  })
  @IsEnum(WineRegionEnum)
  region: WineRegionEnum;

  @Column({
    type: 'enum',
    enum: Object.values(CombinedAppellationEnum),
    default: CombinedAppellationEnum.OTHER,
    nullable: false,
  })
  @IsEnum(CombinedAppellationEnum)
  appellation: CombinedAppellationType;

  @Column({
    type: 'enum',
    enum: Object.values(GrapeVarietyEnum),
    default: GrapeVarietyEnum.OTHER,
    nullable: false,
  })
  @IsEnum(GrapeVarietyEnum)
  grape: GrapeVarietyEnum;

  @Column({ nullable: true })
  @IsNumber()
  vintage: number;

  @Column({ length: 100, nullable: true })
  @IsString()
  maker: string;

  @Column('float', { nullable: true })
  @IsNumber()
  alc: number;

  @Column({ nullable: true })
  @IsNumber()
  price: number;

  @Column({ length: 100, nullable: true })
  @IsString()
  purchaseLocation: string;

  @Column({ type: 'date', nullable: true })
  @IsDate()
  purchaseDate: Date;
}

@Entity()
export class CocktailModel extends AlcoholModel {
  @OneToMany(() => CocktailReviewModel, (review) => review.cocktail)
  reviews: CocktailReviewModel[];

  @Column({
    type: 'enum',
    enum: Object.values(CocktailCategoryEnum),
    default: CocktailCategoryEnum.CLASSIC,
    nullable: false,
  })
  @IsEnum(CocktailCategoryEnum)
  category: CocktailCategoryEnum;
}
