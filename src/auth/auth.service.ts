import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import User from '../user/user.entity';
import { Role } from '../common/roles/roles.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ user: Partial<User> }> {
    const { username, password, roles } = signUpDto;

    if (
      await this.usersRepository.findOne({ where: { user_name: username } })
    ) {
      throw new BadRequestException('Username already exists');
    }

    const roleEntities = await this.roleRepository.find({
      where: { role_name: In(roles) },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      user_name: username,
      password: hashedPassword,
      roles: roleEntities,
    });

    const savedUser = await this.usersRepository.save(newUser);

    const { password: _, ...userWithoutPassword } = savedUser;
    return { user: userWithoutPassword };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { username, password } = loginDto;

    const user = await this.usersRepository.findOne({
      where: { user_name: username },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: user.id });
    return { token };
  }
}
