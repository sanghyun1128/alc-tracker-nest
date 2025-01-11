import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //FIXME: test code
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('all')
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
