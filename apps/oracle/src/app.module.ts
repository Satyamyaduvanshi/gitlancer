import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { AiService } from './ai/ai.service';
import { SolanaService } from './solana/solana.service';
import { PrismaService } from './prisma/prisma.service';
import { ActionsController } from './actions/actions.controller';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { GithubModule } from './github/github.module';
import { VaultsModule } from './vaults/vaults.module';

@Module({
  imports: [PrismaModule, WebhooksModule,UsersModule, GithubModule, VaultsModule, ],
  controllers: [AppController,ActionsController, UsersController,],
  providers: [AppService, AiService, SolanaService, PrismaService,],
})
export class AppModule {}
