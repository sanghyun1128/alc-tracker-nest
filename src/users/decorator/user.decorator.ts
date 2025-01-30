import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

import { UserModel } from '../entity/user.entity';
import { DecoratorErrorMessage } from 'src/common/error-message';

/**
 * User decorator is used to get user information from the request object.
 * - This decorator must be used with AccessTokenGuard.
 */
export const User = createParamDecorator(
  (data: keyof UserModel | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const user = request.user as UserModel;

    if (!user) {
      throw new InternalServerErrorException(DecoratorErrorMessage('User', 'AccessTokenGuard'));
    }

    if (data) {
      return user[data];
    }

    return user;
  },
);
