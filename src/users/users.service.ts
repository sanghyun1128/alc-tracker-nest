import { BadRequestException, Injectable } from '@nestjs/common';
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
    user: Pick<
      UserModel,
      'nickname' | 'email' | 'password' | 'birth' | 'gender'
    >,
  ) {
    const nicknameExists = await this.usersRepository.findOne({
      where: { nickname: user.nickname },
    });

    if (nicknameExists) {
      throw new BadRequestException('Nickname already exists');
    }

    const emailExists = await this.usersRepository.findOne({
      where: { email: user.email },
    });

    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }

    const newUser = this.usersRepository.create({
      nickname: user.nickname,
      email: user.email,
      password: user.password,
      birth: user.birth,
      gender: user.gender,
    });

    return this.usersRepository.save(newUser);
  }

  //FIXME: test code
  async getAllUsers() {
    return this.usersRepository.find();
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }
}
