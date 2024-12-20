import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  SpiritModel,
  WineModel,
  CocktailModel,
} from 'src/alcohol/entities/alcohol.entity';
import { UserModel } from 'src/users/entities/user.entity';

export abstract class DetailEvaluation {
  @Column({ nullable: false, default: 0 })
  rating: number;

  @Column('json', { nullable: true })
  notes: string;

  @Column({ nullable: true })
  comment: string;
}

@Entity()
export class BaseReviewModel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    nullable: false,
    default: 0,
  })
  rating: number;

  @Column({
    length: 1000,
    nullable: true,
  })
  comment: string;

  @Column('json', { nullable: true })
  pairing: string;

  @Column(() => DetailEvaluation)
  nose: DetailEvaluation;

  @Column(() => DetailEvaluation)
  palate: DetailEvaluation;

  @Column(() => DetailEvaluation)
  finish: DetailEvaluation;

  @ManyToOne(() => UserModel, (user) => user.reviews, {
    nullable: false,
  })
  @JoinColumn({ name: 'authorId' })
  author: UserModel;
}

@Entity()
export class SpiritReviewModel extends BaseReviewModel {
  @ManyToOne(() => SpiritModel, (spirit) => spirit.reviews, {
    nullable: false,
  })
  @JoinColumn({ name: 'spiritId' })
  spirit: SpiritModel;

  /**
   * bottleCondition represents a percentage value between 0 and 100.
   */
  @Column({ nullable: true, default: 100 })
  bottleCondition: number;
}

@Entity()
export class WineReviewModel extends BaseReviewModel {
  @ManyToOne(() => WineModel, (wine) => wine.reviews, {
    nullable: false,
  })
  @JoinColumn({ name: 'wineId' })
  wine: WineModel;

  /**
   * aeration represents a minute of aeration.
   */
  @Column({ nullable: true, default: 0 })
  aeration: number;
}

@Entity()
export class CocktailReviewModel extends BaseReviewModel {
  @ManyToOne(() => CocktailModel, (cocktail) => cocktail.reviews, {
    nullable: false,
  })
  @JoinColumn({ name: 'cocktailId' })
  cocktail: CocktailModel;

  @Column('json', { nullable: false })
  ingredients: string;

  @Column('json', { nullable: false })
  recipe: string;

  @Column('float', { nullable: false })
  alc: number;
}
