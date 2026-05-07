import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { getPrisma } from '@gitlancer/db';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {

  public readonly client: ReturnType<typeof getPrisma> = getPrisma();

  async onModuleInit() {
    await this.client.$connect();
    console.log(' Oracle connected to Neon Database');
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}