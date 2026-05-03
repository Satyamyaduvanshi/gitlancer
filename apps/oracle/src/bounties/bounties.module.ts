import { Module } from '@nestjs/common';
import { BountiesController } from './bounties.controller';
import { BountiesService } from './bounties.service';
import { PrismaService } from '../prisma/prisma.service'; 

@Module({
  controllers: [BountiesController],
  providers: [BountiesService, PrismaService], 
})
export class BountiesModule {}