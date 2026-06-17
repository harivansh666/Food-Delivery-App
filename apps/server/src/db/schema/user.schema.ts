import { boolean, timestamp } from 'drizzle-orm/pg-core';
import { text } from 'drizzle-orm/pg-core';
import { pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const UserRole = pgEnum('user_role', [
  'CUSTOMER',
  'RESTAURANT_OWNER',
  'DELIVERYMAN',
  'ADMIN',
]);

export const user = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  role: UserRole('role').default('CUSTOMER').notNull(),
  pushToken: text('push_Token'),
  isOnline: boolean('is_online').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof user.$inferSelect;
export type UserType = typeof user.$inferInsert;
