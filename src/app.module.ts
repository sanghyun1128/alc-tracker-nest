import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlcoholModule } from './alcohol/alcohol.module';
import {
  SpiritModel,
  WineModel,
  CocktailModel,
  AlcoholModel,
} from './alcohol/entities/alcohol.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import {
  BaseReviewModel,
  CocktailReviewModel,
  SpiritReviewModel,
  WineReviewModel,
} from './reviews/entities/review.entity';
import { ReviewsModule } from './reviews/reviews.module';
import { UserModel } from './users/entities/user.entity';
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
        AlcoholModel,
        SpiritModel,
        WineModel,
        CocktailModel,
        UserModel,
      ],
      synchronize: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
