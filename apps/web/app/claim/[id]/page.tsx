'use client';

import { useState, useEffect, use } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import axios from "axios";

export default function NativeClaimPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  
  const [metadata, setMetadata] = useState<any>(null);
  const [status, setStatus] = useState("Loading bounty data...");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false); 
  const [isSuccess, setIsSuccess] = useState(false); 

  const oracleUrl = process.env.NEXT_PUBLIC_ORACLE_URL || "http://localhost:3000";

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    async function fetchMetadata() {
      try {
        const res = await axios.get(`${oracleUrl}/api/actions/claim/${id}`);
        setMetadata(res.data);
        setStatus(""); 
      } catch (error: any) {
        setStatus(error.response?.data?.message || "Failed to load bounty. Are you sure you have pending bounties?");
      }
    }
    fetchMetadata();
  }, [id, oracleUrl]);

  const executeClaim = async () => {
    if (!publicKey || !signTransaction) {
      setStatus("Error: Connect a wallet that supports manual signing.");
      return;
    }

    setLoading(true);
    setStatus("Generating secure transaction...");

    try {
      const res = await axios.post(`${oracleUrl}/api/actions/claim/${id}/execute`, {
        account: publicKey.toBase58()
      });

      setStatus("Please approve the transaction in Phantom...");
      
      const txBuffer = Buffer.from(res.data.transaction, 'base64');
      const transaction = Transaction.from(txBuffer);

      const signedTx = await signTransaction(transaction);
      const rawTransaction = signedTx.serialize();

      setStatus("Simulating and Broadcasting to network...");

      // 🛡️ Strict Simulation Check
      const signature = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: false, 
        maxRetries: 3,       
        preflightCommitment: 'confirmed'
      });
      
      setStatus("Confirming on network...");
      const latestBlockhash = await connection.getLatestBlockhash();
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
      }, 'confirmed');

      if (confirmation.value.err) {
        throw new Error("Transaction failed on-chain!");
      }
      
      setStatus(`🎉 Success! Bounty claimed. Signature: ${signature.slice(0, 8)}...`);
      setIsSuccess(true); 
      
    } catch (error: any) {
      console.error("Full Claim Error:", error);
      let errMsg = "Transaction rejected or failed.";
      
      // 🛡️ Truthful Error Reporting
      if (error.message) {
        errMsg = error.message; 
      }
      
      // Helpful hint for the most common Devnet issue
      if (errMsg.includes("0x1")) {
        errMsg = "Insufficient SOL for gas. Make sure your Phantom wallet has at least 0.01 SOL.";
      } else if (errMsg.includes("insufficient funds") && !errMsg.includes("0x1")) {
        errMsg = "The Maintainer's Vault does not have enough USDC.";
      }

      setStatus(`❌ Error: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full border border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-2xl relative">
        
        {/* Visual Header */}
        <div className="p-8 flex flex-col items-center border-b border-slate-800">
          <img 
            src={metadata?.icon || "https://github.com/ghost.png"} 
            alt="Avatar" 
            onError={(e) => { e.currentTarget.src = "https://github.com/ghost.png"; }}
            className={`w-16 h-16 rounded-full mb-4 shadow-lg border border-slate-700 object-cover ${!metadata ? 'animate-pulse' : ''}`} 
          />
          <h1 className="text-xl font-bold">{metadata ? metadata.title : "SOLUX Vault"}</h1>
          <p className="text-slate-400 text-sm text-center mt-2 break-words">
            {metadata ? metadata.description : status}
          </p>
        </div>

        {/* Action Area */}
        <div className="p-6 flex flex-col gap-4 bg-slate-950/50">
          <div className="flex justify-center">
            {mounted ? (
               <WalletMultiButton className="!bg-purple-600 !h-10 !text-xs !rounded-md hover:!bg-purple-700 transition" />
            ) : (
               <div className="h-10 w-32 bg-slate-800 rounded-md animate-pulse" />
            )}
          </div>

          {/* Hide button if already succeeded or disabled */}
          {metadata && !metadata.disabled && !isSuccess && publicKey && (
            <button
              onClick={executeClaim}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-md font-bold text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all text-white shadow-lg active:scale-95"
            >
              {loading ? "Processing..." : metadata.label}
            </button>
          )}

          {status && status !== "Loading bounty data..." && status !== "" && (
            <div className={`text-center text-[10px] font-mono mt-2 p-3 rounded-lg border break-words ${isSuccess ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}