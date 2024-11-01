import {
  CocktailReviewModel,
  SpiritReviewModel,
  WineReviewModel,
} from 'src/reviews/entities/review.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column()
  category: string;

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

  @Column()
  category: string;

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

  @Column()
  category: string;
}
