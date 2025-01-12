import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { CreateSpiritDto } from './dto/create-spirit.dto';
import { CreateWineDto } from './dto/create-wine.dto';
import { PaginateAlcoholDto } from './dto/paginate-alcohol.dto';
import { UpdateSpiritDto } from './dto/update-spirit.dto';
import {
  CocktailModel,
  SpiritModel,
  WineModel,
} from './entities/alcohol.entity';

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

  async getAllSpirits() {
    return await this.spiritRepository.find({
      relations: ['owner'],
    });
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

  async paginateAlcohol(dto: PaginateAlcoholDto) {
    const alcohols = await this.spiritRepository.find({
      where: {
        createdAt: MoreThan(dto.where__createdAt_more_than ?? new Date(0)),
      },

      order: {
        createdAt: dto.order__createdAt,
      },

      take: dto.take,
    });

    return {
      data: alcohols,
    };
  }
}
