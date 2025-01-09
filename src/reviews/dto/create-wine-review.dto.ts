import { IsNumber } from 'class-validator';

import { CreateBaseReviewDto } from './create-base-review.dto';

export class CreateWineDto extends CreateBaseReviewDto {
  @IsNumber()
  wineId: number;

  @IsNumber()
  aeration: number;
}
