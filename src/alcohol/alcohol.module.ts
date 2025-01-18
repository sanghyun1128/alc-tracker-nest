import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlcoholController } from './alcohol.controller';
import { AlcoholService } from './alcohol.service';
import { AlcoholModel, SpiritModel, WineModel, CocktailModel } from './entities/alcohol.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { ImageModel } from 'src/common/entities/image.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlcoholModel, SpiritModel, WineModel, CocktailModel, ImageModel]),
    AuthModule,
    UsersModule,
    CommonModule,
  ],
  controllers: [AlcoholController],
  providers: [AlcoholService],
})
export class AlcoholModule {}
