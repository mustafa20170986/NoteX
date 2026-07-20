// src/prisma/prisma.service.ts
import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private static pool: Pool;

  constructor() {
    // 1. Initialize the connection pool using your database environment variable
    if (!PrismaService.pool) {
      PrismaService.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
    }

    // 2. Instantiate the Prisma driver adapter layer
    const adapter = new PrismaPg(PrismaService.pool);

    // 3. Inject the configuration options into the underlying core PrismaClient engine
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await PrismaService.pool.end();
  }
}
