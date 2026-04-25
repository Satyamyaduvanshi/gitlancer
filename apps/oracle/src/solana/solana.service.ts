import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider, Wallet, Idl, BN } from '@coral-xyz/anchor';
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as fs from 'fs';
import * as path from 'path';

import * as soluxIdl from './idl/solux_program.json';

@Injectable()
export class SolanaService implements OnModuleInit {
  private readonly logger = new Logger(SolanaService.name);
  private connection: Connection;
  private oracleDelegate: Keypair;
  private program: Program;

  private programId = new PublicKey("JBnTbnqcvXTmw7nZ6TuLbGcY7U5b8Du7YPpK5G8nByyi");
  private usdcMint = new PublicKey(process.env.USDC_MINT!);

  onModuleInit() {
    this.connection = new Connection(process.env.SOLANA_RPC_URL!, 'confirmed');
    try {
      const keyPath = path.resolve(__dirname, '../../oracle-delegate.json');
      const secret = fs.readFileSync(keyPath, 'utf8');
      this.oracleDelegate = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(secret)));
      
      const wallet = new Wallet(this.oracleDelegate);
      const provider = new AnchorProvider(this.connection, wallet, { preflightCommitment: 'confirmed' });
      this.program = new Program(soluxIdl as Idl, provider);
      
      this.logger.log(`🛡️ Solana Service Initialized. Oracle: ${this.oracleDelegate.publicKey.toBase58()}`);
    } catch (err) {
      this.logger.error('❌ Failed to load Oracle Delegate', err);
    }
  }

  /**
   * Builds the transaction for a Bounty Claim Blink
   */
  async createClaimTransaction(repoFullName: string, contributorAddress: string, amountInUsdc: number) {
    const contributor = new PublicKey(contributorAddress);
    const amount = new BN(amountInUsdc * 1_000_000); // Handle USDC 6 decimals

    // 1. Derive PDAs
    const [vaultStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), Buffer.from(repoFullName)],
      this.programId
    );

    const vaultUsdcAccount = getAssociatedTokenAddressSync(this.usdcMint, vaultStatePda, true);
    const contributorUsdcAccount = getAssociatedTokenAddressSync(this.usdcMint, contributor);

    // 2. Build the instruction from our Smart Contract
    const instruction = await this.program.methods
      .distributeBounty(repoFullName, amount)
      .accounts({
        oracle: this.oracleDelegate.publicKey,
        vaultState: vaultStatePda,
        vaultTokenAccount: vaultUsdcAccount,
        contributorTokenAccount: contributorUsdcAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction();

    // 3. Create Transaction
    const transaction = new Transaction().add(instruction);
    transaction.feePayer = contributor; // User pays the tiny gas fee to claim
    transaction.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;

    // 4. 🛡️ PARTIAL SIGN
    // This is the most important part! Our Rust code says the Oracle MUST sign.
    // We sign it here on the backend, then the user signs in their wallet.
    transaction.partialSign(this.oracleDelegate);

    return transaction;
  }
}