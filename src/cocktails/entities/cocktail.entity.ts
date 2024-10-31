import { CocktailReviewModel } from 'src/reviews/entities/review.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CocktailModel {
  @PrimaryGeneratedColumn()
  cocktailId: number;

  @Column()
  name: string;

  @OneToMany(() => CocktailReviewModel, (review) => review.cocktail)
  reviews: CocktailReviewModel[];
}
