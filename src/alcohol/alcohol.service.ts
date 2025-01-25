import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, QueryRunner, Repository } from 'typeorm';

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
import { BaseModel } from 'src/common/entity/base.entity';

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

  async getAllAlcohols(
    type: string,
    dto: PaginateAlcoholDto,
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
        relations: ['owner', 'images'],
      },
      `alcohol/${type}`,
    );
  }

  async getAlcoholById(id: string): Promise<AlcoholModel> {
    const alcohol = await this.alcoholRepository.findOne({
      where: {
        id,
      },
      relations: ['owner', 'images'],
    });

    if (!alcohol) {
      throw new NotFoundException(`Alcohol with id ${id} not found`);
    }

    return alcohol;
  }

  async deleteAlcoholById(
    ownerId: string,
    alcoholId: string,
    queryRunner?: QueryRunner,
  ): Promise<DeleteResult> {
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
      throw new NotFoundException(`Alcohol with id ${alcoholId} not found`);
    }

    if (alcohol.owner.id !== ownerId) {
      throw new BadRequestException(`You don't have permission to delete this alcohol`);
    }

    for (const image of alcohol.images) {
      await this.commonService.deleteAlcoholImageById(image.id, queryRunner);
    }

    return await repository.delete(alcoholId);
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
    queryRunner?: QueryRunner,
  ): Promise<AlcoholModel> {
    const repository = this.commonService.getRepositoryWithQueryRunner(
      type,
      this.repositoryMap,
      this.modelMap,
      queryRunner,
    ) as Repository<AlcoholModel>;

    const alcohol = await repository.findOne({
      where: {
        id,
      },
      relations: ['owner', 'images'],
    });

    if (!alcohol) {
      throw new NotFoundException(`${type} with id ${id} not found`);
    }

    if (alcohol.owner.id !== ownerId) {
      throw new BadRequestException(`You don't have permission to update this ${type}`);
    }

    const { images, ...updateAlcoholDtoWithoutImages } = updateAlcoholDto;

    const updatedAlcohol = await repository.save({
      ...alcohol,
      ...updateAlcoholDtoWithoutImages,
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
