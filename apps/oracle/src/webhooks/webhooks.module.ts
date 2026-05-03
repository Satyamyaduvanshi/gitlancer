import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { AiService } from '../ai/ai.service';
import { PrismaModule } from '../prisma/prisma.module';
import { GithubModule } from '../github/github.module'; 

@Module({
  imports: [
    PrismaModule, 
    GithubModule, 
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService, AiService],
  exports: [WebhooksService],
})
export class WebhooksModule {}