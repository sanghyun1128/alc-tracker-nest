import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, QueryRunner, Repository } from 'typeorm';

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
import { AlcoholService } from 'src/alcohol/alcohol.service';
import { AlcoholModel } from 'src/alcohol/entity/alcohol.entity';
import { CommonService } from 'src/common/common.service';
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
    @Inject(forwardRef(() => AlcoholService))
    private readonly alcoholService: AlcoholService,
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

  // Get a single review by its ID.
  async getReviewById(
    reviewId: ReviewModel['id'],
    queryRunner?: QueryRunner,
  ): Promise<ReviewModel> {
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
      relations: ['images', 'author'],
    });

    if (!review) {
      throw new NotFoundException(NotFoundErrorMessage('review'));
    }

    return review;
  }

  // Get paginated list of reviews by a specific alcohol ID.
  async getReviewsByAlcoholId(
    alcoholId: AlcoholModel['id'],
    dto: PaginateReviewDto,
  ): Promise<
    | { data: ReviewModel[]; total: number }
    | { data: ReviewModel[]; cursor: { after: number }; count: number; next: string | null }
  > {
    const repository = this.commonService.getRepositoryWithQueryRunner(
      'review',
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
      },
      `reviews/${alcoholId}`,
    );
  }

  // Create a new review for a specific alcohol type.
  async createReview(
    userId: UserModel['id'],
    dto: CreateSpiritReviewDto | CreateWineReviewDto | CreateCocktailReviewDto,
    queryRunner?: QueryRunner,
  ): Promise<ReviewModel> {
    // 1. Get the repository for the specific alcohol type with query runner.
    const repository = this.commonService.getRepositoryWithQueryRunner(
      dto.alcoholType,
      this.repositoryMap,
      this.modelMap,
      queryRunner,
    ) as Repository<SpiritReviewModel | WineReviewModel | CocktailReviewModel>;

    // 2. Check if the user is the owner of the alcohol.
    const alcohol = await this.alcoholService.getAlcoholById(dto.alcoholId);

    if (alcohol.owner.id !== userId) {
      throw new BadRequestException(PermissionErrorMessage('review', 'create'));
    }

    // 3. Create a new review.
    const review = repository.create({
      author: {
        id: userId,
      },
      ...dto,
      images: [],
    });

    const result = await repository.save(review);

    // 4. Create images.
    for (const image of dto.images) {
      image.isNew &&
        (await this.commonService.createImage(
          {
            reviewId: result.id,
            order: image.order,
            path: image.path,
          },
          queryRunner,
        ));
    }

    return this.getReviewById(result.id, queryRunner);
  }

  // Update a review by its ID.
  async updateReviewById(
    reviewId: ReviewModel['id'],
    userId: UserModel['id'],
    dto: UpdateSpiritReviewDto | UpdateWineReviewDto | UpdateCocktailReviewDto,
    queryRunner?: QueryRunner,
  ): Promise<ReviewModel> {
    // 1. Get the repository for the specific alcohol type with query runner.
    const repository = this.commonService.getRepositoryWithQueryRunner(
      dto.alcoholType,
      this.repositoryMap,
      this.modelMap,
      queryRunner,
    ) as Repository<SpiritReviewModel | WineReviewModel | CocktailReviewModel>;

    // 2. Check if the review exists and the user is the author.
    const review = await this.getReviewById(reviewId);

    if (!review) {
      throw new NotFoundException(NotFoundErrorMessage(dto.alcoholType));
    }

    if (review.author.id !== userId) {
      throw new BadRequestException(PermissionErrorMessage(dto.alcoholType, 'update'));
    }

    // 3. Update the review.
    const { images, deletedImages, ...dtoWithOutImages } = dto;

    const updatedReview = await repository.save({
      ...review,
      ...dtoWithOutImages,
    });

    // 4. Update images.
    for (const image of images) {
      // 4-1. If the image is new, create a new image.
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
        // 4-2. If the image is not new, update the existing image.
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

    // 5. Delete unused images.
    for (const image of deletedImages) {
      const imageId = review.images.find((reviewImage) => reviewImage.path === image.path).id;

      await this.commonService.deleteImageById(imageId, queryRunner);
    }

    return await this.getReviewById(updatedReview.id);
  }

  // Delete a review by its ID.
  async deleteReviewById(
    reviewId: ReviewModel['id'],
    userId: UserModel['id'],
    queryRunner?: QueryRunner,
  ): Promise<DeleteResult> {
    // 1. Get the repository with query runner.
    const repository = this.commonService.getRepositoryWithQueryRunner(
      'review',
      this.repositoryMap,
      this.modelMap,
      queryRunner,
    ) as Repository<ReviewModel>;

    // 2. Check if the review exists and the user is the author.
    const review = await this.getReviewById(reviewId);

    if (!review) {
      throw new NotFoundException(NotFoundErrorMessage('review'));
    }

    if (review.author.id !== userId) {
      throw new BadRequestException(PermissionErrorMessage('review', 'delete'));
    }

    // 3. Delete images.
    for (const image of review.images) {
      await this.commonService.deleteImageById(image.id, queryRunner);
    }

    // 4. Delete review.
    const result = await repository.delete(reviewId);

    return result;
  }
}
