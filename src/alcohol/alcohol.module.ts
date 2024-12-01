import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlcoholController } from './alcohol.controller';
import { AlcoholService } from './alcohol.service';
import {
  AlcoholModel,
  CocktailModel,
  SpiritModel,
  WineModel,
} from './entities/alcohol.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AlcoholModel,
      SpiritModel,
      WineModel,
      CocktailModel,
    ]),
  ],
  controllers: [AlcoholController],
  providers: [AlcoholService],
})
export class AlcoholModule {}
