import { PickType } from '@nestjs/mapped-types';

import { UserModel } from 'src/users/entity/user.entity';

export class RegisterUserDto extends PickType(UserModel, ['email', 'password', 'nickname', 'birth', 'gender']) {}
