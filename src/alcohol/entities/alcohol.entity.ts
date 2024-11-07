import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CocktailCategoryEnum } from '../const/cocktail.const';
import { CaskEnum, SpiritCategoryEnum } from '../const/spirit.const';
import {
  CombinedAppellationEnum,
  CombinedAppellationType,
  GrapeVarietyEnum,
  WineCategoryEnum,
  WineRegionEnum,
} from '../const/wine.const';
import {
  CocktailReviewModel,
  SpiritReviewModel,
  WineReviewModel,
} from 'src/reviews/entities/review.entity';

@Entity()
export class AlcoholModel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  name: string;

  // @OneToMany(() => ImageModel, (image) => image.spirit)
  // images: ImageModel[];
}

@Entity()
export class SpiritModel extends AlcoholModel {
  @OneToMany(() => SpiritReviewModel, (review) => review.spirit)
  reviews: SpiritReviewModel[];

  @Column({
    type: 'enum',
    enum: SpiritCategoryEnum,
    default: SpiritCategoryEnum.OTHER,
  })
  category: SpiritCategoryEnum;

  @Column({
    type: 'enum',
    enum: CaskEnum,
    default: CaskEnum.OTHER,
  })
  cask: CaskEnum;

  @Column({ nullable: true })
  maker: string;

  @Column({ nullable: true })
  alc: number;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  purchaseLocation: string;

  @Column({ nullable: true })
  purchaseDate: Date;
}

@Entity()
export class WineModel extends AlcoholModel {
  @OneToMany(() => WineReviewModel, (review) => review.wine)
  reviews: WineReviewModel[];

  @Column({
    type: 'enum',
    enum: WineCategoryEnum,
  })
  category: WineCategoryEnum;

  @Column({
    type: 'enum',
    enum: WineRegionEnum,
  })
  region: WineRegionEnum;

  @Column({
    type: 'enum',
    enum: CombinedAppellationEnum,
  })
  appellation: CombinedAppellationType;

  @Column({
    type: 'enum',
    enum: GrapeVarietyEnum,
  })
  grape: GrapeVarietyEnum;

  @Column({ nullable: true })
  vintage: number;

  @Column({ nullable: true })
  maker: string;

  @Column({ nullable: true })
  alc: number;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  purchaseLocation: string;

  @Column({ nullable: true })
  purchaseDate: Date;
}

@Entity()
export class CocktailModel extends AlcoholModel {
  @OneToMany(() => CocktailReviewModel, (review) => review.cocktail)
  reviews: CocktailReviewModel[];

  @Column({
    type: 'enum',
    enum: CocktailCategoryEnum,
  })
  category: CocktailCategoryEnum;
}
