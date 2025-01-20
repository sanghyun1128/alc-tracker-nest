import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  ReviewModel,
  CocktailReviewModel,
  DetailEvaluation,
  SpiritReviewModel,
  WineReviewModel,
} from './entities/review.entity';

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

  async createSpiritReview(
    authorId: string,
    rating: number,
    comment: string,
    pairing: string,
    nose: DetailEvaluation,
    palate: DetailEvaluation,
    finish: DetailEvaluation,
    bottleCondition: number,
  ) {
    const review = this.spiritReviewRepository.create({
      author: {
        id: authorId,
      },
      rating,
      comment,
      pairing,
      nose,
      palate,
      finish,
      bottleCondition,
    });

    const spiritReview = await this.spiritReviewRepository.save(review);

    return spiritReview;
  }

  async createWineReview(
    authorId: string,
    rating: number,
    comment: string,
    pairing: string,
    nose: DetailEvaluation,
    palate: DetailEvaluation,
    finish: DetailEvaluation,
    aeration: number,
  ) {
    const review = this.wineReviewRepository.create({
      author: {
        id: authorId,
      },
      rating,
      comment,
      pairing,
      nose,
      palate,
      finish,
      aeration,
    });

    const wineReview = await this.wineReviewRepository.save(review);

    return wineReview;
  }

  async createCocktailReview(
    authorId: string,
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
      author: {
        id: authorId,
      },
      rating,
      comment,
      pairing,
      nose,
      palate,
      finish,
      ingredients,
      recipe,
    });

    const cocktailReview = await this.cocktailReviewRepository.save(review);

    return cocktailReview;
  }
}
