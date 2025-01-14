import { IsEnum, IsNumber, IsOptional } from 'class-validator';

import { OrderEnum } from '../const/pagination.const';
import { enumValidationMessage, numberValidationMessage } from 'src/common/validation-message';

export class BasePaginationDto {
  @IsNumber({}, { message: numberValidationMessage })
  @IsOptional()
  page?: number;

  @IsNumber({}, { message: numberValidationMessage })
  @IsOptional()
  where__index__more_than?: number;

  @IsNumber({}, { message: numberValidationMessage })
  @IsOptional()
  where__index__less_than?: number;

  @IsEnum(OrderEnum, {
    message: enumValidationMessage,
  })
  @IsOptional()
  order__createdAt?: OrderEnum = OrderEnum.ASC;

  @IsNumber({}, { message: numberValidationMessage })
  @IsOptional()
  take: number = 10;
}
