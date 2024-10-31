import { WineReviewModel } from 'src/reviews/entities/review.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class WineModel {
  @PrimaryGeneratedColumn()
  wineId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  category: string;

  @Column()
  name: string;

  @Column()
  maker: string;

  @Column()
  vintage: number;

  @Column()
  alc: number;

  @Column()
  price: number;

  @Column()
  purchaseLocation: string;

  @Column()
  purchaseDate: Date;

  @OneToMany(() => WineReviewModel, (review) => review.wine)
  reviews: WineReviewModel[];

  // @OneToMany(() => ImageModel, (image) => image.wine)
  // images: ImageModel[];
}
