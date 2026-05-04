import { Injectable, Inject, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { GithubService } from '../github/github.service';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AiService) private readonly ai: AiService,
    @Inject(GithubService) private readonly github: GithubService,
  ) {}

  @OnEvent('pr.merged')
  async processMerge(payload: any) {
    try {
      const pr = payload.pull_request;
      const githubHandle = pr.user.login;
      const diffUrl = pr.diff_url;
      const repoFullName = payload.repository.full_name;
      const userId = pr.user.id.toString();
      const installationId = payload.installation.id;

      this.logger.log(`⚙️ Background Worker Started: Auditing PR #${pr.number} for ${repoFullName}`);

      const vault = await this.prisma.client.vault.findUnique({ where: { repositoryFullName: repoFullName } });
      if (!vault) {
        this.logger.warn(`No vault found for ${repoFullName}. Audit aborted.`);
        return;
      }

      const audit = await this.ai.auditPullRequest(diffUrl);
      const user = await this.prisma.client.user.findUnique({ where: { id: userId } });

      let commentBody = `### 🛡️ SOLUX Guardian Audit\n\n**Analysis:** ${audit.reasoning}\n\n`;

      // 🛡️ NEW: Dynamically assign REJECTED if bounty is 0
      const finalStatus = audit.bountyUSDC > 0 ? 'AUDITED' : 'REJECTED';

      if (finalStatus === 'REJECTED') {
        // 💬 CUSTOM MESSAGE 4: Rejected / 0 USDC
        commentBody += `🛑 **Audit Result: Ineligible for Bounty**\n\nWhile your contribution is appreciated, Blinky AI has determined that this Pull Request does not meet the criteria for a financial reward (e.g., purely documentation changes, simple formatting, or insufficient code complexity).\n\nKeep building and submit functional code changes to qualify for future bounties!`;
      } else {
        commentBody += `🔥 **Excellent work @${githubHandle}!**\n\nBlinky has valued this contribution at **${audit.bountyUSDC} USDC**.`;

        const webUrl = process.env.WEB_URL || 'http://localhost:3001';

        if (user?.solanaWallet) {
           // 💬 CUSTOM MESSAGE 3: Ready to Claim
          commentBody += `\n\n🎁 [Claim Reward Here](${webUrl}/claim/${userId})`;
        } else {
           // 💬 CUSTOM MESSAGE 2: Needs Wallet Link
          commentBody += `\n\n⚠️ **Wallet Not Linked:** Link your wallet to your GitHub account to claim this bounty.\n\n[Link Wallet to Claim](${webUrl}/link?githubId=${userId})`;
        }
      }

      // Save the record to the database
      const contribution = await this.prisma.client.contribution.create({
        data: {
          userId,
          vaultId: vault.id,
          prId: pr.number.toString(),
          amount: audit.bountyUSDC,
          status: finalStatus as any, 
        },
      });

      await this.github.postComment(
        payload.repository.owner.login, 
        payload.repository.name, 
        pr.number, 
        installationId, 
        commentBody
      );

      this.logger.log(`✅ Background Worker Finished: PR #${pr.number} audited and comment posted.`);
    } catch (error) {
      this.logger.error(`❌ Background Worker Failed`, error);
    }
  }
}