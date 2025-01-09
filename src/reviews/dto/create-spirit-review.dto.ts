import { IsNumber } from 'class-validator';

import { CreateBaseReviewDto } from './create-base-review.dto';

export class CreateSpiritReviewDto extends CreateBaseReviewDto {
  @IsNumber()
  spiritId: number;

  @IsNumber()
  bottleCondition: number;
}
