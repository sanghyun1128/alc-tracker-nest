import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  BaseReviewModel,
  CocktailReviewModel,
  DetailEvaluation,
  SpiritReviewModel,
  WineReviewModel,
} from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(BaseReviewModel)
    private readonly reviewRepository: Repository<BaseReviewModel>,
    @InjectRepository(SpiritReviewModel)
    private readonly spiritReviewRepository: Repository<SpiritReviewModel>,
    @InjectRepository(WineReviewModel)
    private readonly wineReviewRepository: Repository<WineReviewModel>,
    @InjectRepository(CocktailReviewModel)
    private readonly cocktailReviewRepository: Repository<CocktailReviewModel>,
  ) {}

  async getAllSpiritReviews() {
    return this.spiritReviewRepository.find();
  }

  async getAllWineReviews() {
    return this.wineReviewRepository.find();
  }

  async getAllCocktailReviews() {
    return this.cocktailReviewRepository.find();
  }

  async getReviewById(id: number) {
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

  async createSpiritReview(
    rating: number,
    comment: string,
    pairing: string,
    nose: DetailEvaluation,
    palate: DetailEvaluation,
    finish: DetailEvaluation,
    bottleCondition: number,
  ) {
    const review = this.spiritReviewRepository.create({
      rating,
      comment,
      pairing,
      nose,
      palate,
      finish,
      bottleCondition,
    });

    const spiritReview = this.spiritReviewRepository.save(review);

    return spiritReview;
  }

  async createWineReview(
    rating: number,
    comment: string,
    pairing: string,
    nose: DetailEvaluation,
    palate: DetailEvaluation,
    finish: DetailEvaluation,
    aeration: number,
  ) {
    const review = this.wineReviewRepository.create({
      rating,
      comment,
      pairing,
      nose,
      palate,
      finish,
      aeration,
    });

    const wineReview = this.wineReviewRepository.save(review);

    return wineReview;
  }

  async createCocktailReview(
    rating: number,
    comment: string,
    pairing: string,
    nose: DetailEvaluation,
    palate: DetailEvaluation,
    finish: DetailEvaluation,
    ingredients: string,
    recipe: string,
  ) {
    const review = this.cocktailReviewRepository.create({
      rating,
      comment,
      pairing,
      nose,
      palate,
      finish,
      ingredients,
      recipe,
    });

    const cocktailReview = this.cocktailReviewRepository.save(review);

    return cocktailReview;
  }
}
