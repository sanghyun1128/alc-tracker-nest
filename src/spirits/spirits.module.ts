import { Module } from '@nestjs/common';
import { SpiritsService } from './spirits.service';
import { SpiritsController } from './spirits.controller';

@Module({
  controllers: [SpiritsController],
  providers: [SpiritsService],
})
export class SpiritsModule {}
