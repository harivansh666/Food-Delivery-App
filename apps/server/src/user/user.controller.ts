import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth/auth.guard';
import { RolesGuard } from '../guards/auth/roles.guard';
import { Roles } from '../guards/auth/decorators/roles.decorators';

@Controller('user')
export class UserController {
  @Get('admin-profile')
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  getAdminProfile() {
    return { message: 'This is a protected admin profile' };
  }
}
