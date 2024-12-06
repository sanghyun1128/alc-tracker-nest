import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CocktailCategoryEnum } from './const/cocktail.const';
import { CaskEnum, SpiritCategoryEnum } from './const/spirit.const';
import {
  CombinedAppellationType,
  GrapeVarietyEnum,
  WineCategoryEnum,
  WineRegionEnum,
} from './const/wine.const';
import {
  AlcoholModel,
  CocktailModel,
  SpiritModel,
  WineModel,
} from './entities/alcohol.entity';

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
  ) {}

  async getAllSpirits() {
    return this.spiritRepository.find({
      relations: ['owner'],
    });
  }

  async getAllWines() {
    return this.wineRepository.find({
      relations: ['owner'],
    });
  }

  async getAllCocktails() {
    return this.cocktailRepository.find({
      relations: ['owner'],
    });
  }

  async getAlcoholById(id: number) {
    const alcohol = await this.alcoholRepository.findOne({
      where: {
        id,
      },
      relations: ['owner'],
    });

    if (!alcohol) {
      throw new NotFoundException(`Alcohol with id ${id} not found`);
    }

    return alcohol;
  }

  async createSpirit(
    ownerId: number,
    name: string,
    category: SpiritCategoryEnum,
    cask: CaskEnum,
    maker: string,
    alc: number,
    price: number,
    purchaseLocation: string,
    purchaseDate: Date,
  ) {
    const alcohol = this.spiritRepository.create({
      owner: {
        id: ownerId,
      },
      name,
      category,
      cask,
      maker,
      alc,
      price,
      purchaseLocation,
      purchaseDate,
    });

    const spirit = this.spiritRepository.save(alcohol);

    return spirit;
  }

  async createWine(
    ownerId: number,
    name: string,
    category: WineCategoryEnum,
    region: WineRegionEnum,
    appellation: CombinedAppellationType,
    grape: GrapeVarietyEnum,
    vintage: number,
    maker: string,
    alc: number,
    price: number,
    purchaseLocation: string,
    purchaseDate: Date,
  ) {
    const alcohol = this.wineRepository.create({
      owner: {
        id: ownerId,
      },
      name,
      category,
      region,
      appellation,
      grape,
      vintage,
      maker,
      alc,
      price,
      purchaseLocation,
      purchaseDate,
    });

    const wine = this.wineRepository.save(alcohol);

    return wine;
  }

  async createCocktail(
    ownerId: number,
    name: string,
    category: CocktailCategoryEnum,
  ) {
    const alcohol = this.cocktailRepository.create({
      owner: {
        id: ownerId,
      },
      name,
      category,
    });

    const cocktail = this.cocktailRepository.save(alcohol);

    return cocktail;
  }
}
