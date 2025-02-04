import { PickType } from '@nestjs/mapped-types';

import { UserModel } from '../entity/user.entity';

export class CreateUserProfileDto extends PickType(UserModel, ['profile'] as const) {}
