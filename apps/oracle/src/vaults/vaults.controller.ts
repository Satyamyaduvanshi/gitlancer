import { Controller, Post, Body, Inject, Logger, BadRequestException, Get, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api') // 👈 CHANGE 1: We removed '/vaults' from here
export class VaultsController {
  private readonly logger = new Logger(VaultsController.name);

  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Post('vaults/register') // 👈 CHANGE 2: Added 'vaults/' here
  async registerVault(@Body() body: {
    repoFullName: string;
    pdaAddress: string;
    maintainerId: string;
    githubHandle: string;
    avatarUrl: string;
    vaultBump: number;
  }) {
    const { repoFullName, pdaAddress, maintainerId, githubHandle, avatarUrl, vaultBump } = body;

    try {
      const user = await this.prisma.client.user.upsert({
        where: { id: maintainerId },
        update: { githubHandle, avatarUrl },
        create: {
          id: maintainerId,
          githubHandle: githubHandle,
          avatarUrl: avatarUrl,
        },
      });

      const vault = await this.prisma.client.vault.upsert({
        where: { repositoryFullName: repoFullName },
        update: {
          pdaAddress: pdaAddress,
          vaultBump: vaultBump,
          maintainerId: user.id
        },
        create: {
          repositoryFullName: repoFullName,
          pdaAddress: pdaAddress,
          vaultBump: vaultBump,
          budgetLimit: 100.0,
          maintainerId: user.id
        }
      });

      this.logger.log(`✅ Vault synchronized for ${repoFullName} by @${githubHandle}`);
      return vault;

    } catch (error) {
      this.logger.error(`❌ Registration failed: ${error.message}`);
      throw new BadRequestException(
        error.code === 'P2002' 
          ? "This repository or PDA is already registered." 
          : "Database synchronization failed."
      );
    }
  }

  @Get('vaults/user/:id') // 👈 CHANGE 3: Added 'vaults/' here
  async getUserVaults(@Param('id') userId: string) {
    try {
      return await this.prisma.client.vault.findMany({
        where: { maintainerId: userId },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      throw new BadRequestException("Failed to fetch vaults");
    }
  }

  @Get('bounties/user/:id') // 👈 Now this matches the frontend perfectly!
  async getUserBounties(@Param('id') userId: string) {
    try {
      return await this.prisma.client.contribution.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      throw new BadRequestException("Failed to fetch bounties");
    }
  }
}