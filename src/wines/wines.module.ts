import { Module } from '@nestjs/common';
import { WinesService } from './wines.service';
import { WinesController } from './wines.controller';

@Module({
  controllers: [WinesController],
  providers: [WinesService],
})
export class WinesModule {}
