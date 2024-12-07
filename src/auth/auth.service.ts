import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import {
  ENV_JWT_ACCESS_TOKEN_EXPIRATION,
  ENV_JWT_HASH_ROUNDS_KEY,
  ENV_JWT_REFRESH_TOKEN_EXPIRATION,
  ENV_JWT_SECRET_KEY,
} from 'src/common/const/env-keys.const';
import { UserModel } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Register a new user with email, password, nickname, birth date, and gender.
   *
   * @param user - An object containing the user's email, password, nickname, birth date, and gender.
   * @returns An object containing the access token and refresh token.
   * @throws BadRequestException if the email or nickname already exists.
   */
  async registerWithEmail(
    user: Pick<
      UserModel,
      'nickname' | 'email' | 'password' | 'birth' | 'gender'
    >,
  ) {
    const hashedPassword = await bcrypt.hash(
      user.password,
      +this.configService.get<string>(ENV_JWT_HASH_ROUNDS_KEY),
    );

    const newUser = await this.usersService.createUser({
      ...user,
      password: hashedPassword,
    });

    return this.loginUser(newUser);
  }

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
      secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      expiresIn: isRefreshToken
        ? +this.configService.get<string>(ENV_JWT_REFRESH_TOKEN_EXPIRATION)
        : +this.configService.get<string>(ENV_JWT_ACCESS_TOKEN_EXPIRATION),
    });
  }
}
