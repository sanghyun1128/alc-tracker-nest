import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

import { DecoratorErrorMessage } from '../error-message';

/**
 * QueryRunner decorator is used to get the queryRunner from the request object.
 * - This decorator must be used with TransactionInterceptor.
 */
export const QueryRunner = createParamDecorator((data: undefined, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();

  const queryRunner = request.queryRunner;

  if (!queryRunner) {
    throw new InternalServerErrorException(
      DecoratorErrorMessage('QueryRunner', 'TransactionInterceptor'),
    );
  }

  return queryRunner;
});
