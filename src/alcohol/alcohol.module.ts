import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlcoholController } from './alcohol.controller';
import { AlcoholService } from './alcohol.service';
import { CocktailModel, SpiritModel, WineModel } from './entities/alcohol.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([SpiritModel, WineModel, CocktailModel]), AuthModule, UsersModule, CommonModule],
  controllers: [AlcoholController],
  providers: [AlcoholService],
})
export class AlcoholModule {}
