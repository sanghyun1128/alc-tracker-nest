import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseModel } from 'src/common/entities/base.entity';
import { ImageModel } from 'src/common/entities/image.entity';
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
export class BaseReviewModel extends BaseModel {
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

  @OneToMany(() => ImageModel, (image) => image.review)
  images: ImageModel[];
}

@Entity()
export class SpiritReviewModel extends BaseReviewModel {
  /**
   * bottleCondition represents a percentage value between 0 and 100.
   */
  @Column({ nullable: true, default: 100 })
  bottleCondition: number;
}

@Entity()
export class WineReviewModel extends BaseReviewModel {
  /**
   * aeration represents a minute of aeration.
   */
  @Column({ nullable: true, default: 0 })
  aeration: number;
}

@Entity()
export class CocktailReviewModel extends BaseReviewModel {
  @Column('json', { nullable: false })
  ingredients: string;

  @Column('json', { nullable: false })
  recipe: string;

  @Column('float', { nullable: false })
  alc: number;
}
