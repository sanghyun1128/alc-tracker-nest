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
import { SpiritModel, WineModel, CocktailModel, AlcoholModel } from 'src/alcohol/entities/alcohol.entity';
import { CommonService } from 'src/common/common.service';
import { TEMP_FOLDER_PATH, ALCOHOLS_IMAGES_FOLDER_PATH } from 'src/common/const/path.const';
import { BaseModel } from 'src/common/entities/base.entity';
import { ImageModel } from 'src/common/entities/image.entity';

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

  async createAlcoholImage(dto: CreateAlcoholImageDto) {
    const tempImagePath = join(TEMP_FOLDER_PATH, dto.path);

    try {
      await promises.access(tempImagePath);
    } catch (e) {
      throw new BadRequestException('Image not found');
    }

    const newPath = join(ALCOHOLS_IMAGES_FOLDER_PATH, dto.path);

    const image = this.imageRepository.create({
      ...dto,
    });

    const result = await this.imageRepository.save(image);

    await promises.rename(tempImagePath, newPath);

    return result;
  }

  private addQueryRunnerIfExist(
    queryRunner: QueryRunner | undefined,
    model: typeof AlcoholModel,
    repository: Repository<AlcoholModel>,
  ): Repository<AlcoholModel> {
    if (queryRunner) {
      return queryRunner.manager.getRepository(model);
    }

    return repository;
  }

  private selectRepositoryByType(type: string) {
    switch (type) {
      case 'spirit':
        return this.spiritRepository;
      case 'wine':
        return this.wineRepository;
      case 'cocktail':
        return this.cocktailRepository;
      default:
        throw new BadRequestException('Invalid type');
    }
  }

  private selectModelByType(type: string) {
    switch (type) {
      case 'spirit':
        return SpiritModel;
      case 'wine':
        return WineModel;
      case 'cocktail':
        return CocktailModel;
      default:
        throw new BadRequestException('Invalid type');
    }
  }

  async createSpirit(ownerId: string, spiritDto: CreateSpiritDto, queryRunner?: QueryRunner) {
    const repository = this.addQueryRunnerIfExist(
      queryRunner,
      this.selectModelByType('spirit'),
      this.selectRepositoryByType('spirit'),
    );

    const alcohol = repository.create({
      owner: {
        id: ownerId,
      },
      ...spiritDto,
      images: [],
    });

    const spirit = await repository.save(alcohol);

    return spirit;
  }

  async createWine(ownerId: string, wineDto: CreateWineDto) {
    const alcohol = this.wineRepository.create({
      owner: {
        id: ownerId,
      },
      ...wineDto,
    });

    const wine = await this.wineRepository.save(alcohol);

    return wine;
  }

  async createCocktail(ownerId: string, cocktailDto: CreateCocktailDto) {
    const alcohol = this.cocktailRepository.create({
      owner: {
        id: ownerId,
      },
      ...cocktailDto,
    });

    const cocktail = await this.cocktailRepository.save(alcohol);

    return cocktail;
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
    const purchaseDate = new Date('2020-11-28');

    for (let i = 0; i < 100; i++) {
      purchaseDate.setDate(purchaseDate.getDate() - i);
      await this.createSpirit(userId, {
        name: `Test Spirit ${i}`,
        category: SpiritCategoryEnum[i % 17],
        cask: CaskEnum[i % 9],
        maker: `Test Maker ${i}`,
        alc: 40 + i / 10,
        price: 100000 + i * 10,
        purchaseLocation: `Test Location ${i}`,
        purchaseDate: purchaseDate,
        images: [],
      });
    }
  }
}
