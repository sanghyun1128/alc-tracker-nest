import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserModel } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly usersRepository: Repository<UserModel>,
  ) {}

  async createUser(
    nickname: string,
    email: string,
    password: string,
    birth: Date,
  ) {
    const user = this.usersRepository.create({
      nickname,
      email,
      password,
      birth,
    });

    return this.usersRepository.save(user);
  }

  //FIXME: test code
  async getAllUsers() {
    return this.usersRepository.find();
  }
}
