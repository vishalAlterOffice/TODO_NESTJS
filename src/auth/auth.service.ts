import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import User from '../user/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from 'src/common/roles/roles.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ user: User }> {
    const { username, password, roles } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const isUserExists = await this.usersRepository.findOne({
      where: { user_name: username },
    });

    if (isUserExists) {
      throw new BadRequestException('Username already exists');
    }

    const role = await this.roleRepository.find({
      where: { role_name: In(roles) },
    });

    const user = await this.usersRepository.create({
      user_name: username,
      password: hashedPassword,
      roles: role,
    });

    await this.usersRepository.save(user);

    return { user };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { username, password } = loginDto;

    const user = await this.usersRepository.findOne({
      where: { user_name: username },
    });

    if (!user) {
      throw new UnauthorizedException('Username not exists');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Password not match');
    }

    const token = this.jwtService.sign({ id: user.id });

    return { token };
  }
}
