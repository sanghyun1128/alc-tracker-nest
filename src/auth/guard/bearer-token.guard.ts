import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { UnauthorizedErrorMessage } from 'src/common/error-message';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // rawToken : 'Basic base64(username:password)' or 'Bearer base64(token)'
    const rawToken = request.headers.authorization;

    if (!rawToken) {
      throw new UnauthorizedException(UnauthorizedErrorMessage.InvalidToken);
    }

    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const result = await this.authService.verifyToken(token);

    const user = await this.usersService.getUserByEmail(result.email);

    request.user = user;
    request.token = token;
    request.tokenType = result.type;

    return Promise.resolve(true);
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();

    if (request.tokenType !== 'access') {
      throw new UnauthorizedException(UnauthorizedErrorMessage.InvalidAccessToken);
    }

    return Promise.resolve(true);
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();

    if (request.tokenType !== 'refresh') {
      throw new UnauthorizedException(UnauthorizedErrorMessage.InvalidRefreshToken);
    }

    return Promise.resolve(true);
  }
}
