import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'fs';
import { join } from 'path';
import { QueryRunner, Repository } from 'typeorm';

import { CocktailCategoryEnum } from './const/cocktail.const';
import { CaskEnum, SpiritCategoryEnum } from './const/spirit.const';
import { CombinedAppellationEnum, GrapeVarietyEnum, WineCategoryEnum, WineRegionEnum } from './const/wine.const';
import { CreateAlcoholImageDto } from './dto/create-alcohol-image';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { CreateSpiritDto } from './dto/create-spirit.dto';
import { CreateWineDto } from './dto/create-wine.dto';
import { PaginateAlcoholDto } from './dto/paginate-alcohol.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { UpdateSpiritDto } from './dto/update-spirit.dto';
import { UpdateWineDto } from './dto/update-wine.dto';
import { SpiritModel, WineModel, CocktailModel, AlcoholModel } from 'src/alcohol/entity/alcohol.entity';
import { CommonService } from 'src/common/common.service';
import { TEMP_FOLDER_PATH, ALCOHOLS_IMAGES_FOLDER_PATH } from 'src/common/const/path.const';
import { BaseModel } from 'src/common/entity/base.entity';
import { ImageModel } from 'src/common/entity/image.entity';

@Injectable()
export class AlcoholService {
  constructor(
    @InjectRepository(SpiritModel)
    private readonly spiritRepository: Repository<SpiritModel>,
    @InjectRepository(WineModel)
    private readonly wineRepository: Repository<WineModel>,
    @InjectRepository(CocktailModel)
    private readonly cocktailRepository: Repository<CocktailModel>,
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,

    private readonly commonService: CommonService,
  ) {}

  private repositoryMap = {
    spirit: this.spiritRepository,
    wine: this.wineRepository,
    cocktail: this.cocktailRepository,
    image: this.imageRepository,
  };

  private modelMap = {
    spirit: SpiritModel,
    wine: WineModel,
    cocktail: CocktailModel,
    image: ImageModel,
  };

  async getAllAlcohols(
    type: string,
    dto: PaginateAlcoholDto,
  ): Promise<
    { data: BaseModel[]; total: number } | { data: BaseModel[]; cursor: { after: number }; count: number; next: URL }
  > {
    const repository = this.commonService.getRepositoryWithQueryRunner(type, this.repositoryMap, this.modelMap);

    return this.commonService.paginate(
      dto,
      repository,
      {
        relations: ['owner', 'images'],
      },
      `alcohol/${type}`,
    );
  }

  async getAlcoholById(id: string): Promise<AlcoholModel> {
    const spirit = await this.spiritRepository.findOne({
      where: {
        id,
      },
      relations: ['owner'],
    });

    if (spirit) {
      return spirit;
    }

    const wine = await this.wineRepository.findOne({
      where: {
        id,
      },
      relations: ['owner'],
    });

    if (wine) {
      return wine;
    }

    const cocktail = await this.cocktailRepository.findOne({
      where: {
        id,
      },
      relations: ['owner'],
    });

    if (cocktail) {
      return cocktail;
    }

    if (!cocktail && !spirit && !wine) {
      throw new NotFoundException(`Alcohol with id ${id} not found`);
    }
  }

  async createAlcoholImage(dto: CreateAlcoholImageDto, queryRunner?: QueryRunner): Promise<ImageModel> {
    const repository = this.commonService.getRepositoryWithQueryRunner(
      'image',
      this.repositoryMap,
      this.modelMap,
      queryRunner,
    ) as Repository<ImageModel>;

    const tempImagePath = join(TEMP_FOLDER_PATH, dto.path);

    try {
      await promises.access(tempImagePath);
    } catch (e) {
      throw new BadRequestException('Image not found');
    }

    const newPath = join(ALCOHOLS_IMAGES_FOLDER_PATH, dto.path);

    const image = repository.create({
      ...dto,
    });

    const result = await repository.save(image);

    await promises.rename(tempImagePath, newPath);

    return result;
  }

  async createAlcohol(
    type: string,
    ownerId: string,
    dto: CreateSpiritDto | CreateWineDto | CreateCocktailDto,
    queryRunner?: QueryRunner,
  ): Promise<AlcoholModel> {
    const repository = this.commonService.getRepositoryWithQueryRunner(
      type,
      this.repositoryMap,
      this.modelMap,
      queryRunner,
    ) as Repository<AlcoholModel>;

    const alcohol = repository.create({
      owner: {
        id: ownerId,
      },
      ...dto,
      images: [],
    });

    const result = await repository.save(alcohol);

    return result;
  }

  async updateAlcohol(
    type: string,
    id: string,
    ownerId: string,
    updateAlcoholDto: UpdateSpiritDto | UpdateWineDto | UpdateCocktailDto,
  ): Promise<AlcoholModel> {
    const repository = this.commonService.getRepositoryWithQueryRunner(
      type,
      this.repositoryMap,
      this.modelMap,
    ) as Repository<AlcoholModel>;

    const alcohol = await repository.findOne({
      where: {
        id,
        owner: {
          id: ownerId,
        },
      },
    });

    if (!alcohol) {
      throw new NotFoundException(`${type} with id ${id} not found`);
    }

    const updatedAlcohol = await repository.save({
      ...alcohol,
      ...updateAlcoholDto,
    });

    return updatedAlcohol;
  }

  //TODO: Test code
  async generateTestData(userId: string) {
    const purchaseDate = new Date('2023-11-28');

    for (let i = 0; i < 100; i++) {
      purchaseDate.setDate(purchaseDate.getDate() - 1);

      await this.createAlcohol('spirit', userId, {
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

      await this.createAlcohol('wine', userId, {
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

      await this.createAlcohol('cocktail', userId, {
        name: `Test Cocktail ${i}`,
        category: CocktailCategoryEnum[i % 5],
        images: [],
      });
    }
  }
}
