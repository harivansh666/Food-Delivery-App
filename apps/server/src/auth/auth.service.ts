import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { User } from '../db/schema';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async register(body: RegisterDto) {
    const existingUser = await this.userRepository.findUserByEmail(body.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = await this.authRepository.createUser({
      ...body,
      password: hashedPassword,
    });

    const payload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };

    return {
      user: this.sanitizeUser(newUser),
      token: this.generateToken(payload),
    };
  }
  async login(body: LoginDto) {
    const existingUser = await this.userRepository.findUserByEmail(body.email);
    if (!existingUser) {
      throw new UnauthorizedException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(
      body.password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = {
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
    };
    return {
      user: this.sanitizeUser(existingUser),
      token: this.generateToken(payload),
    };
  }
  async me(id: string) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: User) {
    const { password, ...safeUser } = user;
    void password;
    return safeUser;
  }
  private generateToken(payload: any) {
    return this.jwtService.sign(payload);
  }
}
