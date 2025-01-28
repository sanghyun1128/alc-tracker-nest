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
import { AlcoholType } from './const/alcohol-type.const';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { CreateSpiritDto } from './dto/create-spirit.dto';
import { CreateWineDto } from './dto/create-wine.dto';
import { PaginateAlcoholDto } from './dto/paginate-alcohol.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { UpdateSpiritDto } from './dto/update-spirit.dto';
import { UpdateWineDto } from './dto/update-wine.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { CommonService } from 'src/common/common.service';
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

  //TODO: 자기가 소유한 알콜만 가져와야됨
  //TODO: 특정 유저의 알콜만 가져오는 API 필요
  // Retrieve a paginated list of alcohols
  @Get('/:type')
  getAllAlcohols(@Param('type') type: AlcoholType, @Query() query: PaginateAlcoholDto) {
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

    for (const image of dto.images) {
      image.isNew &&
        (await this.commonService.createImage(
          {
            alcoholId: alcohol.id,
            order: image.order,
            path: image.path,
          },
          queryRunner,
        ));
    }

    return await this.alcoholService.getAlcoholById(alcohol.id, queryRunner);
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

  // Update a specific alcohol by its ID
  @Put(':id')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async updateAlcohol(
    @Param('id') id: string,
    @User('id') userId: UserModel['id'],
    @Body() dto: UpdateSpiritDto | UpdateWineDto | UpdateCocktailDto,
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    const alcohol = await this.alcoholService.updateAlcohol(id, userId, dto, queryRunner);

    for (const image of dto.images) {
      if (image.isNew) {
        await this.commonService.createImage(
          {
            alcoholId: alcohol.id,
            order: image.order,
            path: image.path,
          },
          queryRunner,
        );
      } else {
        const alcoholImage = alcohol.images.find(
          (alcoholImage) => alcoholImage.path === image.path,
        );

        if (alcoholImage) {
          await this.commonService.updateAlcoholImage(
            alcoholImage.id,
            {
              order: image.order,
            },
            queryRunner,
          );
        }
      }
    }

    return await this.alcoholService.getAlcoholById(alcohol.id);
  }

  //TODO: Test code
  @Post('/test/many')
  @UseGuards(AccessTokenGuard)
  async postManyAlcohols(@User() user: UserModel) {
    await this.alcoholService.generateTestData(user.id);

    return true;
  }
}
