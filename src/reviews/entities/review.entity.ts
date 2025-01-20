import { ChildEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, TableInheritance } from 'typeorm';

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
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class ReviewModel extends BaseModel {
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

@ChildEntity()
export class SpiritReviewModel extends ReviewModel {
  /**
   * bottleCondition represents a percentage value between 0 and 100.
   */
  @Column({ nullable: true, default: 100 })
  bottleCondition: number;
}

@ChildEntity()
export class WineReviewModel extends ReviewModel {
  /**
   * aeration represents a minute of aeration.
   */
  @Column({ nullable: true, default: 0 })
  aeration: number;
}

@ChildEntity()
export class CocktailReviewModel extends ReviewModel {
  @Column('json', { nullable: false })
  ingredients: string;

  @Column('json', { nullable: false })
  recipe: string;

  @Column('float', { nullable: false })
  alc: number;
}
