import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse, JwtPayload, User } from '@food-delivery-app/types';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '../guards/auth/auth.guard';
import { Roles } from '../guards/auth/decorators/roles.decorators';
import { RolesGuard } from '../guards/auth/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto): Promise<AuthResponse> {
    return await this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto): Promise<AuthResponse> {
    return await this.authService.login(body);
  }

  @Get('me')
  @Roles('CUSTOMER')
  @UseGuards(AuthGuard, RolesGuard)
  async me(
    @Request() req: ExpressRequest & { user: JwtPayload },
  ): Promise<Omit<User, 'password'>> {
    const userId = req.user.id;

    if (!userId) {
      throw new UnauthorizedException('User not found');
    }
    return await this.authService.me(userId);
  }
}
