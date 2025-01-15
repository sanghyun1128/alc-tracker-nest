import { IsOptional, IsString } from 'class-validator';

import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';
import { stringValidationMessage } from 'src/common/validation-message';

export class PaginateAlcoholDto extends BasePaginationDto {
  @IsString({ message: stringValidationMessage })
  @IsOptional()
  where__name__i_like?: string;
}
