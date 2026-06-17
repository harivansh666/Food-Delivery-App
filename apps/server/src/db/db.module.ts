import { drizzle } from 'drizzle-orm/node-postgres';
import { Global, Module } from '@nestjs/common';
import * as schema from './schema/index.js';

@Global()
@Module({
  providers: [
    {
      provide: 'DB', // Ek provider banao jiska naam "DB" hai. ye token hai mtlb name = 'DB'
      useFactory: () => {
        const db = drizzle(process.env.DATABASE_URL!, { schema });
        return db;
      },
    },
  ],
  exports: ['DB'],
})
export class DbModule {}
