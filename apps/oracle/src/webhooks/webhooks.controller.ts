import { Controller, Post, Body, Inject } from '@nestjs/common'; // Add Inject
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    @Inject(WebhooksService) // <--- Add this explicit injection
    private readonly webhooksService: WebhooksService,
  ) {
    // This will prove if it's working immediately on startup
    console.log('🏗️ WebhooksController initialized. Service:', !!this.webhooksService);
  }

  @Post('github')
  async handleGithubWebhook(@Body() payload: any) {
    const isMerged = payload.action === 'closed' && payload.pull_request?.merged;

    if (isMerged) {
      const githubHandle = payload.pull_request.user.login;
      const diffUrl = payload.pull_request.diff_url;

      console.log(`🚀 Merge Detected: ${payload.repository.full_name} by ${githubHandle}`);

      // We use 'await' here to ensure the service finishes before responding
      return await this.webhooksService.processMerge(githubHandle, diffUrl, payload);
    }

    return { status: 'ignored' };
  }
}