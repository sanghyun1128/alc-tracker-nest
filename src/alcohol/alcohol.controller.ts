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

  /**
   * Get alcohol records for a specific user by type.
   *
   * @Param type - The type of alcohol.
   * @Param userId - The ID of the user.
   * @Query query - Pagination and filter options.
   * @returns A list of alcohol records.
   */
  @Get('/:userId/:type')
  @UseGuards(AccessTokenGuard)
  getUserAlcohols(
    @Param('type') type: AlcoholType,
    @Param('userId') userId: UserModel['id'],
    @Query() query: PaginateAlcoholDto,
  ) {
    return this.alcoholService.getUserAlcohols(type, userId, query);
  }

  /**
   * Get alcohol records for the authenticated user by type.
   *
   * @Param type - The type of alcohol.
   * @User userId - The ID of the authenticated user.
   * @Query query - Pagination and filter options.
   * @returns A list of alcohol records.
   */
  @Get('/my/:type')
  @UseGuards(AccessTokenGuard)
  getMyAlcohols(
    @Param('type') type: AlcoholType,
    @User('id') userId: UserModel['id'],
    @Query() query: PaginateAlcoholDto,
  ) {
    return this.alcoholService.getUserAlcohols(type, userId, query);
  }

  /**
   * Create a new alcohol record.
   *
   * @Param type - The type of alcohol.
   * @User userId - The ID of the authenticated user.
   * @Body dto - The data transfer object containing alcohol details.
   * @QueryRunner queryRunner - The query runner for transaction management.
   * @returns The created alcohol record.
   */
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

  /**
   * Get a specific alcohol by its ID.
   *
   * @Param alcoholId - The ID of the alcohol.
   * @returns The alcohol record.
   */
  @Get('/:alcoholId')
  @UseGuards(AccessTokenGuard)
  getAlcoholById(@Param('alcoholId') alcoholId: string) {
    return this.alcoholService.getAlcoholById(alcoholId);
  }

  /**
   * Delete an alcohol record by its ID.
   *
   * @Param alcoholId - The ID of the alcohol.
   * @returns Result of the deletion.
   */
  @Delete('/:alcoholId')
  @UseGuards(AccessTokenGuard)
  deleteAlcoholById(@Param('alcoholId') alcoholId: string, @User('id') userId: UserModel['id']) {
    return this.alcoholService.deleteAlcoholById(alcoholId, userId);
  }

  /**
   * Update an existing alcohol record.
   *
   * @Param alcoholId - The ID of the alcohol.
   * @User userId - The ID of the authenticated user.
   * @Body dto - The data transfer object containing alcohol details.
   * @QueryRunner queryRunner - The query runner for transaction management.
   * @returns The alcohol record.
   */
  @Put('/:alcoholId')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async updateAlcohol(
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
