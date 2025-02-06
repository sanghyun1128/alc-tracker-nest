import { PickType } from '@nestjs/mapped-types';

import { UserModel } from '../entity/user.entity';

export class CreateUserDto extends PickType(UserModel, [
  'nickname',
  'email',
  'password',
  'birth',
  'gender',
] as const) {}
