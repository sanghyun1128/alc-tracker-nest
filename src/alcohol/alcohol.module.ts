import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlcoholController } from './alcohol.controller';
import { AlcoholService } from './alcohol.service';
import { AlcoholModel, SpiritModel, WineModel, CocktailModel } from './entity/alcohol.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlcoholModel, SpiritModel, WineModel, CocktailModel]),
    AuthModule,
    UsersModule,
    CommonModule,
  ],
  controllers: [AlcoholController],
  providers: [AlcoholService],
  exports: [AlcoholService],
})
export class AlcoholModule {}
