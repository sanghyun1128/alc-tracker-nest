import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReviewsModule } from './reviews/reviews.module';
import { SpiritsModule } from './spirits/spirits.module';
import { WinesModule } from './wines/wines.module';
import { CocktailsModule } from './cocktails/cocktails.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ReviewsModule,
    SpiritsModule,
    WinesModule,
    CocktailsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
