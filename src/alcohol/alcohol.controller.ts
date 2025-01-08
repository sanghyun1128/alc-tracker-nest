import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AlcoholService } from './alcohol.service';
import { CocktailCategoryEnum } from './const/cocktail.const';
import { CaskEnum, SpiritCategoryEnum } from './const/spirit.const';
import {
  CombinedAppellationType,
  GrapeVarietyEnum,
  WineCategoryEnum,
  WineRegionEnum,
} from './const/wine.const';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { UserModel } from 'src/users/entities/user.entity';

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
  getAlcoholById(@Param('id', ParseIntPipe) id: number) {
    return this.alcoholService.getAlcoholById(id);
  }

  @Post('/spirit')
  @UseGuards(AccessTokenGuard)
  postSpirit(
    @User('id') userId: UserModel['id'],
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
      userId,
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
  @UseGuards(AccessTokenGuard)
  postWine(
    @User('id') userId: UserModel['id'],
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
      userId,
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
  @UseGuards(AccessTokenGuard)
  postCocktail(
    @User('id') userId: UserModel['id'],
    @Body('name') name: string,
    @Body('category') category: CocktailCategoryEnum,
  ) {
    return this.alcoholService.createCocktail(userId, name, category);
  }
}
