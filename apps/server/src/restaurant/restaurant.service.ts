import { Injectable } from '@nestjs/common';
import { RestaurantRepository } from './restaurant.repo';
import { CreateRestaurantDto } from './dto/restaurant.create';

@Injectable()
export class RestaurantService {
  constructor(readonly restaurantRepository: RestaurantRepository) {}
  async createRestaurant(ownerId: string, data: CreateRestaurantDto) {
    return await this.restaurantRepository.createRestaurant(ownerId, data);
  }
  async findMine(ownerId: string) {
    return await this.restaurantRepository.findMine(ownerId);
  }
  async findById(id: string) {
    return await this.restaurantRepository.findById(id);
  }
  async findAll(search: string) {
    return await this.restaurantRepository.findAll(search);
  }
  async updateRestaurant(id: string, ownerId: string, data: any) {
    return await this.restaurantRepository.updateRestaurant(id, ownerId, data);
  }
}
