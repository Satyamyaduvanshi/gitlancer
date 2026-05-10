'use client';

import { useState, useEffect, use, useMemo } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HandCoins, 
  ShieldCheck, 
  Code2, 
  ArrowUpRight, 
  User, 
  HelpCircle, 
  CheckCircle2, 
  ChevronRight, 
  Info, 
  AlertTriangle 
} from "lucide-react";

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
      
      setStatus(`Success! Funds settled. Signature: ${signature.slice(0, 8)}...`);
      setIsSuccess(true); 
      
    } catch (error: any) {
      let errMsg = error.message || "Transaction rejected or failed.";
      if (errMsg.includes("0x1")) errMsg = "Insufficient SOL for gas. Make sure your wallet has at least 0.01 SOL.";
      else if (errMsg.includes("insufficient funds") && !errMsg.includes("0x1")) errMsg = "The Maintainer's Vault does not have enough USDC.";
      setStatus(`Error: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const needsToLink = status.toLowerCase().includes("not linked") || status.toLowerCase().includes("unregistered");

  // --- 🎬 FRAMER MOTION ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <main className="flex flex-col min-h-screen bg-[#000000] text-zinc-100 font-sans selection:bg-persimmon/30 relative overflow-hidden">
      
      {/* 🌌 Premium Background Effects */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.02] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-persimmon/10 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* 🎬 Master Animation Container */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex-1 flex flex-col relative z-10">
        
        {/* Top Navigation */}
        <motion.nav variants={itemVariants} className="w-full px-8 py-6 flex items-center justify-between relative z-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-white/5 p-2 rounded-xl border border-white/5 group-hover:bg-white/10 transition-colors">
              <Image src="/logo-orange.svg" alt="SOLUX Logo" width={20} height={20} priority className="transition-transform duration-500 group-hover:scale-110" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">SOLUX</span>
          </Link>
          
          {session && (
            <div className="flex items-center gap-3 group cursor-pointer">
               <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 transition-all duration-300 group-hover:border-persimmon/50 shadow-lg">
                  <Image src={(session?.user as any)?.image || "https://github.com/github.png"} alt="User" fill className="object-cover" />
               </div>
            </div>
          )}
        </motion.nav>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 w-full">
          
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* 🚀 LEFT COLUMN: The Action Card (Larger) */}
            <motion.div variants={itemVariants} className="lg:col-span-7 bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
              
              {/* Premium Header Banner */}
              <div className="relative h-48 w-full bg-zinc-900">
                <Image 
                  src="/gback.jpg" 
                  alt="Vault Banner" 
                  fill 
                  className="object-cover opacity-30 mix-blend-screen pointer-events-none [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]" 
                />
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-persimmon via-orange-400 to-transparent opacity-80" />
              </div>

              {/* Overlapping Avatar & Content */}
              <div className="px-8 pb-10 relative">
                <div className="flex flex-col items-center -mt-16 mb-6">
                  <div className="relative w-28 h-28 rounded-3xl shadow-[0_15px_30px_rgba(0,0,0,0.6)] border-4 border-[#0a0a0a] overflow-hidden bg-zinc-900 transition-all duration-500 hover:border-persimmon/50 hover:-translate-y-1">
                    <Image 
                      src={metadata?.icon || "https://github.com/github.png"} 
                      alt="Repo Avatar" 
                      fill
                      className={`object-cover ${!metadata ? 'animate-pulse opacity-50' : ''}`} 
                    />
                  </div>
                </div>

                <div className="text-center mb-10">
                  <h1 className="text-3xl font-black tracking-tight text-white mb-2">
                    {metadata ? metadata.title : "Vault Settlement"}
                  </h1>
                  <p className="text-zinc-400 text-sm max-w-sm mx-auto font-medium leading-relaxed">
                    {metadata ? metadata.description : status}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {needsToLink ? (
                    <motion.div key="link-state" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center gap-6">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <p className="text-sm font-medium text-zinc-300">Securely link your GitHub account to your Solana wallet to authenticate your identity.</p>
                      </div>
                      <Link href={`/link?claimId=${id}`} className="py-4 px-8 w-full text-center bg-white text-black rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95">
                        Set Up Identity Bridge
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div key="claim-state" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      
                      {/* Premium Wallet Display */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-black/40 p-4 rounded-2xl border border-white/5 shadow-inner gap-4">
                        <div>
                          <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Settlement Address</span>
                          {mounted && publicKey && !isSuccess ? (
                            <Link href={`/link?claimId=${id}`} className="text-xs font-medium text-zinc-400 hover:text-persimmon transition-colors flex items-center gap-1 group">
                              Change connected wallet <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                          ) : (
                            <span className="text-xs text-zinc-500">Awaiting connection...</span>
                          )}
                        </div>
                        {mounted ? (
                          <WalletMultiButton className="!bg-white/10 hover:!bg-white/20 !text-white !h-10 !text-xs !font-bold !rounded-xl transition-all duration-300 !px-6 shadow-none border border-white/5" />
                        ) : (
                          <div className="h-10 w-36 bg-white/5 rounded-xl animate-pulse" />
                        )}
                      </div>

                      {/* Main Claim Button */}
                      {metadata && !metadata.disabled && !isSuccess && publicKey && (
                        <button
                          onClick={executeClaim}
                          disabled={loading}
                          className="w-full mt-8 py-4 bg-gradient-to-r from-[#fc4c02] to-orange-500 rounded-2xl font-bold text-sm uppercase tracking-widest disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300 text-white shadow-[0_10px_40px_rgba(252,76,2,0.3)] hover:shadow-[0_15px_50px_rgba(252,76,2,0.5)] border border-orange-400/50 hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2 group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                          <span className="relative z-10 flex items-center gap-2">
                            {loading ? "Signing Transaction..." : <><HandCoins size={18} className="group-hover:-translate-y-0.5 transition-transform" /> {metadata.label}</>}
                          </span>
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Status Indicator */}
                <AnimatePresence>
                  {status && status !== "Loading bounty data..." && status !== "" && !needsToLink && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="mt-6 overflow-hidden"
                    >
                      <div className={`flex items-start gap-3 p-4 rounded-xl border text-sm relative z-10 transition-all duration-500 ${
                        isSuccess ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
                        status.includes('Error') ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-white/5 border-white/10 text-zinc-300'
                      }`}>
                        <div className="mt-0.5 shrink-0">
                          {isSuccess ? <CheckCircle2 size={16} /> : status.includes('Error') ? <AlertTriangle size={16} /> : <Info size={16} />}
                        </div>
                        <span className="leading-relaxed font-medium break-words">{status}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* 📊 RIGHT COLUMN: Stats & Pending */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Card 1: Verified Earnings */}
              <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#161616] to-[#0a0a0a] rounded-[2rem] border border-white/5 shadow-xl p-8 flex flex-col justify-between group transition-all duration-500 hover:border-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                <div className="flex items-center justify-between mb-8">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 transition-transform duration-500 group-hover:scale-110"><ShieldCheck size={20} /></div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Verified Earnings</p>
                </div>
                <div>
                  {bountiesLoading ? (
                    <div className="h-12 w-32 bg-white/5 animate-pulse rounded-xl mb-1" />
                  ) : (
                    <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 flex items-baseline gap-2 tracking-tight group-hover:from-emerald-400 group-hover:to-teal-200 transition-all duration-500">
                      {totalEarned} <span className="text-base text-zinc-600 font-mono tracking-normal">USDC</span>
                    </h2>
                  )}
                  <p className="text-sm text-zinc-500 mt-3 font-medium">Total lifetime payouts securely settled via SOLUX.</p>
                </div>
              </motion.div>

              {/* Card 2: Pending Work */}
              <motion.div variants={itemVariants} className={`bg-gradient-to-br from-[#161616] to-[#0a0a0a] rounded-[2rem] border border-white/5 shadow-xl p-8 flex flex-col justify-between group transition-all duration-500 hover:border-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${pendingBounties.length > 0 ? '' : 'flex-1'}`}>
                <div className="flex items-center justify-between mb-8">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 transition-transform duration-500 group-hover:scale-110"><Code2 size={20} /></div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pending Work</p>
                </div>
                <div>
                   {bountiesLoading ? (
                    <div className="h-12 w-20 bg-white/5 animate-pulse rounded-xl mb-1" />
                  ) : (
                    <h2 className="text-5xl font-black text-white mb-1 tracking-tight group-hover:text-amber-400 transition-colors duration-500">{pendingCount}</h2>
                  )}
                  <p className="text-sm text-zinc-500 mt-3 font-medium">PRs currently awaiting AI audit or vault settlement.</p>
                </div>

                {!session && (
                  <div className="mt-8 pt-6 border-t border-white/5">
                     <Link href="/login" className="flex items-center justify-between text-xs font-medium text-zinc-500 hover:text-white transition-colors group/link bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5">
                        <span className="flex items-center gap-2"><User size={14} className="text-zinc-400 group-hover/link:text-persimmon" /> Connect to see full stats</span>
                        <ChevronRight size={14} className="text-zinc-600 group-hover/link:text-white group-hover/link:translate-x-1 transition-all" />
                     </Link>
                  </div>
                )}
              </motion.div>

              {/* 📋 Card 3: Pending PRs List */}
              {pendingBounties.length > 0 && (
                <motion.div variants={itemVariants} className="bg-white/[0.02] backdrop-blur-xl rounded-[2rem] border border-white/5 shadow-xl p-6 flex flex-col gap-4 overflow-hidden flex-1">
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 pl-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]" /> Action Required
                  </h3>
                  <div className="flex flex-col gap-2 overflow-y-auto pr-1">
                    {pendingBounties.map((bounty: any) => (
                      <div key={bounty.id} className="flex justify-between items-center p-4 rounded-2xl bg-black/40 border border-white/5 hover:bg-white/5 transition-colors group/item">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-zinc-200 group-hover/item:text-amber-400 transition-colors">
                            {bounty.vault?.repositoryFullName?.split('/')[1] || 'Repository'}
                          </span>
                          <Link 
                            href={`https://github.com/${bounty.vault?.repositoryFullName}/pull/${bounty.prId}`} 
                            target="_blank" 
                            className="text-[11px] font-medium text-zinc-500 hover:text-white transition-colors flex items-center gap-1 w-fit"
                          >
                            Pull Request #{bounty.prId} <ArrowUpRight size={12} />
                          </Link>
                        </div>
                        <div className="text-right bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                          <span className="text-sm font-black text-persimmon">{bounty.amount}</span>
                          <span className="text-[10px] text-zinc-500 ml-1 font-bold">USDC</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            </div>

          </div>
        </div>

        {/* ❓ Help Button */}
        <motion.a 
          variants={itemVariants} 
          href="/docs"
          target="_blank"
          className="fixed bottom-8 right-8 p-3.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 z-50 group shadow-2xl"
        >
           <HelpCircle size={20} className="group-hover:scale-110 transition-transform" />
        </motion.a>

      </motion.div>
    </main>
  );
}