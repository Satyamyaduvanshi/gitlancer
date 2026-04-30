import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Make sure this path is correct!

@Injectable()
export class BountiesService {
  private readonly logger = new Logger(BountiesService.name);

  // ⚡ THE FIX: Using your @Inject pattern so Prisma is actually loaded!
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  async getBountiesByUserId(userId: string) {
    if (!userId) {
      throw new NotFoundException('User ID is required');
    }

    try {
      this.logger.log(`Fetching bounties for User ID: ${userId}`);

      // Now this.prisma will be fully defined, and .client will work perfectly!
      const bounties = await this.prisma.client.contribution.findMany({
        where: {
          userId: userId,
        },
        include: {
          user: true,   // Grabs githubHandle, avatarUrl
          vault: true,  // Grabs repositoryFullName
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      this.logger.log(`Found ${bounties.length} bounties for user.`);
      return bounties;

    } catch (error) {
      this.logger.error(`Error fetching bounties: ${error.message}`, error.stack);
      throw error;
    }
  }
}