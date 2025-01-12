import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';

import { CaskEnum, SpiritCategoryEnum } from './const/spirit.const';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { CreateSpiritDto } from './dto/create-spirit.dto';
import { CreateWineDto } from './dto/create-wine.dto';
import { PaginateAlcoholDto } from './dto/paginate-alcohol.dto';
import { UpdateSpiritDto } from './dto/update-spirit.dto';
import { CocktailModel, SpiritModel, WineModel } from './entities/alcohol.entity';
import { MAX_INTEGER } from 'src/common/const/database.const';
import { HOST, PROTOCOL } from 'src/common/const/env-keys.const';

@Injectable()
export class AlcoholService {
  constructor(
    @InjectRepository(SpiritModel)
    private readonly spiritRepository: Repository<SpiritModel>,
    @InjectRepository(WineModel)
    private readonly wineRepository: Repository<WineModel>,
    @InjectRepository(CocktailModel)
    private readonly cocktailRepository: Repository<CocktailModel>,
  ) {}

  async getAllSpirits(dto: PaginateAlcoholDto) {
    const where: FindOptionsWhere<SpiritModel> = {};

    if (dto.order__createdAt === 'ASC') {
      where.alcoholIndex = MoreThan(dto.where__cursor ?? 0);
    } else if (dto.order__createdAt === 'DESC') {
      where.alcoholIndex = LessThan(dto.where__cursor ?? MAX_INTEGER);
    }

    const spirits = await this.spiritRepository.find({
      where,
      order: {
        createdAt: dto.order__createdAt,
      },

      take: dto.take,
    });

    const lastItem = spirits.length > 0 && spirits.length === dto.take ? spirits[spirits.length - 1] : null;

    const nextUrl = lastItem ? new URL(`${PROTOCOL}://${HOST}/alcohol/spirit`) : null;

    if (nextUrl) {
      for (const key in dto) {
        if (dto[key]) {
          if (key !== 'where__cursor') {
            nextUrl.searchParams.append(key, dto[key]);
          }
        }
      }

      nextUrl.searchParams.append('where__cursor', lastItem.alcoholIndex.toString());
    }

    return {
      data: spirits,
      count: spirits.length,
      next: nextUrl ? decodeURIComponent(nextUrl.toString()) : null,
    };
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

  async createSpirit(ownerId: string, spiritDto: CreateSpiritDto) {
    const alcohol = this.spiritRepository.create({
      owner: {
        id: ownerId,
      },
      ...spiritDto,
    });

    const spirit = await this.spiritRepository.save(alcohol);

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

    const updatedSpirit = await this.spiritRepository.save({
      ...spirit,
      ...spiritDto,
    });

    return updatedSpirit;
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
        maker: '',
        alc: 40 + i / 10,
        price: 100000 + i * 10,
        purchaseLocation: `Test Location ${i}`,
        purchaseDate: purchaseDate,
      });
    }
  }
}
