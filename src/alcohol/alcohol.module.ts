import { Module } from '@nestjs/common';
import { AlcoholService } from './alcohol.service';
import { AlcoholController } from './alcohol.controller';

@Module({
  controllers: [AlcoholController],
  providers: [AlcoholService],
})
export class AlcoholModule {}
