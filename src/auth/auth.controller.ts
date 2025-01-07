import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
import { MaxStringLengthPipe, MinStringLengthPipe } from './pipe/length.pipe';
import { GenderEnum } from 'src/users/const/gender.const';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  postLoginWithEmail(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const decodedToken = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(decodedToken);
  }

  @Post('register/email')
  postRegisterWithEmail(
    @Body('email') email: string,
    @Body('password', new MinStringLengthPipe(8), new MaxStringLengthPipe(16))
    password: string,
    @Body('nickname', new MinStringLengthPipe(3), new MaxStringLengthPipe(10))
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
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, false);

    return {
      accessToken: newToken,
    };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, true);

    return {
      refreshToken: newToken,
    };
  }
}
