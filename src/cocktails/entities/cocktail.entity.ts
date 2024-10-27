import { ReviewModel } from 'src/reviews/entities/review.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CocktailModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => ReviewModel, (review) => review.spirit)
  reviews: ReviewModel[];
}
