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
import { WebhooksService } from './webhooks.service';
import * as crypto from 'crypto';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    @Inject(WebhooksService)
    private readonly webhooksService: WebhooksService,
  ) {
    this.logger.log('🏗️ WebhooksController initialized.');
  }

  @Post('github')
  async handleGithubWebhook(
    @Headers('x-hub-signature-256') signature: string,
    @Req() req: any, // We need the raw body for signature verification
    @Body() payload: any,
  ) {
    // 1. 🛡️ Security Check: Verify that this actually came from GitHub
    const secret = process.env.GITHUB_WEBHOOK_SECRET || 'blinky_secret_123';
    const hmac = crypto.createHmac('sha256', secret);
    
    // Use the raw body buffer if available, otherwise stringify the payload
    const rawBody = req.rawBody || JSON.stringify(payload);
    const digest = 'sha256=' + hmac.update(rawBody).digest('hex');

    if (!signature || signature !== digest) {
      this.logger.error('❌ Unauthorized: Webhook signature mismatch.');
      throw new UnauthorizedException('Invalid signature');
    }

    const action = payload.action;
    const pr = payload.pull_request;

    // 2. 🚀 Logic: Only process PRs that were just MERGED
    const isMerged = action === 'closed' && pr?.merged === true;

    if (isMerged) {
      const githubHandle = pr.user.login;
      const diffUrl = pr.diff_url;
      const repoName = payload.repository.full_name;

      this.logger.log(`🚀 Merge Detected: ${repoName} by @${githubHandle}`);

      // Pass the whole payload so the service can access installation IDs and repo details
      return await this.webhooksService.processMerge(githubHandle, diffUrl, payload);
    }

    return { status: 'ignored' };
  }
}