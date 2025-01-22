import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DataSource, QueryRunner as QueryRunnerType } from 'typeorm';

import { AlcoholService } from './alcohol.service';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { CreateSpiritDto } from './dto/create-spirit.dto';
import { CreateWineDto } from './dto/create-wine.dto';
import { PaginateAlcoholDto } from './dto/paginate-alcohol.dto';
import { UpdateSpiritDto } from './dto/update-spirit.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { ImageModelEnum } from 'src/common/const/image-model.const';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { User } from 'src/users/decorator/user.decorator';
import { UserModel } from 'src/users/entities/user.entity';

@Controller('alcohol')
export class AlcoholController {
  constructor(
    private readonly alcoholService: AlcoholService,
    private readonly dataSource: DataSource,
  ) {}

  @Get('/spirit')
  getAllSpirits(@Query() query: PaginateAlcoholDto) {
    return this.alcoholService.getAllSpirits(query);
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
  getAlcoholById(@Param('id', ParseIntPipe) id: string) {
    return this.alcoholService.getAlcoholById(id);
  }

  @Post('/spirit')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async postSpirit(
    @User('id') userId: UserModel['id'],
    @Body() dto: CreateSpiritDto,
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    const alcohol = await this.alcoholService.createSpirit(userId, dto, queryRunner);

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

  @Post('/wine')
  @UseGuards(AccessTokenGuard)
  postWine(@User('id') userId: UserModel['id'], @Body() dto: CreateWineDto) {
    return this.alcoholService.createWine(userId, dto);
  }

  @Post('/cocktail')
  @UseGuards(AccessTokenGuard)
  postCocktail(@User('id') userId: UserModel['id'], @Body() dto: CreateCocktailDto) {
    return this.alcoholService.createCocktail(userId, dto);
  }

  @Patch('/spirit/:id')
  @UseGuards(AccessTokenGuard)
  patchSpirit(
    @Param('id', ParseIntPipe) id: string,
    @User('id') userId: UserModel['id'],
    @Body() dto: UpdateSpiritDto,
  ) {
    return this.alcoholService.updateSpirit(id, userId, dto);
  }

  //TODO: Test code
  @Post('/test/many')
  @UseGuards(AccessTokenGuard)
  async postManyAlcohols(@User() user: UserModel) {
    await this.alcoholService.generateTestData(user.id);

    return true;
  }
}
