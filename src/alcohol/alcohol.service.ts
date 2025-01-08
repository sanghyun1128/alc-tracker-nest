import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { CreateSpiritDto } from './dto/create-spirit.dto';
import { CreateWineDto } from './dto/create-wine.dto';
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

  async createSpirit(ownerId: number, spiritDto: CreateSpiritDto) {
    const alcohol = this.spiritRepository.create({
      owner: {
        id: ownerId,
      },
      ...spiritDto,
    });

    const spirit = this.spiritRepository.save(alcohol);

    return spirit;
  }

  async createWine(ownerId: number, wineDto: CreateWineDto) {
    const alcohol = this.wineRepository.create({
      owner: {
        id: ownerId,
      },
      ...wineDto,
    });

    const wine = this.wineRepository.save(alcohol);

    return wine;
  }

  async createCocktail(ownerId: number, cocktailDto: CreateCocktailDto) {
    const alcohol = this.cocktailRepository.create({
      owner: {
        id: ownerId,
      },
      ...cocktailDto,
    });

    const cocktail = this.cocktailRepository.save(alcohol);

    return cocktail;
  }
}
