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

  // Retrieve a paginated list of reviews
  @Get('/:type')
  @UseGuards(AccessTokenGuard)
  getAllReviews(@Param('type') type: AlcoholType, @Query() query: PaginateReviewDto) {
    return this.reviewsService.getAllReviews(type, query);
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
  @Get(':id')
  getReviewById(@Param('id') id: string) {
    return this.reviewsService.getReviewById(id);
  }

  // Delete a specific review by its ID
  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  deleteReviewById(
    @Param('id') id: string,
    @User('id') userId: UserModel['id'],
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    return this.reviewsService.deleteReviewById(id, userId, queryRunner);
  }

  // Update a specific review by its ID
  @Put(':id')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  putReviewById(
    @Param('id') id: string,
    @User('id') userId: UserModel['id'],
    @Body() dto: UpdateSpiritReviewDto | UpdateWineReviewDto | UpdateCocktailReviewDto,
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    return this.reviewsService.updateReviewById(id, dto, userId, queryRunner);
  }
}
