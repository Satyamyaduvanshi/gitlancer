import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { getPrisma, PrismaClient } from '@gitlancer/db';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // Initialize the client via the lazy getter
  public readonly client: PrismaClient = getPrisma();

  async onModuleInit() {
    // This will now correctly see the environment variables loaded in main.ts
    await this.client.$connect();
    console.log('📡 Oracle connected to Neon Database');
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}