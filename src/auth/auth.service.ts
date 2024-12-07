import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserModel } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
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

  loginUser(user: Pick<UserModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  async authWithEmailAndPassword(user: Pick<UserModel, 'email' | 'password'>) {
    const existingUser = await this.usersService.getUserByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException('Not existing user');
    }

    const isPasswordMatched = await bcrypt.compare(
      user.password,
      existingUser.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Password is not matched');
    }

    return existingUser;
  }
}
