import { Controller } from '@nestjs/common';
import { AlcoholService } from './alcohol.service';

@Controller('alcohol')
export class AlcoholController {
  constructor(private readonly alcoholService: AlcoholService) {}
}
