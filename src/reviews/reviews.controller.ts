import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryRunner as QueryRunnerType } from 'typeorm';

import { CreateCocktailReviewDto } from './dto/create-cocktail-review.dto';
import { CreateSpiritReviewDto } from './dto/create-spirit-review.dto';
import { CreateWineReviewDto } from './dto/create-wine-review.dto';
import { PaginateReviewDto } from './dto/paginate-review.dto';
import { UpdateCocktailReviewDto } from './dto/update-cocktail-review.dto';
import { UpdateSpiritReviewDto } from './dto/update-spirit-review.dto';
import { UpdateWineReviewDto } from './dto/update-wine-review.dto';
import { ReviewsService } from './reviews.service';
import { AlcoholType } from 'src/alcohol/const/alcohol-type.const';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { User } from 'src/users/decorator/user.decorator';
import { UserModel } from 'src/users/entity/user.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  //TODO: 삭제예정
  // Retrieve a paginated list of reviews
  @Get('/:type')
  @UseGuards(AccessTokenGuard)
  getAllReviews(@Param('type') type: AlcoholType, @Query() query: PaginateReviewDto) {
    return this.reviewsService.getAllReviews(type, query);
  }

  // Retrieve a paginated list of reviews by a specific alcohol ID
  @Get('/:type/:alcoholId')
  @UseGuards(AccessTokenGuard)
  getReviewsByAlcoholId(
    @Param('type') type: AlcoholType,
    @Param('alcoholId') alcoholId: string,
    @Query() query: PaginateReviewDto,
  ) {
    return this.reviewsService.getReviewsByAlcoholId(type, alcoholId, query);
  }

  // Create a new review
  @Post('/:type')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  postAlcoholReview(
    @Param('type') type: AlcoholType,
    @User('id') userId: UserModel['id'],
    @Body() dto: CreateSpiritReviewDto | CreateWineReviewDto | CreateCocktailReviewDto,
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    return this.reviewsService.createReview(type, userId, dto, queryRunner);
  }

  // Retrieve a specific review by its ID
  @Get('/:reviewId')
  getReviewById(@Param('reviewId') reviewId: string) {
    return this.reviewsService.getReviewById(reviewId);
  }

  // Delete a specific review by its ID
  @Delete('/:reviewId')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  deleteReviewById(
    @Param('reviewId') reviewId: string,
    @User('id') userId: UserModel['id'],
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    return this.reviewsService.deleteReviewById(reviewId, userId, queryRunner);
  }

  // Update a specific review by its ID
  @Put('/:reviewId')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  putReviewById(
    @Param('reviewId') reviewId: string,
    @User('id') userId: UserModel['id'],
    @Body() dto: UpdateSpiritReviewDto | UpdateWineReviewDto | UpdateCocktailReviewDto,
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    return this.reviewsService.updateReviewById(reviewId, userId, dto, queryRunner);
  }
}
