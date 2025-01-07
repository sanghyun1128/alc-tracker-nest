import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { DetailEvaluation } from './entities/review.entity';
import { ReviewsService } from './reviews.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';

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
  getReviewById(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.getReviewById(id);
  }

  @Post('/spirit')
  @UseGuards(AccessTokenGuard)
  postSpiritReview(
    @Body('authorId') authorId: number,
    @Body('rating') rating: number,
    @Body('comment') comment: string,
    @Body('pairing') pairing: string,
    @Body('nose') nose: DetailEvaluation,
    @Body('palate') palate: DetailEvaluation,
    @Body('finish') finish: DetailEvaluation,
    @Body('bottleCondition') bottleCondition: number,
  ) {
    return this.reviewsService.createSpiritReview(
      authorId,
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
  @UseGuards(AccessTokenGuard)
  postWineReview(
    @Body('authorId') authorId: number,
    @Body('rating') rating: number,
    @Body('comment') comment: string,
    @Body('pairing') pairing: string,
    @Body('nose') nose: DetailEvaluation,
    @Body('palate') palate: DetailEvaluation,
    @Body('finish') finish: DetailEvaluation,
    @Body('bottleCondition') bottleCondition: number,
  ) {
    return this.reviewsService.createWineReview(
      authorId,
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
  @UseGuards(AccessTokenGuard)
  postCocktailReview(
    @Body('authorId') authorId: number,
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
      authorId,
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
