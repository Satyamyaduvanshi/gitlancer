import { Injectable, Inject, Logger } from '@nestjs/common';
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

  async processMerge(githubHandle: string, diffUrl: string, payload: any) {
    const repoFullName = payload.repository.full_name;
    const userId = payload.pull_request.user.id.toString();
    const installationId = payload.installation.id;

    const vault = await this.prisma.client.vault.findUnique({ where: { repositoryFullName: repoFullName } });
    if (!vault) return;

    // 1. Always Audit (Security First)
    const audit = await this.ai.auditPullRequest(diffUrl);
    const user = await this.prisma.client.user.findUnique({ where: { id: userId } });

    let commentBody = `### 🛡️ GitLancer Guardian Audit\n\n**Analysis:** ${audit.reasoning}\n\n`;

    // if (userId === vault.maintainerId) {
    //   // 👨‍💻 MAINTAINER FLOW
    //   commentBody += `👋 **Greetings, Maintainer @${githubHandle}!**\n\nBlinky has audited your merge. Since this is a maintainer contribution, no bounty was issued, but your audit trail is now anchored to the blockchain. Thank you for building!`;
    // } 
    // 
    if(false){
      // testing the bounty payout flow
    }  
    else {
      // 🛠️ CONTRIBUTOR FLOW
      commentBody += `🔥 **Excellent work @${githubHandle}!**\n\nBlinky has valued this contribution at **${audit.bountyUSDC} USDC**.`;

      const contribution = await this.prisma.client.contribution.create({
        data: {
          userId,
          vaultId: vault.id,
          prId: payload.pull_request.number.toString(),
          amount: audit.bountyUSDC,
          status: 'AUDITED',
        },
      });

      const webUrl = process.env.WEB_URL || 'http://localhost:3001';
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

      if (user?.solanaWallet) {
        commentBody += `\n\n🎁 [Claim Reward Here](${webUrl}/claim/${userId})`;
      } else {
        commentBody += `\n\n⚠️ **Wallet Not Linked:** Link your wallet to your GitHub account to claim this bounty.\n\n[Link Wallet to Claim](${webUrl}/link?githubId=${userId})`;
      }
    }

    await this.github.postComment(
      payload.repository.owner.login, 
      payload.repository.name, 
      payload.pull_request.number, 
      installationId, 
      commentBody
    );
  }
}