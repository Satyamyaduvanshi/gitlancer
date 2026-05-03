import { 
  Controller, 
  Post, 
  Body, 
  Headers, 
  UnauthorizedException, 
  Inject, 
  Logger, 
  Req 
} from '@nestjs/common';
import { GithubService } from './github.service';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@gitlancer/db/generated/client';
import * as crypto from 'crypto';

@Controller('api/github')
export class GithubController {
  private readonly logger = new Logger(GithubController.name);

  @Inject(GithubService)
  private readonly githubService: GithubService;

  @Inject(AiService)
  private readonly aiService: AiService;

  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Post('webhook')
  async handleWebhook(
    @Headers('x-hub-signature-256') signature: string,
    @Req() req: any,
    @Body() payload: any,
  ) {

    const secret = process.env.GITHUB_WEBHOOK_SECRET || 'blinky_secret_123';
    const hmac = crypto.createHmac('sha256', secret);
    const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');

    if (signature !== digest) {
      this.logger.error('❌ Signature mismatch');
      throw new UnauthorizedException('Invalid signature');
    }

    const action = payload.action;
    const pr = payload.pull_request;


    if (action === 'closed' && pr?.merged) {
      const owner = payload.repository.owner.login;
      const repo = payload.repository.name;
      const repoFullName = payload.repository.full_name;
      const installationId = payload.installation.id;
      const githubHandle = pr.user.login;
      const userId = pr.user.id.toString();


      const vault = await this.prisma.client.vault.findUnique({
        where: { repositoryFullName: repoFullName }
      });

      if (!vault) {
        this.logger.log(`Repo ${repoFullName} not registered. Skipping.`);
        return { received: true };
      }

      if (userId === vault.maintainerId) {
        return { message: "Self-merge ignored." };
      }

      this.logger.log(`🔥 PR #${pr.number} Merged! Blinky is auditing @${githubHandle}...`);

      try {

        const audit = await this.aiService.auditPullRequest(pr.diff_url);
        

        let user = await this.prisma.client.user.findUnique({
          where: { id: userId }
        });

        if (!user) {
          const githubInfo = await this.githubService.getGithubUserInfo(installationId, githubHandle);
          user = await this.prisma.client.user.create({
            data: {
              id: userId,
              githubHandle: githubHandle,
              avatarUrl: githubInfo?.avatarUrl || '',
            }
          });
        }


        let status = 'AUDITED';
        if (audit.bountyUSDC > vault.budgetLimit) {
          status = 'PENDING_APPROVAL';
        }


        const contribution = await this.prisma.client.contribution.create({
          data: {
            userId: userId,
            vaultId: vault.id,
            prId: pr.number.toString(),
            amount: audit.bountyUSDC,
            status: status as any,
          },
        });


        let finalComment = `### 🤖 SOLUX Audit Complete\n\nGreat work @${githubHandle}! Blinky has finished auditing your contribution.\n\n**Bounty Amount:** ${audit.bountyUSDC} USDC\n**Reasoning:** ${audit.reasoning}\n\n---\n\n`;

        const webUrl = process.env.WEB_URL || 'http://localhost:3001';
        const blinkUrl = process.env.BASE_URL || 'http://localhost:3000'; 

        if (status === 'PENDING_APPROVAL') {
          finalComment += `⏳ **Pending Approval:** This bounty exceeds the auto-limit and is waiting for the maintainer's review. Check back soon!`;
        } else if (user.solanaWallet) {

          finalComment += `🎁 **Your bounty is ready!**\n\n[Claim ${audit.bountyUSDC} USDC via Solana Blink](${blinkUrl}/api/actions/claim/${contribution.id})`;
        } else {

          finalComment += `👋 **Wait!** You haven't linked a Solana wallet to your GitHub account yet.\n\n[Link your wallet to claim your bounty](${webUrl}/link?githubId=${userId})`;
        }


        await this.githubService.postComment(owner, repo, pr.number, installationId, finalComment);

      } catch (err) {
        this.logger.error(`❌ Workflow Error: ${err.message}`);
      }
    }

    return { received: true };
  }
}