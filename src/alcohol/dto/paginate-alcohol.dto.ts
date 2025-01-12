import { IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';

import { OrderEnum } from '../const/pagination.const';
import {
  dateValidationMessage,
  enumValidationMessage,
  numberValidationMessage,
} from 'src/common/validation-message';

export class PaginateAlcoholDto {
  @IsDate({ message: dateValidationMessage })
  @IsOptional()
  where__createdAt_more_than?: Date;

  @IsEnum(OrderEnum, {
    message: enumValidationMessage,
  })
  @IsOptional()
  order__createdAt?: OrderEnum = OrderEnum.ASC;

  @IsNumber({}, { message: numberValidationMessage })
  @IsOptional()
  take: number = 10;
}
