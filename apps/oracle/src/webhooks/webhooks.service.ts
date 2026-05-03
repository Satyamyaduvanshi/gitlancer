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

      let commentBody = `### 🛡️ GitLancer Guardian Audit\n\n**Analysis:** ${audit.reasoning}\n\n`;

      if (userId === vault.maintainerId) {
        //  MAINTAINER FLOW
        commentBody += `👋 **Greetings, Maintainer @${githubHandle}!**\n\nBlinky has audited your merge. Since this is a maintainer contribution, no bounty was issued, but your audit trail is now anchored to the blockchain. Thank you for building!`;
      } 
      // 
      // if(false){
      //   // testing the bounty payout flow
      // }  
      else {

        commentBody += `🔥 **Excellent work @${githubHandle}!**\n\nBlinky has valued this contribution at **${audit.bountyUSDC} USDC**.`;

        const contribution = await this.prisma.client.contribution.create({
          data: {
            userId,
            vaultId: vault.id,
            prId: pr.number.toString(),
            amount: audit.bountyUSDC,
            status: 'AUDITED',
          },
        });

        const webUrl = process.env.WEB_URL || 'http://localhost:3001';

        if (user?.solanaWallet) {
          commentBody += `\n\n🎁 [Claim Reward Here](${webUrl}/claim/${userId})`;
        } else {
          commentBody += `\n\n⚠️ **Wallet Not Linked:** Link your wallet to your GitHub account to claim this bounty.\n\n[Link Wallet to Claim](${webUrl}/link?githubId=${userId})`;
        }
      }

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