import { IntersectionType, PickType } from '@nestjs/mapped-types';

import { CreateReviewDto } from './create-review.dto';
import { WineReviewModel } from '../entity/review.entity';

export class CreateWineReviewDto extends IntersectionType(
  CreateReviewDto,
  PickType(WineReviewModel, [
    'rating',
    'comment',
    'pairing',
    'nose',
    'palate',
    'finish',
    'aeration',
  ] as const),
) {}
