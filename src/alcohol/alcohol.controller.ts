import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryRunner as QueryRunnerType } from 'typeorm';

import { AlcoholService } from './alcohol.service';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { CreateSpiritDto } from './dto/create-spirit.dto';
import { CreateWineDto } from './dto/create-wine.dto';
import { PaginateAlcoholDto } from './dto/paginate-alcohol.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { UpdateSpiritDto } from './dto/update-spirit.dto';
import { UpdateWineDto } from './dto/update-wine.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { ImageModelEnum } from 'src/common/const/image-model.const';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { User } from 'src/users/decorator/user.decorator';
import { UserModel } from 'src/users/entity/user.entity';

@Controller('alcohol')
export class AlcoholController {
  constructor(private readonly alcoholService: AlcoholService) {}

  // Retrieve a paginated list of spirits
  @Get('/spirit')
  getAllSpirits(@Query() query: PaginateAlcoholDto) {
    return this.alcoholService.getAllAlcohols('spirit', query);
  }

  // Retrieve a paginated list of wines
  @Get('/wine')
  getAllWines(@Query() query: PaginateAlcoholDto) {
    return this.alcoholService.getAllAlcohols('wine', query);
  }

  // Retrieve a paginated list of cocktails
  @Get('/cocktail')
  getAllCocktails(@Query() query: PaginateAlcoholDto) {
    return this.alcoholService.getAllAlcohols('cocktail', query);
  }

  // Retrieve a specific alcohol by its ID
  @Get(':id')
  @UseGuards(AccessTokenGuard)
  getAlcoholById(@Param('id') id: string) {
    return this.alcoholService.getAlcoholById(id);
  }

  // Delete a specific alcohol by its ID
  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  deleteAlcoholById(@User('id') userId: UserModel['id'], @Param('id') alcoholId: string) {
    return this.alcoholService.deleteAlcoholById(userId, alcoholId);
  }

  // Create a new spirit
  @Post('/spirit')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async postSpirit(
    @User('id') userId: UserModel['id'],
    @Body() dto: CreateSpiritDto,
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    const alcohol = await this.alcoholService.createAlcohol('spirit', userId, dto, queryRunner);

    for (let i = 0; i < dto.images.length; i++) {
      await this.alcoholService.createAlcoholImage(
        {
          alcohol,
          order: i,
          path: dto.images[i],
          type: ImageModelEnum.ALCOHOL_IMAGE,
        },
        queryRunner,
      );
    }

    return alcohol;
  }

  // Create a new wine
  @Post('/wine')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async postWine(
    @User('id') userId: UserModel['id'],
    @Body() dto: CreateWineDto,
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    const alcohol = await this.alcoholService.createAlcohol('wine', userId, dto, queryRunner);

    for (let i = 0; i < dto.images.length; i++) {
      await this.alcoholService.createAlcoholImage(
        {
          alcohol,
          order: i,
          path: dto.images[i],
          type: ImageModelEnum.ALCOHOL_IMAGE,
        },
        queryRunner,
      );
    }

    return alcohol;
  }

  // Create a new cocktail
  @Post('/cocktail')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async postCocktail(
    @User('id') userId: UserModel['id'],
    @Body() dto: CreateCocktailDto,
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    const alcohol = await this.alcoholService.createAlcohol('cocktail', userId, dto, queryRunner);

    for (let i = 0; i < dto.images.length; i++) {
      await this.alcoholService.createAlcoholImage(
        {
          alcohol,
          order: i,
          path: dto.images[i],
          type: ImageModelEnum.ALCOHOL_IMAGE,
        },
        queryRunner,
      );
    }

    return alcohol;
  }

  // Update a spirit by its ID
  @Put('/spirit/:id')
  @UseGuards(AccessTokenGuard)
  putSpirit(
    @Param('id', ParseIntPipe) id: string,
    @User('id') userId: UserModel['id'],
    @Body() dto: UpdateSpiritDto,
  ) {
    return this.alcoholService.updateAlcohol('spirit', id, userId, dto);
  }

  // Update a wine by its ID
  @Put('/wine/:id')
  @UseGuards(AccessTokenGuard)
  putWine(
    @Param('id', ParseIntPipe) id: string,
    @User('id') userId: UserModel['id'],
    @Body() dto: UpdateWineDto,
  ) {
    return this.alcoholService.updateAlcohol('wine', id, userId, dto);
  }

  // Update a cocktail by its ID
  @Put('/cocktail/:id')
  @UseGuards(AccessTokenGuard)
  putCocktail(
    @Param('id', ParseIntPipe) id: string,
    @User('id') userId: UserModel['id'],
    @Body() dto: UpdateCocktailDto,
  ) {
    return this.alcoholService.updateAlcohol('cocktail', id, userId, dto);
  }

  //TODO: Test code
  @Post('/test/many')
  @UseGuards(AccessTokenGuard)
  async postManyAlcohols(@User() user: UserModel) {
    await this.alcoholService.generateTestData(user.id);

    return true;
  }
}
