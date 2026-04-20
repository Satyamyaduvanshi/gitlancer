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
      // 1. 🛡️ VERIFY SIGNATURE (Security First)
      const secret = process.env.GITHUB_WEBHOOK_SECRET || 'blinky_secret_123';
      const hmac = crypto.createHmac('sha256', secret);
      const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');
  
      if (signature !== digest) {
        this.logger.error('❌ Signature mismatch');
        throw new UnauthorizedException('Invalid signature');
      }
  
      const action = payload.action;
      const pr = payload.pull_request;
  
      // 2. 🚀 DETECT MERGE EVENT
      if (action === 'closed' && pr?.merged) {
        const owner = payload.repository.owner.login;
        const repo = payload.repository.name;
        const installationId = payload.installation.id;
        const githubHandle = pr.user.login;
        const userId = pr.user.id.toString();
  
        this.logger.log(`🔥 PR #${pr.number} Merged! Analyzing contribution...`);
  
        try {
          // 3. 🧠 AI AUDIT (GEMINI)
          const audit = await this.aiService.auditPullRequest(pr.diff_url);
          this.logger.log(`📊 AI Result: $${audit.bountyUSDC} | Reason: ${audit.reasoning}`);
  
          // 4. 🔍 DB CHECK: Is the user onboarded?
          const user = await this.prisma.client.user.findUnique({
            where: { id: userId }
          });
  
          let finalComment = '';
  
          if (user) {
            // ✅ CASE: REGISTERED USER
            const status = audit.bountyUSDC <= 10 ? 'AUDITED' : 'PENDING_APPROVAL';
  
            await this.prisma.client.contribution.create({
              data: {
                userId: userId,
                prId: pr.number.toString(),
                amount: audit.bountyUSDC,
                status: status,
              }
            });
  
            finalComment = `### 🤖 SOLUX Audit Complete\n\nGreat work @${githubHandle}! Blinky has audited your contribution.\n\n**Bounty Amount:** ${audit.bountyUSDC} USDC\n\n[Claim your bounty via Solana Blink](http://localhost:3000/api/actions/claim/${userId})`;
            this.logger.log(`✅ Saved bounty for registered user: ${githubHandle}`);
          } else {
            // ❌ CASE: NEW USER (The Onboarding Flow)
            finalComment = `### 🤖 SOLUX Audit Complete\n\nGreat work @${githubHandle}! Blinky has audited this PR and found a **${audit.bountyUSDC} USDC** bounty.\n\n⚠️ **Wait!** You haven't linked your Solana wallet to SOLUX yet. \n\n[Link your wallet here to claim this reward](http://localhost:3001/link?githubId=${userId})`;
            this.logger.log(`⚠️ User ${githubHandle} not found. Sent onboarding instructions.`);
          }
  
          // 5. 💬 POST THE COMMENT
          await this.githubService.postComment(
            owner, 
            repo, 
            pr.number, 
            installationId, 
            finalComment
          );
  
        } catch (err) {
          this.logger.error(`❌ Audit Flow Failed: ${err.message}`);
        }
      }
  
      return { received: true };
    }
  }