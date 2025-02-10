import { IntersectionType, PickType } from '@nestjs/mapped-types';

import { CreateWineReviewDto } from './create-wine-review.dto';
import { UpdateReviewDto } from './update-review.dto';

export class UpdateWineReviewDto extends IntersectionType(
  UpdateReviewDto,
  PickType(CreateWineReviewDto, [
    'rating',
    'comment',
    'pairing',
    'nose',
    'palate',
    'finish',
    'aeration',
    'images',
  ] as const),
) {}
