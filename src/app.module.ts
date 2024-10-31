import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReviewsModule } from './reviews/reviews.module';
import { SpiritsModule } from './spirits/spirits.module';
import { WinesModule } from './wines/wines.module';
import { CocktailsModule } from './cocktails/cocktails.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import {
  BaseReviewModel,
  CocktailReviewModel,
  SpiritReviewModel,
  WineReviewModel,
} from './reviews/entities/review.entity';
import { SpiritModel } from './spirits/entities/spirit.entity';
import { WineModel } from './wines/entities/wine.entity';
import { CocktailModel } from './cocktails/entities/cocktail.entity';

@Module({
  imports: [
    ReviewsModule,
    SpiritsModule,
    WinesModule,
    CocktailsModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
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
