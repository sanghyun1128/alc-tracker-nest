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
  category: SpiritCategoryEnum;

  @Column({
    type: 'enum',
    enum: Object.values(CaskEnum),
    default: CaskEnum.OTHER,
    nullable: false,
  })
  cask: CaskEnum;

  @Column({ length: 100, nullable: true })
  maker: string;

  @Column('float', { nullable: true })
  alc: number;

  @Column({ nullable: true })
  price: number;

  @Column({ length: 100, nullable: true })
  purchaseLocation: string;

  @Column({ type: 'date', nullable: true })
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
  category: WineCategoryEnum;

  @Column({
    type: 'enum',
    enum: Object.values(WineRegionEnum),
    default: WineRegionEnum.OTHER,
    nullable: false,
  })
  region: WineRegionEnum;

  @Column({
    type: 'enum',
    enum: Object.values(CombinedAppellationEnum),
    default: CombinedAppellationEnum.OTHER,
    nullable: false,
  })
  appellation: CombinedAppellationType;

  @Column({
    type: 'enum',
    enum: Object.values(GrapeVarietyEnum),
    default: GrapeVarietyEnum.OTHER,
    nullable: false,
  })
  grape: GrapeVarietyEnum;

  @Column({ nullable: true })
  vintage: number;

  @Column({ length: 100, nullable: true })
  maker: string;

  @Column('float', { nullable: true })
  alc: number;

  @Column({ nullable: true })
  price: number;

  @Column({ length: 100, nullable: true })
  purchaseLocation: string;

  @Column({ type: 'date', nullable: true })
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
  category: CocktailCategoryEnum;
}
