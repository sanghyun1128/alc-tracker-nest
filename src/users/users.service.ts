import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserModel } from './entity/user.entity';
import { ExistErrorMessage } from 'src/common/error-message';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly usersRepository: Repository<UserModel>,
  ) {}

  async createUser(user: Pick<UserModel, 'nickname' | 'email' | 'password' | 'birth' | 'gender'>) {
    const nicknameExists = await this.usersRepository.findOne({
      where: { nickname: user.nickname },
    });

    if (nicknameExists) {
      throw new BadRequestException(ExistErrorMessage('nickname'));
    }

    const emailExists = await this.usersRepository.findOne({
      where: { email: user.email },
    });

    if (emailExists) {
      throw new BadRequestException(ExistErrorMessage('email'));
    }

    const newUser = this.usersRepository.create({
      nickname: user.nickname,
      email: user.email,
      password: user.password,
      birth: user.birth,
      gender: user.gender,
    });

    return await this.usersRepository.save(newUser);
  }

  //FIXME: test code
  async getAllUsers() {
    return await this.usersRepository.find();
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }
}
