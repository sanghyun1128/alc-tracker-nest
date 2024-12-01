import { Body, Controller, Get, Post } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  postUser(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('nickname') nickname: string,
    @Body('birth') birth: Date,
  ) {
    return this.usersService.createUser(nickname, email, password, birth);
  }

  //FIXME: test code
  @Get('all')
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
