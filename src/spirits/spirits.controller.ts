import { Controller } from '@nestjs/common';
import { SpiritsService } from './spirits.service';

@Controller('spirits')
export class SpiritsController {
  constructor(private readonly spiritsService: SpiritsService) {}
}
