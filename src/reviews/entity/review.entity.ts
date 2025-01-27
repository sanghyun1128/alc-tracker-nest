import { IsInt, IsNumber, IsString } from 'class-validator';
import {
  ChildEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  TableInheritance,
} from 'typeorm';

import { AlcoholModel } from 'src/alcohol/entity/alcohol.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import { ImageModel } from 'src/common/entity/image.entity';
import {
  integerValidationMessage,
  numberValidationMessage,
  stringValidationMessage,
} from 'src/common/validation-message';
import { UserModel } from 'src/users/entity/user.entity';

export abstract class DetailEvaluation {
  /**
   * rating represents a number between 0 and 100.
   */
  @Column({ nullable: false, default: 0 })
  @IsInt({
    message: integerValidationMessage,
  })
  rating: number;

  @Column('json', { nullable: true })
  @IsString({
    each: true,
    message: stringValidationMessage,
  })
  notes: string[];

  @Column({ nullable: true })
  @IsString({
    message: stringValidationMessage,
  })
  comment: string;
}

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class ReviewModel extends BaseModel {
  /**
   * rating represents a number between 0 and 100.
   */
  @Column({
    nullable: false,
    default: 0,
  })
  @IsInt({
    message: integerValidationMessage,
  })
  rating: number;

  @Column({
    length: 1000,
    nullable: true,
  })
  @IsString({
    message: stringValidationMessage,
  })
  comment: string;

  @Column('json', { nullable: true })
  @IsString({
    each: true,
    message: stringValidationMessage,
  })
  pairing: string[];

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

  @ManyToOne(() => AlcoholModel, (alcohol) => alcohol.reviews, {
    nullable: false,
  })
  @JoinColumn({ name: 'alcoholId' })
  alcohol: AlcoholModel;

  @OneToMany(() => ImageModel, (image) => image.review)
  images: ImageModel[];
}

@ChildEntity()
export class SpiritReviewModel extends ReviewModel {
  /**
   * bottleCondition represents a percentage value between 0 and 100.
   */
  @Column({ nullable: true })
  @IsInt({
    message: integerValidationMessage,
  })
  bottleCondition: number;
}

@ChildEntity()
export class WineReviewModel extends ReviewModel {
  /**
   * aeration represents a minute of aeration.
   */
  @Column({ nullable: true })
  @IsInt({
    message: integerValidationMessage,
  })
  aeration: number;
}

@ChildEntity()
export class CocktailReviewModel extends ReviewModel {
  @Column('json', { nullable: true })
  @IsString({
    each: true,
    message: stringValidationMessage,
  })
  ingredients: string[];

  @Column('json', { nullable: true })
  @IsString({
    each: true,
    message: stringValidationMessage,
  })
  recipe: string[];

  @Column('float', { nullable: true })
  @IsNumber(
    {},
    {
      message: numberValidationMessage,
    },
  )
  alc: number;
}
