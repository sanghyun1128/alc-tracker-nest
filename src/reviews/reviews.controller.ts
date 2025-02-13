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
import { ReviewModel } from './entity/review.entity';
import { ReviewsService } from './reviews.service';
import { AlcoholModel } from 'src/alcohol/entity/alcohol.entity';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { User } from 'src/users/decorator/user.decorator';
import { UserModel } from 'src/users/entity/user.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('/:reviewId')
  getReviewById(@Param('reviewId') reviewId: ReviewModel['id']) {
    return this.reviewsService.getReviewById(reviewId);
  }

  @Get('/:alcoholId')
  @UseGuards(AccessTokenGuard)
  getReviewsByAlcoholId(
    @Param('alcoholId') alcoholId: AlcoholModel['id'],
    @Query() query: PaginateReviewDto,
  ) {
    return this.reviewsService.getReviewsByAlcoholId(alcoholId, query);
  }

  @Post('/')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async postAlcoholReview(
    @User('id') userId: UserModel['id'],
    @Body() dto: CreateSpiritReviewDto | CreateWineReviewDto | CreateCocktailReviewDto,
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    return await this.reviewsService.createReview(userId, dto, queryRunner);
  }

  @Put('/:reviewId')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async putReviewById(
    @Param('reviewId') reviewId: ReviewModel['id'],
    @User('id') userId: UserModel['id'],
    @Body() dto: UpdateSpiritReviewDto | UpdateWineReviewDto | UpdateCocktailReviewDto,
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    const review = await this.reviewsService.updateReviewById(reviewId, userId, dto, queryRunner);

    return this.reviewsService.getReviewById(review.id);
  }

  @Delete('/:reviewId')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  deleteReviewById(
    @Param('reviewId') reviewId: ReviewModel['id'],
    @User('id') userId: UserModel['id'],
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    return this.reviewsService.deleteReviewById(reviewId, userId, queryRunner);
  }
}
