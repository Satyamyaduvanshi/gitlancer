import { Controller, Post, Body, Inject, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/vaults')
export class VaultsController {
  private readonly logger = new Logger(VaultsController.name);

  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Post('register')
  async registerVault(@Body() body: {
    repoFullName: string;
    pdaAddress: string;
    maintainerId: string;
    githubHandle: string; // 👈 Added
    avatarUrl: string;    // 👈 Added
    vaultBump: number;
  }) {
    const { repoFullName, pdaAddress, maintainerId, githubHandle, avatarUrl, vaultBump } = body;

    try {
      // 1. 🛡️ User Sync: Ensure the maintainer exists in the DB
      // We use upsert so we don't need a separate "Link Wallet" step first
      const user = await this.prisma.client.user.upsert({
        where: { id: maintainerId },
        update: { githubHandle, avatarUrl },
        create: {
          id: maintainerId,
          githubHandle: githubHandle,
          avatarUrl: avatarUrl,
        },
      });

      // 2. 🏦 Vault Creation
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
}