import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
import { CommonService } from 'src/common/common.service';
import { BaseModel } from 'src/common/entity/base.entity';
import { NotFoundErrorMessage, PermissionErrorMessage } from 'src/common/error-message';
import { UserModel } from 'src/users/entity/user.entity';

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

    private readonly commonService: CommonService,
  ) {}

  private repositoryMap = {
    review: this.reviewRepository,
    spirit: this.spiritReviewRepository,
    wine: this.wineReviewRepository,
    cocktail: this.cocktailReviewRepository,
  };

  private modelMap = {
    review: ReviewModel,
    spirit: SpiritReviewModel,
    wine: WineReviewModel,
    cocktail: CocktailReviewModel,
  };

  async getUserReviews(
    type: AlcoholType,
    userId: UserModel['id'],
    dto: PaginateReviewDto,
  ): Promise<
    | { data: BaseModel[]; total: number }
    | { data: BaseModel[]; cursor: { after: number }; count: number; next: URL }
  > {
    const repository = this.commonService.getRepositoryWithQueryRunner(
      type,
      this.repositoryMap,
      this.modelMap,
    );

    return this.commonService.paginate(
      dto,
      repository,
      {
        where: {
          author: {
            id: userId,
          },
        },
        relations: ['author', 'images', 'alcohol'],
      },
      `reviews/${type}`,
    );
  }

  async getReviewsByAlcoholId(
    type: AlcoholType,
    alcoholId: string,
    dto: PaginateReviewDto,
  ): Promise<
    | { data: BaseModel[]; total: number }
    | { data: BaseModel[]; cursor: { after: number }; count: number; next: URL }
  > {
    const repository = this.commonService.getRepositoryWithQueryRunner(
      type,
      this.repositoryMap,
      this.modelMap,
    );

    return this.commonService.paginate(
      dto,
      repository,
      {
        where: {
          alcohol: {
            id: alcoholId,
          },
        },
        relations: ['author', 'images', 'alcohol'],
      },
      `reviews/${type}/${alcoholId}`,
    );
  }

  async createReview(
    type: AlcoholType,
    userId: string,
    dto: CreateSpiritReviewDto | CreateWineReviewDto | CreateCocktailReviewDto,
    queryRunner?: QueryRunner,
  ): Promise<ReviewModel> {
    const repository = this.commonService.getRepositoryWithQueryRunner(
      type,
      this.repositoryMap,
      this.modelMap,
      queryRunner,
    ) as Repository<ReviewModel>;

    const review = repository.create({
      author: {
        id: userId,
      },
      ...dto,
      images: [],
    });

    const result = await repository.save(review);

    return result;
  }

  async getReviewById(reviewId: string) {
    const review = await this.reviewRepository.findOne({
      where: {
        id: reviewId,
      },
    });

    if (!review) {
      throw new NotFoundException(NotFoundErrorMessage('review'));
    }

    return review;
  }

  async deleteReviewById(reviewId: string, userId: string, queryRunner?: QueryRunner) {
    const repository = this.commonService.getRepositoryWithQueryRunner(
      'review',
      this.repositoryMap,
      this.modelMap,
      queryRunner,
    ) as Repository<ReviewModel>;

    const review = await repository.findOne({
      where: {
        id: reviewId,
      },
      relations: ['author', 'images', 'alcohol'],
    });

    if (!review) {
      throw new NotFoundException(NotFoundErrorMessage('review'));
    }

    if (review.author.id !== userId) {
      throw new BadRequestException(PermissionErrorMessage('review', 'delete'));
    }

    for (const image of review.images) {
      await this.commonService.deleteImageById(image.id, queryRunner);
    }

    return await repository.delete(reviewId);
  }

  async updateReviewById(
    reviewId: string,
    userId: string,
    dto: UpdateSpiritReviewDto | UpdateWineReviewDto | UpdateCocktailReviewDto,
    queryRunner?: QueryRunner,
  ) {
    const repository = this.commonService.getRepositoryWithQueryRunner(
      dto.type,
      this.repositoryMap,
      this.modelMap,
      queryRunner,
    ) as Repository<ReviewModel>;

    const review = await repository.findOne({
      where: {
        id: reviewId,
      },
      relations: ['author', 'images', 'alcohol'],
    });

    if (!review) {
      throw new NotFoundException(NotFoundErrorMessage(dto.type));
    }

    if (review.author.id !== userId) {
      throw new BadRequestException(PermissionErrorMessage(dto.type, 'update'));
    }

    const { images, ...dtoWithOutImages } = dto;

    const updatedReview = await repository.save({
      ...review,
      ...dtoWithOutImages,
    });

    return updatedReview;
  }
}
