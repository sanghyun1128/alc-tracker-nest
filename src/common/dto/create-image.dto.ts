import { PickType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

import { stringValidationMessage } from '../validation-message';
import { ImageModel } from 'src/common/entity/image.entity';
export class CreateImageDto extends PickType(ImageModel, ['order', 'path'] as const) {
  @IsString({
    message: stringValidationMessage,
  })
  @IsOptional()
  reviewId?: string;

  @IsString({
    message: stringValidationMessage,
  })
  @IsOptional()
  alcoholId?: string;

  @IsString({
    message: stringValidationMessage,
  })
  @IsOptional()
  userId?: string;
}
