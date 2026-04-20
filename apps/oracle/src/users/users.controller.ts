import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/users')
export class UsersController {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Post('link')
  async linkWallet(
    @Body() body: { githubHandle: string; walletAddress: string },
  ) {
    if (!body.githubHandle) {
      throw new BadRequestException('githubHandle is required');
    }

    return await this.prisma.client.user.upsert({
      where: { githubHandle: body.githubHandle },
      update: { solanaWallet: body.walletAddress },
      create: {
        githubHandle: body.githubHandle,
        solanaWallet: body.walletAddress,
      },
    });
  }

  
}


