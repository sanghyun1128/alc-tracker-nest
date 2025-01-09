import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { AlcoholService } from './alcohol.service';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { CreateSpiritDto } from './dto/create-spirit.dto';
import { CreateWineDto } from './dto/create-wine.dto';
import { UpdateSpiritDto } from './dto/update-spirit.dto';
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
    @Body() dto: CreateSpiritDto,
  ) {
    return this.alcoholService.createSpirit(userId, dto);
  }

  @Post('/wine')
  @UseGuards(AccessTokenGuard)
  postWine(@User('id') userId: UserModel['id'], @Body() dto: CreateWineDto) {
    return this.alcoholService.createWine(userId, dto);
  }

  @Post('/cocktail')
  @UseGuards(AccessTokenGuard)
  postCocktail(
    @User('id') userId: UserModel['id'],
    @Body() dto: CreateCocktailDto,
  ) {
    return this.alcoholService.createCocktail(userId, dto);
  }

  @Put('/spirit/:id')
  @UseGuards(AccessTokenGuard)
  putSpirit(
    @Param('id', ParseIntPipe) id: number,
    @User('id') userId: UserModel['id'],
    @Body() dto: UpdateSpiritDto,
  ) {
    return this.alcoholService.updateSpirit(id, userId, dto);
  }
}
