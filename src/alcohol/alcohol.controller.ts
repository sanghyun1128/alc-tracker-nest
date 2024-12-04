import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { AlcoholService } from './alcohol.service';
import { CocktailCategoryEnum } from './const/cocktail.const';
import { CaskEnum, SpiritCategoryEnum } from './const/spirit.const';
import {
  CombinedAppellationType,
  GrapeVarietyEnum,
  WineCategoryEnum,
  WineRegionEnum,
} from './const/wine.const';

@Controller('alcohol')
export class AlcoholController {
  constructor(private readonly alcoholService: AlcoholService) {}

  @Get('/spirit')
  getAllSpirits() {
    return this.alcoholService.getAllSpirits();
  }

  @Get('/wine')
  getAllWines() {
    return this.alcoholService.getAllWines();
  }

  @Get('/cocktail')
  getAllCocktails() {
    return this.alcoholService.getAllCocktails();
  }

  @Get(':id')
  getAlcoholById(@Param('id') id: string) {
    return this.alcoholService.getAlcoholById(+id);
  }

  @Post('/spirit')
  createSpirit(
    @Body('ownerId') ownerId: number,
    @Body('name') name: string,
    @Body('category') category: SpiritCategoryEnum,
    @Body('cask') cask: CaskEnum,
    @Body('maker') maker: string,
    @Body('alc') alc: number,
    @Body('price') price: number,
    @Body('purchaseLocation') purchaseLocation: string,
    @Body('purchaseDate') purchaseDate: Date,
  ) {
    return this.alcoholService.createSpirit(
      ownerId,
      name,
      category,
      cask,
      maker,
      alc,
      price,
      purchaseLocation,
      purchaseDate,
    );
  }

  @Post('/wine')
  createWine(
    @Body('ownerId') ownerId: number,
    @Body('name') name: string,
    @Body('category') category: WineCategoryEnum,
    @Body('region') region: WineRegionEnum,
    @Body('appellation') appellation: CombinedAppellationType,
    @Body('grape') grape: GrapeVarietyEnum,
    @Body('vintage') vintage: number,
    @Body('maker') maker: string,
    @Body('alc') alc: number,
    @Body('price') price: number,
    @Body('purchaseLocation') purchaseLocation: string,
    @Body('purchaseDate') purchaseDate: Date,
  ) {
    return this.alcoholService.createWine(
      ownerId,
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
    );
  }

  @Post('/cocktail')
  createCocktail(
    @Body('ownerId') ownerId: number,
    @Body('name') name: string,
    @Body('category') category: CocktailCategoryEnum,
  ) {
    return this.alcoholService.createCocktail(ownerId, name, category);
  }
}
