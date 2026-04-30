import { 
  Controller, 
  Post, 
  Body, 
  Headers, 
  UnauthorizedException, 
  Logger, 
  Req,
  Inject // 👈 Added Inject here
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as crypto from 'crypto';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    // 🛡️ Explicitly inject the EventEmitter2 
    @Inject(EventEmitter2)
    private readonly eventEmitter: EventEmitter2, 
  ) {
    this.logger.log('🏗️ WebhooksController initialized.');
  }

  @Post('github')
  async handleGithubWebhook(
    @Headers('x-hub-signature-256') signature: string,
    @Req() req: any, 
    @Body() payload: any,
  ) {
    const secret = process.env.GITHUB_WEBHOOK_SECRET || 'blinky_secret_123';
    const hmac = crypto.createHmac('sha256', secret);
    
    const rawBody = req.rawBody || JSON.stringify(payload);
    const digest = 'sha256=' + hmac.update(rawBody).digest('hex');

    if (!signature || signature !== digest) {
      this.logger.error('❌ Unauthorized: Webhook signature mismatch.');
      throw new UnauthorizedException('Invalid signature');
    }

    const action = payload.action;
    const pr = payload.pull_request;

    const isMerged = action === 'closed' && pr?.merged === true;

    if (isMerged) {
      const githubHandle = pr.user.login;
      const repoName = payload.repository.full_name;

      this.logger.log(`📥 Merge Detected: ${repoName} by @${githubHandle}. Queueing background audit...`);

      // ⚡ This will now properly find the emit function!
      this.eventEmitter.emit('pr.merged', payload);

      return { status: 'queued', message: 'PR merge detected. Background audit started.' };
    }

    return { status: 'ignored' };
  }
}