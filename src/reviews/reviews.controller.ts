import { Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async getAllReviews() {
    return this.reviewsService.getAllReviews();
  }

  @Get(':id')
  async getReviewById(@Param('id') id: string) {
    return this.reviewsService.getReviewById(+id);
  }

  @Post()
  async createReview() {
    return this.reviewsService.createReview();
  }
}
