import { Injectable, Inject } from '@nestjs/common'; // Add Inject here
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { SolanaService } from 'src/solana/solana.service';

@Injectable()
export class WebhooksService {
  constructor(
    @Inject(PrismaService) // Explicitly inject Prisma
    private readonly prisma: PrismaService,
    
    @Inject(AiService)     // Explicitly inject AI Service
    private readonly ai: AiService,

    @Inject(SolanaService)
    private readonly solana: SolanaService
  ) {
    // Self-test log to confirm the fix
    console.log('👷 WebhooksService Ready. Prisma:', !!this.prisma, 'AI:', !!this.ai);
  }

  async processMerge(githubHandle: string, diffUrl: string, payload: any) {
    const user = await this.prisma.client.user.findUnique({ where: { githubHandle } });
    if (!user) return { status: 'no_wallet' };

    console.log(`🤖 Auditing PR for ${githubHandle}...`);
    const audit = await this.ai.auditPullRequest(diffUrl);

    // 1. Create the contribution record
    const contribution = await this.prisma.client.contribution.create({
      data: {
        prId: payload.pull_request.id.toString(),
        amount: audit.bountyUSDC,
        userId: user.id,
        status: 'AUDITED',
      },
    });

    // 2. Trigger the Real Payout 💸
    console.log(`💸 Sending ${audit.bountyUSDC} USDC to ${user.solanaWallet}...`);
    try {
      const signature = await this.solana.sendUSDC(user.solanaWallet, audit.bountyUSDC);
      
      // 3. Update status to PAID and save the TX signature
      await this.prisma.client.contribution.update({
        where: { id: contribution.id },
        data: { 
          status: 'PAID',
          // Assuming you have a txHash field in your schema
          // txHash: signature 
        },
      });

      console.log(`✅ Payout Successful! TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (err) {
      console.error('❌ Payout Failed:', err);
    }

    return audit;
  }
  
}