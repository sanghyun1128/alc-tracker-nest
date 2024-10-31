import { CocktailModel } from 'src/cocktails/entities/cocktail.entity';
import { SpiritModel } from 'src/spirits/entities/spirit.entity';
import { WineModel } from 'src/wines/entities/wine.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class DetailEvaluation {
  @Column({ nullable: true })
  rating: number;

  @Column('json', { nullable: true })
  notes: string[];

  @Column({ nullable: true })
  comment: string;
}

@Entity()
@Check(`("spiritId" IS NOT NULL AND "wineId" IS NULL AND "cocktailId" IS NULL) OR
       ("spiritId" IS NULL AND "wineId" IS NOT NULL AND "cocktailId" IS NULL) OR
       ("spiritId" IS NULL AND "wineId" IS NULL AND "cocktailId" IS NOT NULL)`)
export class ReviewModel {
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

  @Column({ nullable: true })
  aeration: number;

  @Column(() => DetailEvaluation)
  nose: DetailEvaluation;

  @Column(() => DetailEvaluation)
  palate: DetailEvaluation;

  @Column(() => DetailEvaluation)
  finish: DetailEvaluation;

  @ManyToOne(() => SpiritModel, (spirit) => spirit.reviews, { nullable: true })
  @JoinColumn({ name: 'spiritId' })
  spirit: SpiritModel;

  @ManyToOne(() => WineModel, (wine) => wine.reviews, { nullable: true })
  @JoinColumn({ name: 'wineId' })
  wine: WineModel;

  @ManyToOne(() => CocktailModel, (cocktail) => cocktail.reviews, {
    nullable: true,
  })
  @JoinColumn({ name: 'cocktailId' })
  cocktail: CocktailModel;

  // @ManyToOne(() => User, (user) => user.reviews)
  // @JoinColumn({ name: 'userId' })
  // user: User;
}
