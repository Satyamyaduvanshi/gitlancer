import * as dotenv from 'dotenv';
import { join } from 'path';
import { 
  Connection, 
  Keypair, 
  PublicKey, 
  Transaction, 
  sendAndConfirmTransaction 
} from '@solana/web3.js';
import { 
  getOrCreateAssociatedTokenAccount, 
  createTransferInstruction, 
  TOKEN_PROGRAM_ID 
} from '@solana/spl-token';

// 1. Load Environment Variables from the root .env
dotenv.config({ path: join(__dirname, '../../../.env') });

async function testPayout() {
  // Use 'confirmed' commitment for better reliability
  const connection = new Connection("https://api.devnet.solana.com", 'confirmed');
  
  // 2. Load Treasury Keypair from .env
  if (!process.env.TREASURY_SECRET_KEY) {
    console.error("❌ TREASURY_SECRET_KEY not found in .env");
    return;
  }
  
  const treasury = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(process.env.TREASURY_SECRET_KEY))
  );

  // Your Phantom Wallet Devnet Address
  const recipient = new PublicKey("Bug2DomuP6Yfd8pw7XRvU58cetVSdy8UsYg2DFatWqaR");
  
  console.log('🔍 Checking Treasury:', treasury.publicKey.toBase58());

  // 3. --- DISCOVERY STEP ---
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    treasury.publicKey,
    { programId: TOKEN_PROGRAM_ID }
  );

  const envMint = process.env.USDC_MINT;
  console.log(`🎯 Target Mint (from .env): ${envMint}`);

  const activeAccount = tokenAccounts.value.find(
    a => a.account.data.parsed.info.mint === envMint
  );
  
  if (!activeAccount) {
    console.log('❌ ERROR: Treasury does not hold the Mint specified in .env.');
    console.log('Check the scanning logs above and update your .env file.');
    return;
  }

  const usdcMintKey = new PublicKey(envMint!);

  // 4. --- EXECUTION: Transfer 1 USDC ---
  console.log(`\n💸 Attempting to send 1 USDC to: ${recipient.toBase58()}...`);

  try {
    // Get/Create Treasury Associated Token Account
    const fromAta = await getOrCreateAssociatedTokenAccount(
      connection,
      treasury,
      usdcMintKey,
      treasury.publicKey
    );

    // Get/Create Recipient Associated Token Account
    const toAta = await getOrCreateAssociatedTokenAccount(
      connection,
      treasury,
      usdcMintKey,
      recipient
    );

    console.log(`✅ Token Accounts Ready.`);
    console.log(`   From ATA: ${fromAta.address.toBase58()}`);
    console.log(`   To ATA:   ${toAta.address.toBase58()}`);

    // USDC has 6 decimals on Devnet
    const amount = 1 * 1_000_000; 

    const transaction = new Transaction().add(
      createTransferInstruction(
        fromAta.address,
        toAta.address,
        treasury.publicKey,
        amount
      )
    );

    const signature = await sendAndConfirmTransaction(
      connection, 
      transaction, 
      [treasury]
    );

    console.log(`\n🎉 SUCCESS!`);
    console.log(`🔗 TX Signature: ${signature}`);
    console.log(`🖥️  Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    
  } catch (error: any) {
    console.error('\n❌ Transfer Failed:');
    console.error(error.message || error);
  }
}

testPayout();