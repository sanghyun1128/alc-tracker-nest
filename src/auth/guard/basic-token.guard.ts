import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { UnauthorizedErrorMessage } from 'src/common/error-message';

@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // rawToken : 'Basic base64(username:password)' or 'Bearer base64(token)'
    const rawToken = request.headers.authorization;

    if (!rawToken) {
      throw new UnauthorizedException(UnauthorizedErrorMessage.InvalidToken);
    }

    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const { email, password } = this.authService.decodeBasicToken(token);

    const user = await this.authService.authWithEmailAndPassword({
      email,
      password,
    });

    request.user = user;

    return Promise.resolve(true);
  }
}
