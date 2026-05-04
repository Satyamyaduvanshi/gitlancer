import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { SolanaService } from '../solana/solana.service';
import { PublicKey } from '@solana/web3.js';
import axios from 'axios';

@Injectable()
export class LiquidityAlertService {
  private readonly logger = new Logger(LiquidityAlertService.name);

  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,

    @Inject(SolanaService)
    private readonly solana: SolanaService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async checkAllVaultsLiquidity() {
    this.logger.log('🕵️‍♂️ Running Predictive Liquidity Check...');

    try {
      // 1. Get all vaults
      const vaults = await this.prisma.client.vault.findMany({
        omit: { discordWebhookUrl: false },
        include: { maintainer: true }
      });

      for (const vault of vaults) {
        try {
          const pda = new PublicKey(vault.pdaAddress);
          const usdcBal = await this.solana.getVaultUsdcBalance(pda);

          const pendingContributions = await this.prisma.client.contribution.count({
            where: { 
              vaultId: vault.id, 
              status: { in: ['PENDING_APPROVAL', 'AUDITED'] } 
            }
          });

          const estimatedLiability = pendingContributions * 20;
          const remainingBuffer = usdcBal - estimatedLiability;

      
          if (usdcBal < 50 || remainingBuffer < 0) {
            
            // 🛡️ NEW: Check if this specific maintainer set up a Discord Webhook
            if (vault.discordWebhookUrl) {
              await this.sendDiscordAlert(
                vault.discordWebhookUrl, // 👈 Pass the vault's specific URL
                vault.repositoryFullName, 
                usdcBal, 
                pendingContributions
              );
            } else {
              this.logger.log(`Skipped alert for ${vault.repositoryFullName}: No Discord Webhook configured.`);
            }

          }
        } catch (vaultError) {
          this.logger.error(`Failed to check liquidity for ${vault.repositoryFullName}`, vaultError);
        }
      }
    } catch (dbError) {
      this.logger.error('Database connection failed during Liquidity Check', dbError);
    }
  }

  // 🛡️ NEW: Accepts the unique webhook URL as an argument
  private async sendDiscordAlert(webhookUrl: string, repoName: string, balance: number, pendingPRs: number) {
    const message = {
      content: `⚠️ **SOLUX Liquidity Alert: ${repoName}** ⚠️\n\nYour treasury is running dangerously low.\n- **Current Balance:** \`${balance} USDC\`\n- **Pending PRs:** \`${pendingPRs}\`\n\nTo ensure Blinky AI can continue settling bounties autonomously, please top up your vault immediately.`,
    };

    try {
      await axios.post(webhookUrl, message);
      this.logger.log(`🚨 Alert successfully sent to custom Discord channel for ${repoName}`);
    } catch (e) {
      this.logger.error(`Failed to send Discord webhook for ${repoName}`, e);
    }
  }
}