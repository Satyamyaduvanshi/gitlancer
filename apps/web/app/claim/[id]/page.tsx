'use client';

import { useState, useEffect, use } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import axios from "axios";

// Next.js 15 requires params to be treated as a Promise
export default function NativeClaimPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params promise safely
  const { id } = use(params);
  
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  
  const [metadata, setMetadata] = useState<any>(null);
  const [status, setStatus] = useState("Loading bounty data...");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false); // Hydration fix

  const oracleUrl = process.env.NEXT_PUBLIC_ORACLE_URL || "http://localhost:3000";

  // Hydration fix: Only render wallet button after client mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Fetch Metadata
  useEffect(() => {
    async function fetchMetadata() {
      try {
        const res = await axios.get(`${oracleUrl}/api/actions/claim/${id}`);
        setMetadata(res.data);
        setStatus(""); // Clear status on success
      } catch (error: any) {
        setStatus(error.response?.data?.message || "Failed to load bounty.");
      }
    }
    fetchMetadata();
  }, [id, oracleUrl]);

  // 2. Execute the Transaction
  const executeClaim = async () => {
    if (!publicKey) return;
    
    // Safety check: ensure the wallet supports manual signing
    if (!signTransaction) {
      setStatus("Error: Your wallet does not support manual signing.");
      return;
    }

    setLoading(true);
    setStatus("Generating transaction...");

    try {
      // POST to the Oracle to get the base64 transaction
      const res = await axios.post(`${oracleUrl}/api/actions/claim/${id}/execute`, {
        account: publicKey.toBase58()
      });

      setStatus("Please approve in Phantom...");

      // Convert the base64 string back into a Solana Transaction
      const txBuffer = Buffer.from(res.data.transaction, 'base64');
      const transaction = Transaction.from(txBuffer);

      // 🚨 FIX: Manually request ONLY the signature from Phantom
      // This prevents the wallet adapter from mutating the transaction and breaking the Treasury signature
      const signedTx = await signTransaction(transaction);

      setStatus("Broadcasting to network...");

      // Serialize the fully signed transaction (Backend + User)
      const rawTransaction = signedTx.serialize();

      // Send the raw bytes directly to the RPC node
      const signature = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true, // Bypass the simulation check
        maxRetries: 0,       // Prevent the RPC from double-broadcasting
        preflightCommitment: 'confirmed'
      });
      
      setStatus("Confirming on network...");
      await connection.confirmTransaction(signature, 'confirmed');
      
      setStatus(`Success! Bounty claimed. Signature: ${signature.slice(0, 8)}...`);
    } catch (error: any) {
      console.error("Claim Execution Error:", error);
      
      let errMsg = error.message || "Transaction rejected or failed.";
      if (error.logs) {
        console.error("Simulation Logs:", error.logs);
        errMsg = "Transaction failed simulation. Check console.";
      }
      
      setStatus(`Error: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full border border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
        
        {/* Visual Header */}
        <div className="p-8 flex flex-col items-center border-b border-slate-800">
          {metadata?.icon ? (
            <img src={metadata.icon} alt="Avatar" className="w-16 h-16 rounded-full mb-4 shadow-lg border border-slate-700" />
          ) : (
            <div className="w-16 h-16 rounded-full mb-4 bg-slate-800 animate-pulse" />
          )}
          <h1 className="text-xl font-bold">{metadata ? metadata.title : "SOLUX Vault"}</h1>
          <p className="text-slate-400 text-sm text-center mt-2 break-words">
            {metadata ? metadata.description : status}
          </p>
        </div>

        {/* Action Area */}
        <div className="p-6 flex flex-col gap-4 bg-slate-950/50">
          <div className="flex justify-center">
            {/* Hydration safe rendering */}
            {mounted ? (
               <WalletMultiButton className="!bg-purple-600 !h-10 !text-xs !rounded-md hover:!bg-purple-700 transition" />
            ) : (
               <div className="h-10 w-32 bg-slate-800 rounded-md animate-pulse" />
            )}
          </div>

          {metadata && !metadata.disabled && publicKey && (
            <button
              onClick={executeClaim}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-md font-bold text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all text-white shadow-lg shadow-green-900/20"
            >
              {loading ? "Processing..." : metadata.label}
            </button>
          )}

          {status && status !== "Loading bounty data..." && status !== "" && (
            <div className="text-center text-[10px] font-mono text-slate-400 mt-2 p-2 bg-slate-900 rounded border border-slate-800 break-words">
              {status}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}