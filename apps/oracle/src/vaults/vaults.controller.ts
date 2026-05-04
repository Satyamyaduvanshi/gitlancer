import { Controller, Post, Body, Inject, Logger, BadRequestException, Get, Param, Patch } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api') // 👈 This automatically prefixes all routes below with /api
export class VaultsController {
  private readonly logger = new Logger(VaultsController.name);

  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Post('vaults/register')
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

  @Get('vaults/user/:id') 
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

  @Get('bounties/user/:id') 
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


  @Patch('vaults/:id')
  async updateVault(@Param('id') id: string, @Body() body: { discordWebhookUrl?: string | null }) {
    try {
      return await this.prisma.client.vault.update({
        where: { id },
        data: { discordWebhookUrl: body.discordWebhookUrl },
      });
    } catch (error) {
      this.logger.error(`❌ Failed to update webhook for vault ${id}: ${error.message}`);
      throw new BadRequestException("Failed to update Discord webhook");
    }
  }

  // 🛡️ NEW: Catch the PATCH request from the frontend to update the claim status
  @Patch('bounties/:id')
  async updateBountyStatus(
    @Param('id') id: string, 
    @Body() body: { status: string }
  ) {
    try {
      // Update the contribution record in PostgreSQL
      const updatedBounty = await this.prisma.client.contribution.update({
        where: { id },
        // Prisma expects the exact Enum value (e.g., 'CLAIMED')
        data: { status: body.status as any }, 
      });

      this.logger.log(`✅ Bounty ${id} status updated to ${body.status}`);
      return updatedBounty;

    } catch (error) {
      this.logger.error(`❌ Failed to update bounty ${id}: ${error.message}`);
      // If it fails, throw a clean error back to the frontend
      throw new BadRequestException("Failed to update bounty status in the database.");
    }
  }
}