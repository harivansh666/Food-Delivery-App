import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/restaurant.create';
import { RestaurantService } from './restaurant.service';
import { AuthGuard } from '../guards/auth/auth.guard';
import { JwtPayload, UserRole } from '@food-delivery-app/types';
import { RolesGuard } from '../guards/auth/roles.guard';
import { Roles } from '../guards/auth/decorators/roles.decorators';
import UpdateRestaurantDto from './dto/update-restaurant.dto';

type AuthRequest = Request & { user: JwtPayload };

@Controller('restaurant')
@UseGuards(AuthGuard)
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}
  @Post('create')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async create(@Body() body: CreateRestaurantDto) {
    return await this.restaurantService.createRestaurant(body.ownerId, body);
  }
  @Get('mine')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async getMine(@Request() req: AuthRequest) {
    return await this.restaurantService.findMine(req.user.id);
  }
  async findById(id: string) {
    return await this.restaurantService.findById(id);
  }
  @Get('search')
  @UseGuards(AuthGuard)
  async findAll(@Query('search') search: string) {
    return await this.restaurantService.findAll(search);
  }

  @Patch()
  @UseGuards(RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async update(
    @Param('id') id: string,
    @Request() req: AuthRequest,
    @Body() dto: UpdateRestaurantDto,
  ) {
    return await this.restaurantService.updateRestaurant(id, req.user.id, dto);
  }
}
