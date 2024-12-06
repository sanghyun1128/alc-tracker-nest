import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserModel } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  /**
   * TODO: register with email
   *  - email, pw, nickname...
   * TODO: login with email
   * TODO: loginUser
   * TODO: signToken
   * TODO: auth with email and pw
   */

  /**
   * Payload
   * 1) email
   * 2) sub -> id
   * 3) type : 'access' | 'refresh'
   */
  signToken(user: Pick<UserModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: isRefreshToken
        ? process.env.JWT_REFRESH_TOKEN_EXPIRATION
        : process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    });
  }
}
