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

export class DetailEvaluation {
  @Column({ nullable: true })
  rating: number;

  @Column('json', { nullable: true })
  notes: string[];

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

  @Column()
  rating: number;

  @Column()
  comment: string;

  @Column('json', { nullable: true })
  pairing: string;

  @Column(() => DetailEvaluation)
  nose: DetailEvaluation;

  @Column(() => DetailEvaluation)
  palate: DetailEvaluation;

  @Column(() => DetailEvaluation)
  finish: DetailEvaluation;

  // @ManyToOne(() => User, (user) => user.reviews)
  // @JoinColumn({ name: 'userId' })
  // user: User;
}

@Entity()
export class SpiritReviewModel extends BaseReviewModel {
  @ManyToOne(() => SpiritModel, (spirit) => spirit.reviews)
  @JoinColumn({ name: 'spiritId' })
  spirit: SpiritModel;

  @Column({ nullable: true })
  bottleCondition: number;
}

@Entity()
export class WineReviewModel extends BaseReviewModel {
  @ManyToOne(() => WineModel, (wine) => wine.reviews)
  @JoinColumn({ name: 'wineId' })
  wine: WineModel;

  @Column({ nullable: true })
  aeration: number;
}

@Entity()
export class CocktailReviewModel extends BaseReviewModel {
  @ManyToOne(() => CocktailModel, (cocktail) => cocktail.reviews)
  @JoinColumn({ name: 'cocktailId' })
  cocktail: CocktailModel;

  @Column('json')
  ingredients: string[];

  @Column('json')
  recipe: string[];
}
