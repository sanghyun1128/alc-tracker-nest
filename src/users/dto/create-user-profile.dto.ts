import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { Profile } from '../entity/user.entity';

export class CreateUserProfileDto {
  @ValidateNested()
  @Type(() => Profile)
  profile: Profile;
}
