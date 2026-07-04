import * as schema from '../db/schema';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq, ilike, and, or } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateRestaurantDto } from './dto/restaurant.create';

@Injectable()
export class RestaurantRepository {
  constructor(
    @Inject('DB') private readonly db: NodePgDatabase<typeof schema>,
  ) {}
  async createRestaurant(ownerId: string, data: CreateRestaurantDto) {
    const existing = await this.db
      .select()
      .from(schema.restaurants)
      .where(eq(schema.restaurants.ownerId, ownerId))
      .limit(1);

    if (existing.length > 0) {
      throw new ForbiddenException('You already have a restaurant');
    }

    return await this.db
      .insert(schema.restaurants)
      .values({
        name: data.name,
        description: data.description,
        address: data.address,
        phone: data.phone,
        email: data.email,
        logo: data.imageUrl,
        cuisineType: data.cuisineType,
        ownerId: ownerId,
        coverImage: data.imageUrl,
      })
      .returning();
  }

  async findMine(ownerId: string) {
    return await this.db
      .select()
      .from(schema.restaurants)
      .where(eq(schema.restaurants.ownerId, ownerId))
      .limit(1);
  }
  async findById(id: string) {
    const [restaurant] = await this.db
      .select()
      .from(schema.restaurants)
      .where(eq(schema.restaurants.id, id))
      .limit(1);

    if (!restaurant) throw new NotFoundException('No restaurant found');
    return restaurant;
  }
  async findAll(search: string) {
    return await this.db
      .select()
      .from(schema.restaurants)
      .where(
        and(
          eq(schema.restaurants.isOpen, true),
          or(
            ilike(schema.restaurants.name, `%${search}%`),
            ilike(schema.restaurants.cuisineType, `%${search}%`),
          ),
        ),
      );
  }
  async updateRestaurant(id: string, ownerId: string, data: any) {
    return await this.db
      .update(schema.restaurants)
      .set(data)
      .where(
        and(
          eq(schema.restaurants.id, id),
          eq(schema.restaurants.ownerId, ownerId),
        ),
      )
      .returning();
  }
}
