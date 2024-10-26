import { ReviewModel } from 'src/reviews/entities/review.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SpiritModel {
  @PrimaryGeneratedColumn()
  spiritId: number;

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
  alc: number;

  @Column()
  price: number;

  @Column()
  purchaseLocation: string;

  @Column()
  purchaseDate: Date;

  @OneToMany(() => ReviewModel, (review) => review.spirit)
  reviews: ReviewModel[];

  // @OneToMany(() => ImageModel, (image) => image.spirit)
  // images: ImageModel[];
}
