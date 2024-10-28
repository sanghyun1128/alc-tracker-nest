import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewModel } from './entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewModel])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
