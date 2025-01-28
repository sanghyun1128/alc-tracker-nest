import { PickType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

import { ImageModel } from 'src/common/entity/image.entity';

export class CreateImageDto extends PickType(ImageModel, ['order', 'path', 'type'] as const) {
  @IsOptional()
  @IsString()
  reviewId?: string;

  @IsOptional()
  @IsString()
  alcoholId?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
