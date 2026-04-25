import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Connection, Keypair, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
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
  async createClaimTransaction(repoFullName: string, contributorAddress: string, amountInUsdc: number, prId: string) {
    const contributor = new PublicKey(contributorAddress);
    const amount = new BN(amountInUsdc * 1_000_000); // Handle USDC 6 decimals

    // 1. Derive Vault PDA
    const [vaultStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), Buffer.from(repoFullName)],
      this.programId
    );

    // 2. 🛡️ Derive Anti-Double-Spend Bounty PDA
    const [bountyPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("bounty"), vaultStatePda.toBuffer(), Buffer.from(prId)],
      this.programId
    );

    const vaultUsdcAccount = getAssociatedTokenAddressSync(this.usdcMint, vaultStatePda, true);
    const contributorUsdcAccount = getAssociatedTokenAddressSync(this.usdcMint, contributor);

    // 3. Build the upgraded instruction
    const instruction = await this.program.methods
      .distributeBounty(repoFullName, amount, prId) 
      .accounts({
        oracle: this.oracleDelegate.publicKey,
        contributor: contributor,                   
        vaultState: vaultStatePda,
        bountyRecord: bountyPda,                    
        vaultTokenAccount: vaultUsdcAccount,
        contributorTokenAccount: contributorUsdcAccount,
        mint: this.usdcMint,                       
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,     
      })
      .instruction();

    // 4. Create Transaction
    const transaction = new Transaction().add(instruction);
    transaction.feePayer = contributor;
    transaction.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;

    // 5. PARTIAL SIGN by Oracle
    transaction.partialSign(this.oracleDelegate);

    return transaction;
  }
}