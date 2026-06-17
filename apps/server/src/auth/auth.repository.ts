import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthRepository {
  constructor(
    @Inject('DB') private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async createUser(data: RegisterDto) {
    const [newUser] = await this.db
      .insert(schema.user)
      .values({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        role: data.role,
      })
      .returning();
    return newUser;
  }
}
