import { Body, Controller, Headers, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { MaxLengthPipe, MinLengthPipe } from './pipe/length.pipe';
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
    @Body('password', new MinLengthPipe(8), new MaxLengthPipe(16))
    password: string,
    @Body('nickname', new MinLengthPipe(3), new MaxLengthPipe(10))
    nickname: string,
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
