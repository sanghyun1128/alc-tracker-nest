import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const User = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();

  const user = request.user;

  if (!user) {
    throw new InternalServerErrorException(
      'User decorator must use with AccessTokenGuard',
    );
  }

  return user;
});
