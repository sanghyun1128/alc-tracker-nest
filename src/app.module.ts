import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlcoholModule } from './alcohol/alcohol.module';
import {
  SpiritModel,
  WineModel,
  CocktailModel,
} from './alcohol/entities/alcohol.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  BaseReviewModel,
  CocktailReviewModel,
  SpiritReviewModel,
  WineReviewModel,
} from './reviews/entities/review.entity';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ReviewsModule,
    AlcoholModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [
        BaseReviewModel,
        SpiritReviewModel,
        WineReviewModel,
        CocktailReviewModel,
        SpiritModel,
        WineModel,
        CocktailModel,
      ],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
