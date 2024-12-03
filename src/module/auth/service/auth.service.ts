import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/shared/entities/roles.entity';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import User from 'src/module/user/entities/user.entity';
import { UsersService } from 'src/module/user/service/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ user: Partial<User> }> {
    const { username, password, roles } = signUpDto;

    // Check if the username already exists
    if (await this.userService.findByUserName(username)) {
      throw new BadRequestException('Username already exists');
    }

    // Fetch roles from the database
    const roleEntities = await this.roleRepository.find({
      where: { role_name: In(roles) },
    });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await this.userService.createUser({
      user_name: username,
      password: hashedPassword,
      roles: roleEntities,
    });

    // Exclude the password from the response
    const { password: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { username, password } = loginDto;

    // Find the user by username
    const user = await this.userService.findByUserName(username);

    // Validate credentials
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate a JWT token
    const token = this.jwtService.sign({ id: user.id });
    return { token };
  }
}
