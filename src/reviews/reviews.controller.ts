import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { DetailEvaluation } from './entities/review.entity';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('/spirit')
  getAllSpritReviews() {
    return this.reviewsService.getAllSpiritReviews();
  }

  @Get('/wine')
  getAllWineReviews() {
    return this.reviewsService.getAllWineReviews();
  }

  @Get('/cocktail')
  getAllCocktailReviews() {
    return this.reviewsService.getAllCocktailReviews();
  }

  @Get(':id')
  getReviewById(@Param('id') id: string) {
    return this.reviewsService.getReviewById(+id);
  }

  @Post('/spirit')
  createSpiritReview(
    @Body('rating') rating: number,
    @Body('comment') comment: string,
    @Body('pairing') pairing: string,
    @Body('nose') nose: DetailEvaluation,
    @Body('palate') palate: DetailEvaluation,
    @Body('finish') finish: DetailEvaluation,
    @Body('bottleCondition') bottleCondition: number,
  ) {
    return this.reviewsService.createSpiritReview(
      rating,
      comment,
      pairing,
      nose,
      palate,
      finish,
      bottleCondition,
    );
  }

  @Post('/wine')
  createWineReview(
    @Body('rating') rating: number,
    @Body('comment') comment: string,
    @Body('pairing') pairing: string,
    @Body('nose') nose: DetailEvaluation,
    @Body('palate') palate: DetailEvaluation,
    @Body('finish') finish: DetailEvaluation,
    @Body('bottleCondition') bottleCondition: number,
  ) {
    return this.reviewsService.createWineReview(
      rating,
      comment,
      pairing,
      nose,
      palate,
      finish,
      bottleCondition,
    );
  }

  @Post('/cocktail')
  createCocktailReview(
    @Body('rating') rating: number,
    @Body('comment') comment: string,
    @Body('pairing') pairing: string,
    @Body('nose') nose: DetailEvaluation,
    @Body('palate') palate: DetailEvaluation,
    @Body('finish') finish: DetailEvaluation,
    @Body('ingredients') ingredients: string,
    @Body('recipe') recipe: string,
  ) {
    return this.reviewsService.createCocktailReview(
      rating,
      comment,
      pairing,
      nose,
      palate,
      finish,
      ingredients,
      recipe,
    );
  }
}
