import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CocktailReviewModel,
  SpiritReviewModel,
  WineReviewModel,
} from './entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpiritReviewModel,
      WineReviewModel,
      CocktailReviewModel,
    ]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
