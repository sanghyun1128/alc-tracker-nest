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

  @OneToMany(() => ReviewModel, (review) => review.spirit)
  reviews: ReviewModel[];

  // @OneToMany(() => ImageModel, (image) => image.spirit)
  // images: ImageModel[];
}
