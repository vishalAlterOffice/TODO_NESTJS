import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './user.entity';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAllUsers() {
    return this.usersRepository.find({ relations: ['roles'] });
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (user) {
      return user;
    }
    throw new NotFoundException('Could not find the user');
  }

  async deleteById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      return null;
    }
    await this.usersRepository.remove(user);
    return user;
  }
}
