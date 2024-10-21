import { Controller } from '@nestjs/common';
import { WinesService } from './wines.service';

@Controller('wines')
export class WinesController {
  constructor(private readonly winesService: WinesService) {}
}
