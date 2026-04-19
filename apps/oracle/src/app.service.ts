import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHello() {
    try {
      // Test the connection by counting users (should be 0 for now)
      const userCount = await this.prisma.client.user.count();
      return {
        status: 'Oracle Online',
        database: 'Connected to Neon',
        registeredUsers: userCount,
      };
    } catch (error) {
      return {
        status: 'Oracle Error',
        database: 'Connection Failed',
        details: error.message,
      };
    }
  }
}