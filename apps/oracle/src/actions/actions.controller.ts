import { Controller, Get, Post, Body, Param, Res, Inject, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { ActionGetResponse, ActionPostResponse, ACTIONS_CORS_HEADERS } from '@solana/actions';
import { SolanaService } from '../solana/solana.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
export class ActionsController {
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
      // 1. Fetch the contribution and the user status
      const contribution = await this.prisma.client.contribution.findUnique({
        where: { id: id }, // Searching by specific Bounty ID
        include: { user: true }
      });

      if (!contribution) {
        return res.set(ACTIONS_CORS_HEADERS).status(404).json({ message: "Bounty not found." });
      }

      // 🛡️ LOGIC: Check if user is linked
      if (!contribution.user || !contribution.user.solanaWallet) {
        return res.set(ACTIONS_CORS_HEADERS).json({
          type: "action",
          icon: "https://gitlancer.app/onboarding-icon.png", // Use a "Register Now" icon
          title: "Wallet Not Linked",
          description: `You've earned $${contribution.amount} USDC! But we don't know where to send it. Link your wallet to claim.`,
          label: "Link Wallet to Claim",
          href: `http://localhost:3001/link` // 🚀 Redirect to your Guardian page
        });
      }

      // 🛡️ LOGIC: Check if maintainer has approved (See "The Solution" below)
      if (contribution.status === 'PENDING_APPROVAL') {
        return res.set(ACTIONS_CORS_HEADERS).json({
          type: "action",
          icon: "https://gitlancer.app/pending-icon.png",
          title: "Awaiting Approval",
          description: "The AI audit is done, but this bounty requires a final sign-off from the maintainer.",
          label: "Pending...",
          disabled: true
        });
      }

      // ✅ LOGIC: Standard Claim
      const response: ActionGetResponse = {
        type: "action",
        icon: "https://raw.githubusercontent.com/solana-developers/brand-assets/main/logos/vibrant/png/solana-vibrant-gradient-logo.png",
        title: "GitLancer Bounty Claim",
        description: `Claim your $${contribution.amount} USDC for PR #${contribution.prId}.`,
        label: `Claim ${contribution.amount} USDC`,
      };

      return res.set(ACTIONS_CORS_HEADERS).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  @Post('api/actions/claim/:id')
  async createClaimTransaction(
    @Param('id') id: string,
    @Body('account') account: string,
    @Res() res: Response
  ) {
    try {
      const contribution = await this.prisma.client.contribution.findUnique({
        where: { id: id },
        include: { user: true }
      });

      // 🛡️ SECURITY: Only the registered wallet can claim
      if (account !== contribution.user.solanaWallet) {
        return res.set(ACTIONS_CORS_HEADERS).status(403).json({
          message: "Unauthorized: This bounty belongs to a different linked wallet."
        });
      }

      const transaction = await this.solana.createUnsignedUSDCBatch(account, contribution.amount);

      return res.set(ACTIONS_CORS_HEADERS).status(201).json({
        type: 'transaction',
        transaction: transaction.serialize({ requireAllSignatures: false }).toString('base64'),
        message: `Claiming ${contribution.amount} USDC`,
      });
    } catch (error) {
      return res.status(500).json({ error: "Failed to create transaction" });
    }
  }
}