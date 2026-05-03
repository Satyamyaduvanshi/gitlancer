import { Controller, Get, Post, Body, Param, Res, Inject, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ActionGetResponse, ACTIONS_CORS_HEADERS } from '@solana/actions';
import { SolanaService } from '../solana/solana.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
export class ActionsController {
  @Inject(SolanaService)
  private readonly solana: SolanaService;

  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  private readonly baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  private readonly webUrl = process.env.WEB_URL || 'http://localhost:3001';

  @Get('actions.json')
  getActionsJson(@Res() res: Response) {
    return res.set(ACTIONS_CORS_HEADERS).json({
      rules: [{ pathPattern: "/claim/*", apiPath: "/api/actions/claim/*" }]
    });
  }

  @Get('api/actions/claim/:userId')
  async getClaimMetadata(@Param('userId') userId: string, @Res() res: Response) {
    try {
      const contribution = await this.prisma.client.contribution.findFirst({
        where: { userId: userId, status: 'AUDITED' },
        orderBy: { createdAt: 'desc' },
        include: { user: true, vault: true }
      });

      if (!contribution) {
        return res.set(ACTIONS_CORS_HEADERS).status(HttpStatus.NOT_FOUND).json({ 
          message: "No claimable bounty found. Blinky is still auditing!" 
        });
      }

      if (!contribution.user?.solanaWallet) {
        return res.set(ACTIONS_CORS_HEADERS).json({
          type: "action",
          icon: "https://ucarecdn.com/7936e768-468e-490f-90e4-96942478d6b1/-/preview/800x800/",
          title: "Wallet Link Required",
          description: `You have a ${contribution.amount} USDC bounty waiting! Link your wallet to SOLUX to claim.`,
          label: "Link Wallet",
          links: {
            actions: [{
              label: "Link Wallet",
              href: `${this.webUrl}/link?githubId=${userId}`,
              type: "external-link"
            }]
          }
        });
      }

      const response: ActionGetResponse = {
        type: "action",
        icon: contribution.user.avatarUrl || "https://solana.com/src/img/branding/solanaLogoMark.png",
        title: "SOLUX Bounty Claim",
        description: `Claim ${contribution.amount} USDC for your contribution to ${contribution.vault.repositoryFullName}.`,
        label: `Claim Bounty`,
        links: {
          actions: [{
            label: `Claim ${contribution.amount} USDC`,
            href: `${this.baseUrl}/api/actions/claim/${userId}/execute`,
            type: "transaction"
          }]
        }
      };

      return res.set(ACTIONS_CORS_HEADERS).json(response);
    } catch (error) {
      return res.set(ACTIONS_CORS_HEADERS).status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        error: "Failed to fetch claim metadata." 
      });
    }
  }

  @Post('api/actions/claim/:userId/execute')
  async createClaimTransaction(
    @Param('userId') userId: string,
    @Body('account') account: string,
    @Res() res: Response
  ) {
    try {
      const contribution = await this.prisma.client.contribution.findFirst({
        where: { userId: userId, status: 'AUDITED' },
        orderBy: { createdAt: 'desc' },
        include: { user: true, vault: true }
      });

      if (!contribution || !contribution.user) {
        throw new Error("Contribution record not found.");
      }

      if (account !== contribution.user.solanaWallet) {
        return res.set(ACTIONS_CORS_HEADERS).status(HttpStatus.FORBIDDEN).json({
          message: "Unauthorized: Wallet mismatch. Please use your linked wallet."
        });
      }

      const transaction = await this.solana.createClaimTransaction(
        contribution.vault.repositoryFullName, 
        account, 
        contribution.amount,
        String(contribution.prId)
      );

      await this.prisma.client.contribution.update({
        where: { id: contribution.id },
        data: { status: 'CLAIMED' }
      });

      return res.set(ACTIONS_CORS_HEADERS).status(HttpStatus.OK).json({
        type: 'transaction',
        transaction: transaction.serialize({ requireAllSignatures: false }).toString('base64'),
        message: `Blinky is sending ${contribution.amount} USDC to your wallet!`,
      });
    } catch (error) {
      return res.set(ACTIONS_CORS_HEADERS).status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        error: "Transaction generation failed." 
      });
    }
  }

  @Post('api/withdraw')
  async createWithdrawTransaction(
    @Body() body: { repoFullName: string, maintainerAddress: string, amount: number },
    @Res() res: Response
  ) {
    try {
      const transaction = await this.solana.createWithdrawTransaction(
        body.repoFullName,
        body.maintainerAddress,
        body.amount
      );

      // We send this back to the frontend so the maintainer's wallet (Phantom/Solflare) can sign it
      return res.status(HttpStatus.OK).json({
        transaction: transaction.serialize({ requireAllSignatures: false }).toString('base64'),
      });
    } catch (error) {
      this.solana['logger'].error('Withdrawal TX Generation Failed', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        error: "Failed to generate withdrawal transaction." 
      });
    }
  }
}