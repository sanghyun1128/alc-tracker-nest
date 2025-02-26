import { Body, Controller, Headers, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { RefreshTokenGuard } from './guard/bearer-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login/email')
  @UseGuards(BasicTokenGuard)
  postLoginWithEmail(
    @Headers('authorization') rawToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const decodedToken = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(decodedToken, res);
  }

  @Post('/register/email')
  postRegisterWithEmail(@Body() dto: RegisterUserDto) {
    return this.authService.registerWithEmail(dto);
  }

  @Post('/token/access')
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, false);

    return {
      accessToken: newToken,
    };
  }

  @Post('/token/refresh')
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(
    @Headers('authorization') rawToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    this.authService.rotateToken(token, true, res);
  }
}
