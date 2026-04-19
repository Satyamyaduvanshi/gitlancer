import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, createTransferInstruction } from '@solana/spl-token';

@Injectable()
export class SolanaService implements OnModuleInit {
  private connection: Connection;
  private treasury: Keypair;
  private usdcMint: PublicKey;

  onModuleInit() {
    this.connection = new Connection(process.env.SOLANA_RPC_URL!, 'confirmed');
    this.treasury = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(process.env.TREASURY_SECRET_KEY!))
    );
    this.usdcMint = new PublicKey(process.env.USDC_MINT!);
  }

  async createUnsignedUSDCBatch(recipientAddress: string, amount: number) {
    const recipient = new PublicKey(recipientAddress);
    const transaction = new Transaction();

    // 1. Get/Create ATAs
    const fromAta = await getOrCreateAssociatedTokenAccount(this.connection, this.treasury, this.usdcMint, this.treasury.publicKey);
    const toAta = await getOrCreateAssociatedTokenAccount(this.connection, this.treasury, this.usdcMint, recipient);

    // 2. Add Transfer (USDC 6 decimals)
    transaction.add(
      createTransferInstruction(
        fromAta.address,
        toAta.address,
        this.treasury.publicKey,
        amount * 1_000_000
      )
    );

    // 3. Set standard transaction metadata
    transaction.feePayer = recipient; // The person claiming pays the tiny gas fee
    transaction.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;

    // 4. Partial Sign (Treasury signs because it's the source of funds)
    transaction.partialSign(this.treasury);

    return transaction;
  }
}