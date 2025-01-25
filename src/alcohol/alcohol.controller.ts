import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryRunner as QueryRunnerType } from 'typeorm';

import { AlcoholService } from './alcohol.service';
import { AlcoholType } from './const/\balcohol-type.const';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { CreateSpiritDto } from './dto/create-spirit.dto';
import { CreateWineDto } from './dto/create-wine.dto';
import { PaginateAlcoholDto } from './dto/paginate-alcohol.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { UpdateSpiritDto } from './dto/update-spirit.dto';
import { UpdateWineDto } from './dto/update-wine.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { CommonService } from 'src/common/common.service';
import { ImageModelEnum } from 'src/common/const/image-model.const';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { User } from 'src/users/decorator/user.decorator';
import { UserModel } from 'src/users/entity/user.entity';

@Controller('alcohol')
export class AlcoholController {
  constructor(
    private readonly alcoholService: AlcoholService,
    private readonly commonService: CommonService,
  ) {}

  // Retrieve a paginated list of alcohols
  @Get('/:type')
  getAllAlcohols(@Param('type') type: AlcoholType, @Query() query: PaginateAlcoholDto) {
    console.log('type', type);
    return this.alcoholService.getAllAlcohols(type, query);
  }

  // Create a new spirit, wine, or cocktail
  @Post('/:type')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async postSpirit(
    @Param('type') type: AlcoholType,
    @User('id') userId: UserModel['id'],
    @Body() dto: CreateSpiritDto | CreateWineDto | CreateCocktailDto,
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    const alcohol = await this.alcoholService.createAlcohol(type, userId, dto, queryRunner);

    //TODO: isNew is not used
    for (let i = 0; i < dto.images.length; i++) {
      await this.commonService.createAlcoholImage(
        {
          alcohol,
          order: dto.images[i].order,
          path: dto.images[i].path,
          type: ImageModelEnum.ALCOHOL_IMAGE,
        },
        queryRunner,
      );
    }

    return alcohol;
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

  // Update a specific spirit, wine, or cocktail by its ID
  @Put('/:type/:id')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  updateAlcohol(
    @Param('type') type: AlcoholType,
    @Param('id') id: string,
    @User('id') userId: UserModel['id'],
    @Body() dto: UpdateSpiritDto | UpdateWineDto | UpdateCocktailDto,
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    return this.alcoholService.updateAlcohol(type, id, userId, dto, queryRunner);
  }

  //TODO: Test code
  @Post('/test/many')
  @UseGuards(AccessTokenGuard)
  async postManyAlcohols(@User() user: UserModel) {
    await this.alcoholService.generateTestData(user.id);

    return true;
  }
}
