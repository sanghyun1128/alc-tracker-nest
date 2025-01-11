import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
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
import { CommonModule } from './common/common.module';
import {
  ENV_DB_HOST_KEY,
  ENV_DB_NAME_KEY,
  ENV_DB_PASSWORD_KEY,
  ENV_DB_PORT_KEY,
  ENV_DB_TYPE_KEY,
  ENV_DB_USERNAME_KEY,
} from './common/const/env-keys.const';
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
      type: process.env[ENV_DB_TYPE_KEY] as any,
      host: process.env[ENV_DB_HOST_KEY],
      port: +process.env[ENV_DB_PORT_KEY],
      username: process.env[ENV_DB_USERNAME_KEY],
      password: process.env[ENV_DB_PASSWORD_KEY],
      database: process.env[ENV_DB_NAME_KEY],
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
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
