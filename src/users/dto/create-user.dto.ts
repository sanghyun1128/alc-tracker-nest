import { PickType } from '@nestjs/mapped-types';
import { IsOptional, IsString, Length } from 'class-validator';

import { UserModel } from '../entity/user.entity';
import { stringValidationMessage, lengthValidationMessage } from 'src/common/validation-message';

export class CreateUserDto extends PickType(UserModel, [
  'nickname',
  'email',
  'password',
  'birth',
  'gender',
] as const) {}
