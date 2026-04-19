import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { AiService } from '../ai/ai.service';
import { SolanaService } from '../solana/solana.service'; // Added this

@Module({
  controllers: [WebhooksController],
  providers: [
    WebhooksService, 
    AiService, 
    SolanaService // Added this
  ],
})
export class WebhooksModule {}