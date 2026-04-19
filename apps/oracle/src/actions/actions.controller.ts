import { Controller, Get, Post, Body, Param, Res, Options, NotFoundException, Inject } from '@nestjs/common';
import { Response } from 'express';
import { ActionGetResponse, ActionPostResponse, ACTIONS_CORS_HEADERS } from '@solana/actions';
import { SolanaService } from '../solana/solana.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
export class ActionsController {
  // 🚀 FIXED: Inject directly onto properties
  @Inject(SolanaService)
  private readonly solana: SolanaService;

  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Get('actions.json')
  getActionsJson(@Res() res: Response) {
    return res.set(ACTIONS_CORS_HEADERS).json({
      rules: [{ pathPattern: "/claim/*", apiPath: "/api/actions/claim/*" }]
    });
  }

  @Get('api/actions/claim/:id')
  async getClaimMetadata(@Param('id') id: string, @Res() res: Response) {
    try {
      // Logic check: ensure the service actually arrived
      if (!this.prisma) {
        throw new Error("PrismaService not injected");
      }

      // Inside getClaimMetadata
    const contribution = await this.prisma.client.contribution.findFirst({
      where: { 
        userId: id,
        status: 'AUDITED'
     },
     select: {
      amount: true,
      user: {
        select: { githubHandle: true },
      },
    },
    });

      if (!contribution) {
        return res.set(ACTIONS_CORS_HEADERS).status(404).json({
          message: `Bounty ID "${id}" not found.`
        });
      }

      const response: ActionGetResponse = {
        type: "action",
        icon: "https://raw.githubusercontent.com/solana-developers/brand-assets/main/logos/vibrant/png/solana-vibrant-gradient-logo.png",
        title: "GitLancer Bounty Claim",
        description: `Congrats @${contribution.user?.githubHandle || 'Dev'}! You earned $${contribution.amount} USDC.`,
        label: `Claim ${contribution.amount} USDC`,
      };

      return res.set(ACTIONS_CORS_HEADERS).json(response);
    } catch (error) {
      console.error("❌ Metadata Error:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  @Post('api/actions/claim/:id')
  async createClaimTransaction(
    @Param('id') id: string,
    @Body('account') account: string, // This is the user's wallet address from the inspector
    @Res() res: Response
  ) {
    try {
      // 🚀 FIXED: Search by userId instead of UUID to match the URL
      const contribution = await this.prisma.client.contribution.findFirst({
        where: { 
          userId: id,
          status: 'AUDITED' 
        }
      });

      if (!contribution) {
        return res.set(ACTIONS_CORS_HEADERS).status(404).json({
          message: `Bounty for User ${id} not found or not audited.`
        });
      }

      // This creates the actual Solana transaction
      const transaction = await this.solana.createUnsignedUSDCBatch(account, contribution.amount);

      const response: ActionPostResponse = {
        type: 'transaction',
        transaction: transaction.serialize({ requireAllSignatures: false }).toString('base64'),
        message: `Claiming ${contribution.amount} USDC for user ${id}`,
      };

      return res.set(ACTIONS_CORS_HEADERS).status(201).json(response);
    } catch (error) {
      console.error("❌ POST Error:", error);
      return res.status(500).json({ error: "Failed to create transaction" });
    }
  }
}