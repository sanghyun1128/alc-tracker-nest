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
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //FIXME: test code
  @Get('all')
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  /**
   * Get user private information include email, password...
   *
   * @User userId - The ID of the authenticated user.
   * @returns User private information.
   */
  @Get('/my')
  @UseGuards(AccessTokenGuard)
  getUserInfo(@User('id') userId: string) {
    return this.usersService.getUserInfo(userId);
  }

  /**
   * Update user private information include email, password...
   *
   * @User userId - The ID of the authenticated user.
   * @returns Updated user private information.
   */
  @Put('/my')
  @UseGuards(AccessTokenGuard)
  updateUserInfo(@User('id') userId: string, @Query() dto: UpdateUserDto) {
    return this.usersService.updateUserInfo(userId, dto);
  }

  /**
   * Delete user account.
   *
   * @User userId - The ID of the authenticated user.
   * @returns Result of deletion.
   */
  @Delete('/my')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async deleteUser(@User('id') userId: string, @QueryRunner() queryRunner: QueryRunnerType) {
    return await this.usersService.deleteUser(userId, queryRunner);
  }

  /**
   * Get user profile information for showing to other users.
   *
   * @Param userId - The ID of the user.
   * @returns User profile information.
   */
  @Get('/:userId')
  @UseGuards(AccessTokenGuard)
  getUserProfile(@Param('userId') userId: string) {
    return this.usersService.getUserProfile(userId);
  }
}
