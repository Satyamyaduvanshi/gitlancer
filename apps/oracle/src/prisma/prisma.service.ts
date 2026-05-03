import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { getPrisma, PrismaClient } from '@gitlancer/db';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {

  public readonly client: PrismaClient = getPrisma();

  async onModuleInit() {
    await this.client.$connect();
    console.log(' Oracle connected to Neon Database');
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}