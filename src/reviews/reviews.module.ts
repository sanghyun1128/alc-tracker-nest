import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  ReviewModel,
  CocktailReviewModel,
  SpiritReviewModel,
  WineReviewModel,
} from './entity/review.entity';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { AlcoholModule } from 'src/alcohol/alcohol.module';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReviewModel,
      SpiritReviewModel,
      WineReviewModel,
      CocktailReviewModel,
    ]),
    AuthModule,
    UsersModule,
    CommonModule,
    AlcoholModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
