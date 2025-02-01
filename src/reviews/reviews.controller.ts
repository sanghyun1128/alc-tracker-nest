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
import { CommonService } from 'src/common/common.service';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { User } from 'src/users/decorator/user.decorator';
import { UserModel } from 'src/users/entity/user.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly commonService: CommonService,
  ) {}

  /**
   * Get paginated list of reviews for a specific user by type.
   *
   * @Param type - The type of alcohol.
   * @Param userId - The ID of the user.
   * @Query query - Pagination and filter options.
   * @returns A list of reviews.
   */
  @Get('/:type/:userId')
  @UseGuards(AccessTokenGuard)
  getUserReviews(
    @Param('type') type: AlcoholType,
    @Param('userId') userId: UserModel['id'],
    @Query() query: PaginateReviewDto,
  ) {
    return this.reviewsService.getUserReviews(type, userId, query);
  }

  /**
   * Get paginated list of reviews for the authenticated user by type.
   *
   * @Param type - The type of alcohol.
   * @User userId - The ID of the authenticated user.
   * @Query query - Pagination and filter options.
   * @returns A list of reviews.
   */
  @Get('/:type/my')
  @UseGuards(AccessTokenGuard)
  getMyReviews(
    @Param('type') type: AlcoholType,
    @User('id') userId: UserModel['id'],
    @Query() query: PaginateReviewDto,
  ) {
    return this.reviewsService.getUserReviews(type, userId, query);
  }

  /**
   * Get paginated list of reviews by a specific alcohol ID.
   *
   * @Param type - The type of alcohol.
   * @Param alcoholId - The ID of the alcohol.
   * @Query query - Pagination and filter options.
   * @returns A list of reviews
   */
  @Get('/:type/:alcoholId')
  @UseGuards(AccessTokenGuard)
  getReviewsByAlcoholId(
    @Param('type') type: AlcoholType,
    @Param('alcoholId') alcoholId: string,
    @Query() query: PaginateReviewDto,
  ) {
    return this.reviewsService.getReviewsByAlcoholId(type, alcoholId, query);
  }

  /**
   * Create a new review.
   *
   * @Param type - The type of alcohol.
   * @User userId - The ID of the alcohol.
   * @Body dto - The data transfer object containing review details.
   * @returns The created review.
   */
  @Post('/:type')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async postAlcoholReview(
    @Param('type') type: AlcoholType,
    @User('id') userId: UserModel['id'],
    @Body() dto: CreateSpiritReviewDto | CreateWineReviewDto | CreateCocktailReviewDto,
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    const review = await this.reviewsService.createReview(type, userId, dto, queryRunner);

    for (const image of dto.images) {
      image.isNew &&
        (await this.commonService.createImage(
          {
            reviewId: review.id,
            order: image.order,
            path: image.path,
          },
          queryRunner,
        ));
    }

    return this.reviewsService.getReviewById(review.id);
  }

  /**
   * Get a specific review by its ID.
   *
   * @Param reviewId - The ID of the review.
   * @returns The review record.
   */
  @Get('/:reviewId')
  getReviewById(@Param('reviewId') reviewId: string) {
    return this.reviewsService.getReviewById(reviewId);
  }

  /**
   * Delete a specific review by its ID.
   *
   * @Param reviewId - The ID of the review.
   * @returns Result of the deletion.
   */
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

  /**
   * Update a specific review by its ID.
   *
   * @Param reviewId - The ID of the review.
   * @User userId - The ID of the authenticated user.
   * @Body dto - The data transfer object containing review details.
   * @QueryRunner queryRunner - The query runner for transaction management.
   * @returns Updated review.
   */
  @Put('/:reviewId')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async putReviewById(
    @Param('reviewId') reviewId: string,
    @User('id') userId: UserModel['id'],
    @Body() dto: UpdateSpiritReviewDto | UpdateWineReviewDto | UpdateCocktailReviewDto,
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    const review = await this.reviewsService.updateReviewById(reviewId, userId, dto, queryRunner);

    for (const image of dto.images) {
      if (image.isNew) {
        await this.commonService.createImage(
          {
            reviewId: review.id,
            order: image.order,
            path: image.path,
          },
          queryRunner,
        );
      } else {
        const reviewImage = review.images.find((reviewImage) => reviewImage.path === image.path);

        if (reviewImage) {
          await this.commonService.updateImage(
            reviewImage.id,
            {
              order: image.order,
            },
            queryRunner,
          );
        }
      }
    }

    return this.reviewsService.getReviewById(review.id);
  }
}
