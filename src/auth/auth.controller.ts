import { Body, Controller, Headers, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';

import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { BasicTokenGuard } from './guard/basic-token.guard';

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
  postRegisterWithEmail(@Body() dto: RegisterUserDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.registerWithEmail(dto, res);
  }

  @Post('/token/access')
  postTokenAccess(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refreshToken;
    const newAccessToken = this.authService.rotateToken(refreshToken, false, res);

    return {
      accessToken: newAccessToken,
    };
  }

  @Post('/token/refresh')
  postTokenRefresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refreshToken;

    this.authService.rotateToken(refreshToken, true, res);
  }
}
