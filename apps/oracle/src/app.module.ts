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
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BountiesController } from './bounties/bounties.controller';
import { BountiesService } from './bounties/bounties.service';
import { BountiesModule } from './bounties/bounties.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LiquidityAlertService } from './liquidity/liquidity.service';

@Module({
  imports: [EventEmitterModule.forRoot(),ScheduleModule.forRoot(),PrismaModule, WebhooksModule,UsersModule, GithubModule, VaultsModule, BountiesModule],
  controllers: [AppController,ActionsController, UsersController, BountiesController,],
  providers: [AppService, AiService, SolanaService, PrismaService, BountiesService, LiquidityAlertService,],
})
export class AppModule {}
