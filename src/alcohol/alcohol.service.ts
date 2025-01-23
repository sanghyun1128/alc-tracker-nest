import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'fs';
import { join } from 'path';
import { QueryRunner, Repository } from 'typeorm';

import { CaskEnum, SpiritCategoryEnum } from './const/spirit.const';
import { CreateAlcoholImageDto } from './dto/create-alcohol-image';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { CreateSpiritDto } from './dto/create-spirit.dto';
import { CreateWineDto } from './dto/create-wine.dto';
import { PaginateAlcoholDto } from './dto/paginate-alcohol.dto';
import { UpdateSpiritDto } from './dto/update-spirit.dto';
import { SpiritModel, WineModel, CocktailModel, AlcoholModel } from 'src/alcohol/entity/alcohol.entity';
import { CommonService } from 'src/common/common.service';
import { TEMP_FOLDER_PATH, ALCOHOLS_IMAGES_FOLDER_PATH } from 'src/common/const/path.const';
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

  async getAllSpirits(dto: PaginateAlcoholDto) {
    return this.commonService.paginate(
      dto,
      this.spiritRepository,
      {
        relations: ['owner', 'images'],
      },
      'alcohol/spirit',
    );
  }

  async getAllWines() {
    return await this.wineRepository.find({
      relations: ['owner'],
    });
  }

  async getAllCocktails() {
    return await this.cocktailRepository.find({
      relations: ['owner'],
    });
  }

  async getAlcoholById(id: string) {
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

  async createAlcoholImage(dto: CreateAlcoholImageDto, queryRunner?: QueryRunner) {
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

  async updateSpirit(id: string, ownerId: string, spiritDto: UpdateSpiritDto) {
    const spirit = await this.spiritRepository.findOne({
      where: {
        id,
        owner: {
          id: ownerId,
        },
      },
    });

    if (!spirit) {
      throw new NotFoundException(`Spirit with id ${id} not found`);
    }

    // const updatedSpirit = await this.spiritRepository.save({
    //   ...spirit,
    //   ...spiritDto,
    // });

    return false;
  }

  //TODO: Test code
  async generateTestData(userId: string) {
    const purchaseDate = new Date('2023-11-28');

    for (let i = 0; i < 100; i++) {
      purchaseDate.setDate(purchaseDate.getDate() - 1);
      await this.createSpirit(userId, {
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
    }
  }
}
