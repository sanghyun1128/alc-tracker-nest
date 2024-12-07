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
   * Login a user with email and password.
   *
   * @param user - An object containing the user's email and password.
   * @returns An object containing the access token and refresh token.
   * @throws UnauthorizedException if the user does not exist or the password is incorrect.
   */
  async loginWithEmail(user: Pick<UserModel, 'email' | 'password'>) {
    const existingUser = await this.authWithEmailAndPassword(user);

    return this.loginUser(existingUser);
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

  loginUser(user: Pick<UserModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

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
