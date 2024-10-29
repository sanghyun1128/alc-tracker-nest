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

  @Column({ nullable: true })
  noseRating: number;

  @Column('json', { nullable: true })
  noseNotes: string[];

  @Column({ nullable: true })
  noseComment: string;

  @Column({ nullable: true })
  palateRating: number;

  @Column('json', { nullable: true })
  palateNotes: string[];

  @Column({ nullable: true })
  palateComment: string;

  @Column({ nullable: true })
  finishRating: number;

  @Column('json', { nullable: true })
  finishNotes: string[];

  @Column({ nullable: true })
  finishComment: string;

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
