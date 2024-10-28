import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ReviewModel } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewModel)
    private readonly reviewRepository: Repository<ReviewModel>,
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
}
