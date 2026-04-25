import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Post('link')
  async linkWallet(
    @Body() body: { 
      githubId: string;      
      githubHandle: string; 
      walletAddress: string;
      avatarUrl?: string;   
    },
  ) {
    // 1. Validation
    if (!body.githubId || !body.walletAddress) {
      throw new BadRequestException('githubId and walletAddress are required');
    }

    // Basic Solana address length check (32-44 chars)
    if (body.walletAddress.length < 32 || body.walletAddress.length > 44) {
      throw new BadRequestException('Invalid Solana wallet address format');
    }

    try {
      // 2. Upsert: Create user if they don't exist, update wallet if they do
      const user = await this.prisma.client.user.upsert({
        where: { id: body.githubId },
        update: { 
          solanaWallet: body.walletAddress,
          githubHandle: body.githubHandle, 
          avatarUrl: body.avatarUrl || ''
        },
        create: {
          id: body.githubId,           
          githubHandle: body.githubHandle,
          solanaWallet: body.walletAddress,
          avatarUrl: body.avatarUrl || '',
        },
      });

      this.logger.log(`🔗 Identity Linked: @${body.githubHandle} -> ${body.walletAddress.slice(0, 4)}...${body.walletAddress.slice(-4)}`);
      
      return {
        success: true,
        userId: user.id,
        wallet: user.solanaWallet
      };

    } catch (error) {
      this.logger.error(`❌ Failed to link wallet: ${error.message}`);
      throw new BadRequestException('Database error occurred during identity linking.');
    }
  }
}