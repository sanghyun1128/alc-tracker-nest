import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryRunner as QueryRunnerType } from 'typeorm';

import { ReviewsService } from './reviews.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Retrieve a paginated list of reviews
  @Get('/:type')
  @UseGuards(AccessTokenGuard)
  getAllReviews(@Param('type') type: string, @Query() query: PaginateReviewDto) {
    return this.reviewsService.getAllReviews(type, query);
  }

  // Create a new review
  @Post('/:type')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  postAlcoholReview(
    @Param('type') type: string,
    @User('id') userId: UserModel['id'],
    @Body() dto: CreateReviewDto,
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    return this.reviewsService.createReview(type, userId, dto, queryRunner);
  }

  // Retrieve a specific review by its ID
  @Get(':id')
  @UseGuards(AccessTokenGuard)
  getReviewById(@Param('id', ParseIntPipe) id: string) {
    return this.reviewsService.getReviewById(id);
  }

  // Delete a specific review by its ID
  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  deleteReviewById(@Param('id', ParseIntPipe) id: string) {
    return this.reviewsService.deleteReviewById(id);
  }

  // Update a specific review by its ID
  @Put(':id')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  updateReviewById(
    @Param('id', ParseIntPipe) id: string,
    //dto에 type이 있어야함
    @Body() dto: UpdateReviewDto,
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    return this.reviewsService.updateReviewById(id, dto, queryRunner);
  }
}
