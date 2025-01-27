import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

import { CreateCocktailReviewDto } from './dto/create-cocktail-review.dto';
import { CreateSpiritReviewDto } from './dto/create-spirit-review.dto';
import { CreateWineReviewDto } from './dto/create-wine-review.dto';
import { PaginateReviewDto } from './dto/paginate-review.dto';
import { UpdateCocktailReviewDto } from './dto/update-cocktail-review.dto';
import { UpdateSpiritReviewDto } from './dto/update-spirit-review.dto';
import { UpdateWineReviewDto } from './dto/update-wine-review.dto';
import {
  ReviewModel,
  CocktailReviewModel,
  SpiritReviewModel,
  WineReviewModel,
} from './entity/review.entity';
import { AlcoholType } from 'src/alcohol/const/alcohol-type.const';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewModel)
    private readonly reviewRepository: Repository<ReviewModel>,
    @InjectRepository(SpiritReviewModel)
    private readonly spiritReviewRepository: Repository<SpiritReviewModel>,
    @InjectRepository(WineReviewModel)
    private readonly wineReviewRepository: Repository<WineReviewModel>,
    @InjectRepository(CocktailReviewModel)
    private readonly cocktailReviewRepository: Repository<CocktailReviewModel>,
  ) {}

  async getAllReviews(type: AlcoholType, dto: PaginateReviewDto) {}

  async createReview(
    type: AlcoholType,
    userId: string,
    dto: CreateSpiritReviewDto | CreateWineReviewDto | CreateCocktailReviewDto,
    queryRunner?: QueryRunner,
  ) {}

  async getReviewById(id: string) {
    const review = await this.reviewRepository.findOne({
      where: {
        id,
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }

    return review;
  }

  async deleteReviewById(id: string, queryRunner?: QueryRunner) {}

  async updateReviewById(
    id: string,
    dto: UpdateSpiritReviewDto | UpdateWineReviewDto | UpdateCocktailReviewDto,
    queryRunner?: QueryRunner,
  ) {}
}
