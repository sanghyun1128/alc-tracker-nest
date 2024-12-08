import { Body, Controller, Headers, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { GenderEnum } from 'src/users/const/gender.const';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  postLoginWithEmail(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const decodedToken = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(decodedToken);
  }

  @Post('register/email')
  postRegisterWithEmail(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('nickname') nickname: string,
    @Body('birth') birth: Date,
    @Body('gender') gender: GenderEnum,
  ) {
    return this.authService.registerWithEmail({
      email,
      password,
      nickname,
      birth,
      gender,
    });
  }

  @Post('token/access')
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.refreshAccessToken(token);

    return {
      accessToken: newToken,
    };
  }
}
