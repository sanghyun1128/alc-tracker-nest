import { IsEnum, IsNumber, IsOptional } from 'class-validator';

import { OrderEnum } from '../const/pagination.const';
import { enumValidationMessage, numberValidationMessage } from 'src/common/validation-message';

export class PaginateAlcoholDto {
  @IsNumber({}, { message: numberValidationMessage })
  @IsOptional()
  where__cursor?: number;

  @IsEnum(OrderEnum, {
    message: enumValidationMessage,
  })
  @IsOptional()
  order__createdAt?: OrderEnum = OrderEnum.ASC;

  @IsNumber({}, { message: numberValidationMessage })
  @IsOptional()
  take: number = 10;
}
