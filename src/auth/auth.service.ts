import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

import { RegisterUserDto } from './dto/register-user.dto';
import {
  ENV_JWT_ACCESS_TOKEN_EXPIRATION,
  ENV_JWT_HASH_ROUNDS_KEY,
  ENV_JWT_REFRESH_TOKEN_EXPIRATION,
  ENV_JWT_SECRET_KEY,
} from 'src/common/const/env-keys.const';
import { UnauthorizedErrorMessage } from 'src/common/error-message';
import { UserModel } from 'src/users/entity/user.entity';
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
  async registerWithEmail(user: RegisterUserDto) {
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
   * @param res - The response object to set the refresh token.
   * @returns An object containing the access token and refresh token.
   * @throws UnauthorizedException if the user does not exist or the password is incorrect.
   */
  async loginWithEmail(user: Pick<UserModel, 'email' | 'password'>, res: Response) {
    const existingUser = await this.authWithEmailAndPassword(user);
    const tokens = this.loginUser(existingUser);

    this.setHttpOnlyCookie(res, tokens.refreshToken);

    return { accessToken: tokens.accessToken };
  }

  async authWithEmailAndPassword(user: Pick<UserModel, 'email' | 'password'>) {
    const existingUser = await this.usersService.getUserByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException(UnauthorizedErrorMessage.EmailOrPasswordIsIncorrect);
    }

    const isPasswordMatched = await bcrypt.compare(user.password, existingUser.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException(UnauthorizedErrorMessage.EmailOrPasswordIsIncorrect);
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

  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splittedHeader = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (splittedHeader.length !== 2 || splittedHeader[0] !== prefix) {
      throw new UnauthorizedException(UnauthorizedErrorMessage.InvalidToken);
    }

    const token = splittedHeader[1];

    return token;
  }

  decodeBasicToken(base64StringToken: string) {
    const decodedToken = Buffer.from(base64StringToken, 'base64').toString('utf8');
    const splittedToken = decodedToken.split(':');

    if (splittedToken.length !== 2) {
      throw new UnauthorizedException(UnauthorizedErrorMessage.InvalidToken);
    }

    const [email, password] = splittedToken;

    return {
      email,
      password,
    };
  }

  /**
   * Generates a new access token using a valid refresh token.
   *
   * @param refreshToken - The refresh token used to generate a new access token.
   * @returns A new access token.
   * @throws UnauthorizedException if the provided token is not a valid refresh token.
   */
  rotateToken(token: string, isRefreshToken: boolean, res?: Response) {
    const decodedToken = this.verifyToken(token);

    if (decodedToken.type !== 'refresh') {
      throw new UnauthorizedException(UnauthorizedErrorMessage.InvalidToken);
    }

    if (isRefreshToken) {
      this.setHttpOnlyCookie(res, token);
    } else {
      return this.signToken(
        {
          email: decodedToken.email,
          id: decodedToken.sub,
        },
        isRefreshToken,
      );
    }
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      });
    } catch (error) {
      throw new UnauthorizedException(UnauthorizedErrorMessage.InvalidToken);
    }
  }

  setHttpOnlyCookie(res: Response, refreshToken: string) {
    //TODO: Set maxAge with login option
    //      - login option: 'keep me logged in' or 'session'
    //      - maxAge: 0 (session cookie)
    //      - maxAge: 7 days (keep me logged in)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: +this.configService.get<string>(ENV_JWT_REFRESH_TOKEN_EXPIRATION),
    });
  }
}
