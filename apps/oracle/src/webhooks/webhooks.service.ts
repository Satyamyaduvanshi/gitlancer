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
  ) {
    this.logger.log('🏗️ Blinky Webhook Service Ready (Claim Mode)');
  }

  async processMerge(githubHandle: string, diffUrl: string, payload: any) {
    const repoFullName = payload.repository.full_name;
    const userId = payload.pull_request.user.id.toString();
    const installationId = payload.installation.id;
  
    const vault = await this.prisma.client.vault.findUnique({ where: { repositoryFullName: repoFullName } });
    if (!vault) return;
  
    // 🧠 1. Always Run AI Audit (The Core Feature)
    const audit = await this.ai.auditPullRequest(diffUrl);
    const user = await this.prisma.client.user.findUnique({ where: { id: userId } });
  
    let commentBody = `### 🛡️ GitLancer Guardian Audit\n\n**Analysis:** ${audit.reasoning}\n\n`;
  
    // 2. 🎭 Messaging Logic based on Identity
    if (userId === vault.maintainerId) {
      // MAINTAINER PERSONA
      commentBody += `👋 **Greetings, Maintainer @${githubHandle}!**\n\nThank you for the high-quality contribution to your own repository. Blinky has successfully audited your merge and verified it against the GitLancer standards. No bounty was issued as this is a self-merge, but the audit trail is now cryptographically secured.`;
    } else {
      // CONTRIBUTOR PERSONA
      commentBody += `🔥 **Great work @${githubHandle}!**\n\nBlinky has valued your contribution at **${audit.bountyUSDC} USDC**.`;
  
      // Create the record so it exists in the DB
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
        commentBody += `\n\n🎁 [Claim your reward via Solana Blink](${baseUrl}/api/actions/claim/${userId})`;
      } else {
        commentBody += `\n\n⚠️ **Identity Gap Detected:** You haven't linked your Solana wallet to GitLancer yet.\n\n[Link Wallet to Claim](${webUrl}/link?githubId=${userId})`;
      }
    }
  
    // 3. Post to GitHub
    await this.github.postComment(payload.repository.owner.login, payload.repository.name, payload.pull_request.number, installationId, commentBody);
  }
}