'use client';

import { useState, useEffect, use, useMemo } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import axios from "axios";
import { HandCoins, ShieldCheck, Code2, ArrowUpRight, User, HelpCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function NativeClaimPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
  
  const [metadata, setMetadata] = useState<any>(null);
  const [status, setStatus] = useState("Loading bounty data...");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false); 
  const [isSuccess, setIsSuccess] = useState(false); 

  const { data: userBounties, isLoading: bountiesLoading } = useSWR(userId ? `${API_URL}/api/bounties/user/${userId}` : null, fetcher);

  // 🛡️ UPGRADED: Added b.amount > 0 to filter out 0 USDC rejected PRs
  const { totalEarned, pendingBounties } = useMemo(() => {
    if (!userBounties) return { totalEarned: 0, pendingBounties: [] };
    
    const earned = userBounties
      .filter((b: any) => b.status === 'CLAIMED')
      .reduce((sum: number, b: any) => sum + b.amount, 0);
      
    const pending = userBounties
      .filter((b: any) => (b.status === 'AUDITED' || b.status === 'PENDING_APPROVAL') && b.amount > 0);

    return { totalEarned: earned, pendingBounties: pending };
  }, [userBounties]);

  const pendingCount = pendingBounties.length;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    async function fetchMetadata() {
      try {
        const res = await axios.get(`${API_URL}/api/actions/claim/${id}`);
        setMetadata(res.data);
        setStatus(""); 
      } catch (error: any) {
        setStatus(error.response?.data?.message || "Failed to load bounty. It may have already been claimed.");
      }
    }
    fetchMetadata();
  }, [id]);

  const executeClaim = async () => {
    if (!publicKey || !signTransaction) {
      setStatus("Error: Connect a wallet that supports manual signing.");
      return;
    }
    setLoading(true);
    setStatus("Generating secure transaction...");

    try {
      const res = await axios.post(`${API_URL}/api/actions/claim/${id}/execute`, { account: publicKey.toBase58() });
      setStatus("Please approve the transaction in your wallet...");
      
      const txBuffer = Buffer.from(res.data.transaction, 'base64');
      const transaction = Transaction.from(txBuffer);
      const signedTx = await signTransaction(transaction);
      
      setStatus("Broadcasting to Solana network...");
      const signature = await connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: false, maxRetries: 3, preflightCommitment: 'confirmed' });
      
      setStatus("Confirming blocks...");
      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');
      
      setStatus(`🎉 Success! Funds settled. Signature: ${signature.slice(0, 8)}...`);
      setIsSuccess(true); 
      
    } catch (error: any) {
      let errMsg = error.message || "Transaction rejected or failed.";
      if (errMsg.includes("0x1")) errMsg = "Insufficient SOL for gas. Make sure your wallet has at least 0.01 SOL.";
      else if (errMsg.includes("insufficient funds") && !errMsg.includes("0x1")) errMsg = "The Maintainer's Vault does not have enough USDC.";
      setStatus(`❌ Error: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const needsToLink = status.toLowerCase().includes("not linked") || status.toLowerCase().includes("unregistered");

  return (
    <main className="flex flex-col min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-persimmon/30 relative overflow-hidden ">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Top Navigation */}
      <nav className="w-full p-6 flex items-center justify-between relative z-20 animate-in fade-in slide-in-from-top-4 duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]">
        <Link href="/" className="px-2 flex items-center gap-3 group">
          <Image 
            src="/logo-orange.svg" 
            alt="Official SOLUX Logo" 
            width={28} 
            height={28} 
            priority 
            className="flex-shrink-0 transition-transform duration-500 group-hover:scale-110"
          />
          <span className="text-2xl font-bold tracking-tighter text-white">
            SOLUX<span className="text-persimmon">.</span>
          </span>
        </Link>
        
        {session && (
          <div className="flex items-center gap-3 group cursor-pointer">
             <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/10 transition-all duration-300 group-hover:border-persimmon/50 group-hover:shadow-[0_0_15px_rgba(252,76,2,0.3)]">
                <Image 
                  src={(session?.user as any)?.image || "https://github.com/github.png"} 
                  alt="User" 
                  fill 
                  className="object-cover" 
                />
             </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10 w-full">
        
        {/* 🌟 Unified Dashboard Container 🌟 */}
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-5 gap-6 p-3 rounded-[2.5rem] bg-black/20 border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]">
          
          {/* 🚀 LEFT COLUMN: The Action Card */}
          <div className="md:col-span-3 bg-[#111111] rounded-[2rem] border border-white/5 shadow-2xl relative transform transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden">
            
            {/* TEXTURED HEADER SECTION */}
            <div className="relative p-10 flex flex-col items-center border-b border-white/5 rounded-t-[2rem]">
              
              <Image 
                src="/gback.jpg" 
                alt="Vault Banner Background" 
                fill 
                className="object-cover opacity-40 mix-blend-screen pointer-events-none" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-persimmon/80 to-orange-400/80" />
              
              <div className="relative z-10 flex flex-col items-center transform transition-transform duration-700 hover:scale-105">
                <div className="relative w-24 h-24 rounded-full mb-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-4 border-[#111111] overflow-hidden bg-black transition-all duration-500 hover:border-persimmon/50">
                  <Image 
                    src={metadata?.icon || "https://github.com/github.png"} 
                    alt="Repo Avatar" 
                    fill
                    className={`object-cover ${!metadata ? 'animate-pulse opacity-50' : ''}`} 
                  />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-center text-white drop-shadow-md">
                  {metadata ? metadata.title : "SOLUX Vault Settlement"}
                </h1>
                <p className="text-white/60 text-sm text-center mt-2 max-w-md drop-shadow-sm font-medium">
                  {metadata ? metadata.description : status}
                </p>
              </div>
            </div>

            <div className="p-10 flex flex-col gap-6 relative z-10 bg-[#111111]">
              
              {needsToLink ? (
                <div className="flex flex-col items-center gap-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <p className="text-sm font-medium text-white/80">First time claiming? Securely link your GitHub account to your Solana wallet to proceed.</p>
                  <Link href={`/link?claimId=${id}`} className="py-3.5 px-8 bg-white text-black rounded-xl font-bold text-sm uppercase tracking-widest hover:opacity-90 hover:scale-105 transition-all shadow-lg active:scale-95">
                    Set Up Identity Bridge
                  </Link>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 relative z-50 transition-colors hover:bg-white/10 hover:border-white/10">
                    <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Settlement Address</span>
                    {mounted ? (
                      <WalletMultiButton className="!bg-[#222222] hover:!bg-persimmon !text-white !h-9 !text-xs !rounded-xl transition-all duration-300 shadow-none" />
                    ) : (
                      <div className="h-9 w-32 bg-white/10 rounded-xl animate-pulse" />
                    )}
                  </div>

                  {/* 🔄 Change Wallet Link */}
                  {mounted && publicKey && !isSuccess && (
                    <div className="flex justify-end mt-2">
                       <Link href={`/link?claimId=${id}`} className="text-[10px] font-mono text-white/40 hover:text-persimmon transition-colors flex items-center gap-1 group">
                         Need to change payout wallet? <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                       </Link>
                    </div>
                  )}

                  {metadata && !metadata.disabled && !isSuccess && publicKey && (
                    <button
                      onClick={executeClaim}
                      disabled={loading}
                      className="w-full mt-6 py-4 bg-persimmon rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-orange-500 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300 text-white shadow-lg shadow-persimmon/20 hover:shadow-persimmon/40 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 group relative z-10 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                      <span className="relative z-10 flex items-center gap-2">
                        {loading ? "Signing Transaction..." : <><HandCoins size={18} className="group-hover:-translate-y-0.5 transition-transform" /> {metadata.label}</>}
                      </span>
                    </button>
                  )}
                </div>
              )}

              {status && status !== "Loading bounty data..." && status !== "" && !needsToLink && (
                <div className={`text-center text-xs font-mono p-4 rounded-xl border break-words animate-in fade-in slide-in-from-top-2 relative z-10 transition-all duration-500 ${
                  isSuccess ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-white/5 border-white/10 text-white/70'
                }`}>
                  {status}
                </div>
              )}
            </div>
          </div>

          {/* 📊 RIGHT COLUMN: Contributor Profile & Pending List */}
          <div className="md:col-span-2 flex flex-col gap-6">
            
            <div className="bg-persimmon/40 rounded-[2rem] border border-black/20 shadow-2xl p-8 flex flex-col justify-between group transition-all duration-500 hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"><ShieldCheck size={20} /></div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover:text-white/60 transition-colors">Verified Earnings</p>
              </div>
              <div>
                {bountiesLoading ? (
                  <div className="h-12 w-24 bg-white/5 animate-pulse rounded-lg mb-1" />
                ) : (
                  <h2 className="text-5xl font-bold text-white flex items-baseline gap-2 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-teal-300 transition-all duration-500">
                    {totalEarned} <span className="text-sm text-white/40 font-mono tracking-normal">USDC</span>
                  </h2>
                )}
                <p className="text-sm text-white/50 mt-2 font-medium">Total lifetime payouts via SOLUX.</p>
              </div>
            </div>

            <div className={`bg-[#111111] rounded-[2rem] border border-white/5 shadow-2xl p-8 flex flex-col justify-between group transition-all duration-500 hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1 ${pendingBounties.length > 0 ? '' : 'flex-1'}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"><Code2 size={20} /></div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover:text-white/60 transition-colors">Pending Work</p>
              </div>
              <div>
                 {bountiesLoading ? (
                  <div className="h-12 w-16 bg-white/5 animate-pulse rounded-lg mb-1" />
                ) : (
                  <h2 className="text-5xl font-bold text-white mb-1 tracking-tight group-hover:text-amber-400 transition-colors duration-500">{pendingCount}</h2>
                )}
                <p className="text-sm text-white/50 mt-2 font-medium">PRs awaiting audit or settlement.</p>
              </div>

              {!session && (
                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between group/link cursor-pointer">
                   <div className="flex items-center gap-2 text-xs font-medium text-white/50 group-hover/link:text-white transition-colors">
                      <User size={14} className="group-hover/link:text-persimmon transition-colors" /> Connect to see stats 
                   </div>
                   <ArrowUpRight size={14} className="text-white/30 group-hover/link:text-white group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
                </div>
              )}
            </div>

            {/* 📋 NEW: Pending PRs List (Only shows if there are actual PRs > 0 USDC) */}
            {pendingBounties.length > 0 && (
              <div className="bg-[#111111] rounded-[2rem] border border-white/5 shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 overflow-hidden flex-1">
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" /> Action Required
                </h3>
                <div className="flex flex-col gap-3 overflow-y-auto pr-2">
                  {pendingBounties.map((bounty: any) => (
                    <div key={bounty.id} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors group/item">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white group-hover/item:text-amber-400 transition-colors">
                          {bounty.vault?.repositoryFullName?.split('/')[1] || 'Repository'}
                        </span>
                        <Link 
                          href={`https://github.com/${bounty.vault?.repositoryFullName}/pull/${bounty.prId}`} 
                          target="_blank" 
                          className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1 w-fit"
                        >
                          PR #{bounty.prId} <ArrowUpRight size={10} />
                        </Link>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-persimmon">{bounty.amount}</span>
                        <span className="text-[10px] text-white/40 ml-1">USDC</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* ❓ Help Button (Bottom Right) */}
      <button className="fixed bottom-6 right-6 p-3 bg-[#111111] border border-white/10 rounded-full text-persimmon hover:text-white hover:border-white/30 transition-all duration-300 z-50 group shadow-lg">
         <HelpCircle size={20} className="group-hover:scale-110 transition-transform" />
      </button>

    </main>
  );
}