import { IntersectionType, PickType } from '@nestjs/mapped-types';

import { CreateReviewDto } from './create-review.dto';
import { SpiritReviewModel } from '../entity/review.entity';

export class CreateSpiritReviewDto extends IntersectionType(
  CreateReviewDto,
  PickType(SpiritReviewModel, [
    'rating',
    'comment',
    'pairing',
    'nose',
    'palate',
    'finish',
    'bottleCondition',
  ] as const),
) {}
