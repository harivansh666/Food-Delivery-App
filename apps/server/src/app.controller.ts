import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from './db/schema/index.js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('DB') private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  @Get('test-db') // /api/health
  async getHello() {
    const result = await this.db.select().from(schema.user).execute();
    return { result: result, count: result.length };
  }
}
