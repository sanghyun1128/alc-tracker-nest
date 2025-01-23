import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  ReviewModel,
  CocktailReviewModel,
  DetailEvaluation,
  SpiritReviewModel,
  WineReviewModel,
} from './entity/review.entity';

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

  async getAllSpiritReviews() {
    return await this.spiritReviewRepository.find();
  }

  async getAllWineReviews() {
    return await this.wineReviewRepository.find();
  }

  async getAllCocktailReviews() {
    return await this.cocktailReviewRepository.find();
  }

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

  async createSpiritReview() {}

  async createWineReview() {}

  async createCocktailReview() {}
}
