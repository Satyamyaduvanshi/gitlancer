import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubService } from './github.service'; // 🚀 Import the service
import { PrismaModule } from '../prisma/prisma.module'; // Ensure Prisma is accessible
import { AiService } from '../ai/ai.service';

@Module({
  imports: [PrismaModule], // If you need Prisma inside GithubService/Controller
  controllers: [GithubController],
  providers: [GithubService,AiService], // 🚀 THIS IS THE FIX: Register the service here
  exports: [GithubService,AiService],   // Optional: so other modules can use it
})
export class GithubModule {}