import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, QueryRunner, Repository } from 'typeorm';

import { AlcoholType } from './const/alcohol-type.const';
import { CocktailCategoryEnum } from './const/cocktail.const';
import { CaskEnum, SpiritCategoryEnum } from './const/spirit.const';
import {
  CombinedAppellationEnum,
  GrapeVarietyEnum,
  WineCategoryEnum,
  WineRegionEnum,
} from './const/wine.const';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { CreateSpiritDto } from './dto/create-spirit.dto';
import { CreateWineDto } from './dto/create-wine.dto';
import { PaginateAlcoholDto } from './dto/paginate-alcohol.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { UpdateSpiritDto } from './dto/update-spirit.dto';
import { UpdateWineDto } from './dto/update-wine.dto';
import {
  SpiritModel,
  WineModel,
  CocktailModel,
  AlcoholModel,
} from 'src/alcohol/entity/alcohol.entity';
import { CommonService } from 'src/common/common.service';
import { NotFoundErrorMessage, PermissionErrorMessage } from 'src/common/error-message';
import { ReviewsService } from 'src/reviews/reviews.service';
import { UserModel } from 'src/users/entity/user.entity';

@Injectable()
export class AlcoholService {
  constructor(
    @InjectRepository(AlcoholModel)
    private readonly alcoholRepository: Repository<AlcoholModel>,
    @InjectRepository(SpiritModel)
    private readonly spiritRepository: Repository<SpiritModel>,
    @InjectRepository(WineModel)
    private readonly wineRepository: Repository<WineModel>,
    @InjectRepository(CocktailModel)
    private readonly cocktailRepository: Repository<CocktailModel>,

    private readonly commonService: CommonService,
    private readonly reviewService: ReviewsService,
  ) {}

  private repositoryMap = {
    alcohol: this.alcoholRepository,
    spirit: this.spiritRepository,
    wine: this.wineRepository,
    cocktail: this.cocktailRepository,
  };

  private modelMap = {
    alcohol: AlcoholModel,
    spirit: SpiritModel,
    wine: WineModel,
    cocktail: CocktailModel,
  };

  // Get alcohol which is specified by id
  async getAlcoholById(alcoholId: string, queryRunner?: QueryRunner): Promise<AlcoholModel> {
    const repository = this.commonService.getRepositoryWithQueryRunner(
      'alcohol',
      this.repositoryMap,
      this.modelMap,
      queryRunner,
    ) as Repository<AlcoholModel>;

    const alcohol = await repository.findOne({
      where: {
        id: alcoholId,
      },
      relations: ['owner', 'images'],
    });

    if (!alcohol) {
      throw new NotFoundException(NotFoundErrorMessage('alcohol'));
    }

    return alcohol;
  }

  // Get all alcohols of a user
  async getUserAlcohols(
    type: AlcoholType,
    userId: UserModel['id'],
    dto: PaginateAlcoholDto,
  ): Promise<
    | { data: AlcoholModel[]; total: number }
    | { data: AlcoholModel[]; cursor: { after: number }; count: number; next: string | null }
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
          owner: {
            id: userId,
          },
        },
        relations: ['owner', 'images'],
      },
      `alcohol/${userId}/${type}`,
    );
  }

  // Create a new alcohol with specified type
  async createAlcohol(
    userId: string,
    dto: CreateSpiritDto | CreateWineDto | CreateCocktailDto,
    queryRunner?: QueryRunner,
  ): Promise<AlcoholModel> {
    // 1. Get repository with queryRunner
    const repository = this.commonService.getRepositoryWithQueryRunner(
      dto.alcoholType,
      this.repositoryMap,
      this.modelMap,
      queryRunner,
    ) as Repository<AlcoholModel>;

    const { images, ...dtoWithoutImages } = dto;

    // 2. Create alcohol
    const alcohol = repository.create({
      owner: {
        id: userId,
      },
      ...dtoWithoutImages,
      images: [],
    });

    const result = await repository.save(alcohol);

    // 3. Create images
    for (const image of images) {
      image.isNew &&
        (await this.commonService.createImage(
          {
            alcoholId: alcohol.id,
            order: image.order,
            path: image.path,
          },
          queryRunner,
        ));
    }

    return this.getAlcoholById(result.id, queryRunner);
  }

  // Delete alcohol which is specified by id
  async deleteAlcoholById(
    alcoholId: string,
    userId: string,
    queryRunner?: QueryRunner,
  ): Promise<DeleteResult> {
    // 1. Get repository with queryRunner
    const repository = this.commonService.getRepositoryWithQueryRunner(
      'alcohol',
      this.repositoryMap,
      this.modelMap,
      queryRunner,
    ) as Repository<AlcoholModel>;

    // 2. Get alcohol by id and check if it exists and the user is the owner
    const alcohol = await this.getAlcoholById(alcoholId, queryRunner);

    if (!alcohol) {
      throw new NotFoundException(NotFoundErrorMessage('alcohol'));
    }

    if (alcohol.owner.id !== userId) {
      throw new BadRequestException(PermissionErrorMessage('alcohol', 'delete'));
    }

    // 3. Delete related images
    for (const image of alcohol.images) {
      await this.commonService.deleteImageById(image.id, queryRunner);
    }

    // 4. Delete related reviews
    for (const review of alcohol.reviews) {
      await this.reviewService.deleteReviewById(review.id, userId, queryRunner);
    }

    // 5. Delete alcohol
    const result = await repository.delete(alcoholId);

    return result;
  }

  // Update alcohol which is specified by id
  async updateAlcoholById(
    alcoholId: string,
    userId: string,
    dto: UpdateSpiritDto | UpdateWineDto | UpdateCocktailDto,
    queryRunner?: QueryRunner,
  ): Promise<AlcoholModel> {
    // 1. Get repository with queryRunner
    const repository = this.commonService.getRepositoryWithQueryRunner(
      dto.type,
      this.repositoryMap,
      this.modelMap,
      queryRunner,
    ) as Repository<AlcoholModel>;

    // 2. Get alcohol by id and check if it exists and the user is the owner
    const alcohol = await this.getAlcoholById(alcoholId, queryRunner);

    if (!alcohol) {
      throw new NotFoundException(NotFoundErrorMessage(dto.type));
    }

    if (alcohol.owner.id !== userId) {
      throw new BadRequestException(PermissionErrorMessage(dto.type, 'update'));
    }

    // 3. Update alcohol
    const { images, ...dtoWithoutImages } = dto;

    const updatedAlcohol = await repository.save({
      ...alcohol,
      ...dtoWithoutImages,
    });

    // 4. Update images
    for (const image of images) {
      // 4-1. If the image is new, create a new image
      if (image.isNew) {
        await this.commonService.createImage(
          {
            alcoholId: alcohol.id,
            order: image.order,
            path: image.path,
          },
          queryRunner,
        );
      } else {
        // 4-2. If the image is not new, update the existing image
        const alcoholImage = alcohol.images.find(
          (alcoholImage) => alcoholImage.path === image.path,
        );

        if (alcoholImage) {
          await this.commonService.updateImage(
            alcoholImage.id,
            {
              order: image.order,
            },
            queryRunner,
          );
        }
      }
    }

    // 5. Delete unused images
    for (const image of dto.deletedImages) {
      const imageId = alcohol.images.find((alcoholImage) => alcoholImage.path === image.path).id;

      await this.commonService.deleteImageById(imageId, queryRunner);
    }

    return await this.getAlcoholById(updatedAlcohol.id, queryRunner);
  }

  //TODO: Test code
  async generateTestData(userId: string) {
    const purchaseDate = new Date('2023-11-28');

    for (let i = 0; i < 100; i++) {
      purchaseDate.setDate(purchaseDate.getDate() - 1);

      await this.createAlcohol(userId, {
        alcoholType: AlcoholType.SPIRIT,
        name: `Test Spirit ${i}`,
        category: SpiritCategoryEnum[i % 17],
        cask: CaskEnum[i % 9],
        maker: `Test Maker ${i}`,
        alc: 40 + i / 10,
        price: 100000 + i * 100,
        purchaseLocation: `Test Location ${i}`,
        purchaseDate: purchaseDate,
        images: [],
      });

      await this.createAlcohol(userId, {
        alcoholType: AlcoholType.WINE,
        name: `Test Wine ${i}`,
        category: WineCategoryEnum[i % 5],
        region: WineRegionEnum[i % 5],
        appellation: CombinedAppellationEnum[i % 5],
        grape: GrapeVarietyEnum[i % 5],
        vintage: 1920 + i,
        maker: `Test Maker ${i}`,
        alc: 12 + i / 10,
        price: 100000 + i * 1000,
        purchaseLocation: `Test Location ${i}`,
        purchaseDate: purchaseDate,
        images: [],
      });

      await this.createAlcohol(userId, {
        alcoholType: AlcoholType.COCKTAIL,
        name: `Test Cocktail ${i}`,
        category: CocktailCategoryEnum[i % 5],
        images: [],
      });
    }
  }
}
