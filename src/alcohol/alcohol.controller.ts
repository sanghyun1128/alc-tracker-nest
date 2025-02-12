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

  @Get('/:userId/:type')
  @UseGuards(AccessTokenGuard)
  getUserAlcohols(
    @Param('type') type: AlcoholType,
    @Param('userId') userId: UserModel['id'],
    @Query() query: PaginateAlcoholDto,
  ) {
    return this.alcoholService.getUserAlcohols(type, userId, query);
  }

  @Get('/my/:type')
  @UseGuards(AccessTokenGuard)
  getMyAlcohols(
    @Param('type') type: AlcoholType,
    @User('id') userId: UserModel['id'],
    @Query() query: PaginateAlcoholDto,
  ) {
    return this.alcoholService.getUserAlcohols(type, userId, query);
  }

  @Post('/:type')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async postAlcohol(
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

  @Get('/:alcoholId')
  @UseGuards(AccessTokenGuard)
  getAlcoholById(@Param('alcoholId') alcoholId: string) {
    return this.alcoholService.getAlcoholById(alcoholId);
  }

  @Delete('/:alcoholId')
  @UseGuards(AccessTokenGuard)
  deleteAlcoholById(@Param('alcoholId') alcoholId: string, @User('id') userId: UserModel['id']) {
    return this.alcoholService.deleteAlcoholById(alcoholId, userId);
  }

  @Put('/:alcoholId')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async updateAlcoholById(
    @Param('alcoholId') alcoholId: string,
    @User('id') userId: UserModel['id'],
    @Body() dto: UpdateSpiritDto | UpdateWineDto | UpdateCocktailDto,
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    const alcohol = await this.alcoholService.updateAlcohol(alcoholId, userId, dto, queryRunner);

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
          await this.commonService.updateImage(
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
