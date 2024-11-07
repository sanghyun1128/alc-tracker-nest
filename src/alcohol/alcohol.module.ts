import { Module } from '@nestjs/common';

import { AlcoholController } from './alcohol.controller';
import { AlcoholService } from './alcohol.service';

@Module({
  controllers: [AlcoholController],
  providers: [AlcoholService],
})
export class AlcoholModule {}
