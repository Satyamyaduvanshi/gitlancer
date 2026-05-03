import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubService } from './github.service'; 
import { PrismaModule } from '../prisma/prisma.module'; 
import { AiService } from '../ai/ai.service';

@Module({
  imports: [PrismaModule], 
  controllers: [GithubController],
  providers: [GithubService,AiService], 
  exports: [GithubService,AiService],   
})
export class GithubModule {}