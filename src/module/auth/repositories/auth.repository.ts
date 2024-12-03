import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRepository } from 'src/shared/repositories/crud.repository';
import User from 'src/module/user/entities/user.entity';

@Injectable()
class AuthRepository extends CrudRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  // Custom method to find a user by username
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { user_name: username } });
  }

  // Custom method to create a user
  async createUser(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }
}

export default AuthRepository;
