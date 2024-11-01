import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CocktailReviewModel,
  SpiritReviewModel,
  WineReviewModel,
} from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(SpiritReviewModel)
    private readonly spiritReviewRepository: Repository<SpiritReviewModel>,
    @InjectRepository(WineReviewModel)
    private readonly wineReviewRepository: Repository<WineReviewModel>,
    @InjectRepository(CocktailReviewModel)
    private readonly reviewRepository: Repository<CocktailReviewModel>,
  ) {}

  async getAllReviews() {
    return this.reviewRepository.find();
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

  async createReview() {
    const review = this.reviewRepository.create({
      rating: 5,
      comment: 'Great product!',
    });

    const newReview = await this.reviewRepository.save(review);

    return newReview;
  }
}
