import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './entity/user.entity';
import { ExistErrorMessage, NotFoundErrorMessage } from 'src/common/error-message';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly usersRepository: Repository<UserModel>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const nicknameExists = await this.usersRepository.findOne({
      where: { nickname: dto.nickname },
    });

    if (nicknameExists) {
      throw new BadRequestException(ExistErrorMessage('nickname'));
    }

    const emailExists = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    if (emailExists) {
      throw new BadRequestException(ExistErrorMessage('email'));
    }

    const newUser = this.usersRepository.create({
      ...dto,
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

  async getUserInfo(userId: UserModel['id']) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException(NotFoundErrorMessage('user'));
    }

    return user;
  }

  async updateUserInfo(userId: UserModel['id'], dto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException(NotFoundErrorMessage('user'));
    }

    const nicknameExists = await this.usersRepository.findOne({
      where: { nickname: dto.nickname },
    });

    if (nicknameExists) {
      throw new BadRequestException(ExistErrorMessage('nickname'));
    }

    const updatedUser = await this.usersRepository.save({
      ...user,
      ...dto,
    });

    return updatedUser;
  }

  //TODO: backup user data before deletion
  async deleteUser(userId: UserModel['id'], queryRunner: QueryRunner) {
    const repository = queryRunner.manager.getRepository(UserModel);

    const user = await repository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException(NotFoundErrorMessage('user'));
    }

    for (const review of user.reviews) {
      await repository.manager.remove(review);
    }

    for (const alcohol of user.alcohols) {
      await repository.manager.remove(alcohol);
    }

    await repository.manager.remove(user.profile.image);

    const result = await repository.delete({ id: userId });

    return result;
  }

  async getUserProfile(userId: UserModel['id']) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['profile', 'alcohols', 'reviews'],
    });

    if (!user) {
      throw new BadRequestException(NotFoundErrorMessage('user'));
    }

    return user;
  }
}
