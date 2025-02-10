import { IntersectionType, PickType } from '@nestjs/mapped-types';

import { CreateSpiritReviewDto } from './create-spirit-review.dto';
import { UpdateReviewDto } from './update-review.dto';

export class UpdateSpiritReviewDto extends IntersectionType(
  UpdateReviewDto,
  PickType(CreateSpiritReviewDto, [
    'rating',
    'comment',
    'pairing',
    'nose',
    'palate',
    'finish',
    'bottleCondition',
    'images',
  ] as const),
) {}
