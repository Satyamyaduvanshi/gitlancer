import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
  Logger,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Controller('api/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Post('link')
  async linkWallet(
    @Headers('authorization') authHeader: string, 
    @Body() body: { 
      githubId: string;      
      githubHandle: string; 
      walletAddress: string;
      avatarUrl?: string;   
    },
  ) {
    if (!authHeader) throw new UnauthorizedException('Security token is missing');
    if (!body.githubId || !body.walletAddress) throw new BadRequestException('Required fields missing');

    try {
   
      const githubResponse = await axios.get('https://api.github.com/user', {
        headers: { Authorization: authHeader },
      });

     
      if (githubResponse.data.id.toString() !== body.githubId) {
        throw new UnauthorizedException('Identity Mismatch: You cannot link a wallet to someone else\'s account.');
      }

     
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

      this.logger.log(`🔗 Verified & Linked: @${body.githubHandle} -> ${body.walletAddress.slice(0, 8)}...`);
      return { success: true, wallet: user.solanaWallet };

    } catch (error) {
      this.logger.error(`❌ Security/Linking Error: ${error.message}`);
      throw new BadRequestException(error.response?.data?.message || 'Identity verification failed.');
    }
  }
}