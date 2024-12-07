import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { GenderEnum } from 'src/users/const/gender.const';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  loginWithEmail(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.loginWithEmail({ email, password });
  }

  @Post('register/email')
  registerWithEmail(
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
}
