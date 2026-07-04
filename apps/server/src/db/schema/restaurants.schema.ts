import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { user } from './user.schema';

export const RatingEnum = pgEnum('rating_enum', ['1', '2', '3', '4', '5']);

export const restaurants = pgTable('restaurants', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => user.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  address: text('address').notNull(),
  phone: varchar('phone', { length: 15 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  logo: text('logo'),
  coverImage: text('cover_image'),
  rating: RatingEnum('rating').default('1').notNull(),
  cuisineType: varchar('cuisine_type', { length: 255 }).notNull(),
  isOpen: boolean('is_open').default(false).notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  isOnline: boolean('is_online').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type RestaurantType = typeof restaurants.$inferInsert;
export type NewRestaurantType = typeof restaurants.$inferInsert;
