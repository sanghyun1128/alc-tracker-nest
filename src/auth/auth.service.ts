import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { RegisterUserDto } from './dto/register-user.dto';
import {
  ENV_JWT_ACCESS_TOKEN_EXPIRATION,
  ENV_JWT_HASH_ROUNDS_KEY,
  ENV_JWT_REFRESH_TOKEN_EXPIRATION,
  ENV_JWT_SECRET_KEY,
} from 'src/common/const/env-keys.const';
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

    const isPasswordMatched = await bcrypt.compare(user.password, existingUser.password);

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

  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splittedHeader = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (splittedHeader.length !== 2 || splittedHeader[0] !== prefix) {
      throw new UnauthorizedException('Invalid token');
    }

    const token = splittedHeader[1];

    return token;
  }

  decodeBasicToken(base64StringToken: string) {
    const decodedToken = Buffer.from(base64StringToken, 'base64').toString('utf8');
    const splittedToken = decodedToken.split(':');

    if (splittedToken.length !== 2) {
      throw new UnauthorizedException('Invalid token');
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
  rotateToken(token: string, isRefreshToken: boolean) {
    const decodedToken = this.verifyToken(token);

    if (decodedToken.type !== 'refresh') {
      throw new UnauthorizedException('Refresh token needed');
    }

    return this.signToken(
      {
        email: decodedToken.email,
        id: decodedToken.sub,
      },
      isRefreshToken,
    );
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      });
    } catch (error) {
      throw new UnauthorizedException('Expired or invalid token');
    }
  }
}
