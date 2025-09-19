import {
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryRunner as QueryRunnerType } from 'typeorm';

import { User } from './decorator/user.decorator';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './entity/user.entity';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get user private information include email, password...
   *
   * @User userId - The ID of the authenticated user.
   * @returns User private information.
   */
  @Get('/info/my')
  @UseGuards(AccessTokenGuard)
  getUserInfo(@User('id') userId: UserModel['id']) {
    return this.usersService.getUserInfo(userId);
  }

  /**
   * Update user private information include email, password...
   *
   * @User userId - The ID of the authenticated user.
   * @returns Updated user private information.
   */
  @Put('/info/my')
  @UseGuards(AccessTokenGuard)
  updateUserInfo(@User('id') userId: UserModel['id'], @Query() dto: UpdateUserDto) {
    return this.usersService.updateUserInfo(userId, dto);
  }

  /**
   * Delete user account.
   *
   * @User userId - The ID of the authenticated user.
   * @returns Result of deletion.
   */
  @Delete('/info/my')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async deleteUser(
    @User('id') userId: UserModel['id'],
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    return await this.usersService.deleteUser(userId, queryRunner);
  }

  /**
   * Get my profile information for showing to other users.
   *
   * @User userId - The ID of the authenticated user.
   * @returns User profile information.
   */
  @Get('/profile/my')
  @UseGuards(AccessTokenGuard)
  getMyProfile(@User('id') userId: UserModel['id']) {
    return this.usersService.getUserProfile(userId);
  }

  /**
   * Get user profile information for showing to other users.
   *
   * @Param userId - The ID of the user.
   * @returns User profile information.
   */
  @Get('/profile/:userId')
  @UseGuards(AccessTokenGuard)
  getUserProfile(@Param('userId') userId: UserModel['id']) {
    return this.usersService.getUserProfile(userId);
  }

  /**
   * Update my profile.
   *
   * @User userId - The ID of the authenticated user.
   * @Query dto - The updated user profile information.
   * @returns Updated user profile information.
   */
  @Put('/profile/my')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async putUserProfile(
    @User('id') userId: UserModel['id'],
    @Query() dto: UpdateUserProfileDto,
    @QueryRunner() queryRunner: QueryRunnerType,
  ) {
    return await this.usersService.updateUserProfile(userId, dto, queryRunner);
  }
}
