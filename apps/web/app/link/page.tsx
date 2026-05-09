'use client';

import { Suspense, useState, useEffect, useSyncExternalStore } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FolderGit2, Wallet, Link as LinkIcon, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import Image from 'next/image';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, AnimatePresence } from 'framer-motion';

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function LinkContent() {
  const { data: session } = useSession();
  const { publicKey } = useWallet();
  const searchParams = useSearchParams();
  const walletUiReady = useIsClient();

  const githubIdFromUrl = searchParams.get("githubId");
  const claimIdFromUrl = searchParams.get("claimId"); 
  
  const sessionUser = session?.user as { id?: string; name?: string; image?: string; username?: string };
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; msg: string }>({ type: null, msg: "" });

  // Fallback to session ID if URL parameter is missing
  const activeGithubId = githubIdFromUrl || sessionUser?.id;

  // 🔄 THE FIX: Reset status when wallet changes so "Finalize" button unlocks for updates
  useEffect(() => {
    if (status.type === 'success' || status.type === 'error') {
      setStatus({ type: null, msg: "" });
    }
  }, [publicKey?.toBase58()]);

  const handleLinkIdentity = async () => {
    if (!activeGithubId || !publicKey || !sessionUser) return;

    if (githubIdFromUrl && sessionUser.id !== githubIdFromUrl) {
      setStatus({ type: 'error', msg: `Security Violation: Logged in as @${sessionUser.username}, but linking ID ${githubIdFromUrl}.` });
      return; 
    }

    setLoading(true);
    setStatus({ type: null, msg: "" });

    try {
      const oracleUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const payload = {
        githubId: activeGithubId,
        githubHandle: sessionUser.username || "Unknown",
        walletAddress: publicKey.toBase58(),
        avatarUrl: sessionUser.image || ""
      };

      const response = await axios.post(`${oracleUrl}/api/users/link`, payload);

      if (response.status === 201 || response.status === 200) {
        setStatus({ type: 'success', msg: `Identity Verified: GitHub @${payload.githubHandle} anchored to your wallet.` });
      }
    } catch (error: any) {
      setStatus({ type: 'error', msg: `Link Failed: ${error.response?.data?.message || "Check connection."}` });
    } finally {
      setLoading(false);
    }
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="flex min-h-[100svh] w-full bg-[#000000] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white items-center justify-center relative p-4 sm:p-8 overflow-y-auto no-scrollbar">
      
      {/* 🛡️ THE FIX: Global CSS to force the Wallet Dropdown to stay solid and on top */}
      <style jsx global>{`
        .wallet-adapter-dropdown {
          width: auto;
          display: flex;
        }
        .wallet-adapter-dropdown-list {
          background: #0f0f0f !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          border-radius: 16px !important;
          padding: 8px !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6) !important;
          z-index: 9999 !important;
          top: 45px !important;
          opacity: 1 !important;
        }
        .wallet-adapter-dropdown-list-item {
          background: transparent !important;
          color: #a1a1aa !important;
          font-family: inherit !important;
          font-size: 13px !important;
          padding: 10px 16px !important;
          border-radius: 10px !important;
          transition: all 0.2s ease !important;
        }
        .wallet-adapter-dropdown-list-item:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: white !important;
        }
      `}</style>

      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.04] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] pointer-events-none" />

      {/* 🔙 Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 z-50"
      >
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-all group p-2"
        >
          <ArrowRight className="rotate-180 transition-transform group-hover:-translate-x-1" size={18} />
          <span className="hidden sm:inline">Back to Dashboard</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </motion.div>

      {/* 📦 Main Card */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[420px] relative z-10 flex flex-col items-center bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 p-6 sm:p-10 rounded-[2.5rem] shadow-2xl mt-12 sm:mt-0"
      >
        
        {/* Animated Cat Header */}
        <motion.div variants={itemVariants} className="flex flex-col items-center w-full">
          <div className="w-36 h-36 -mt-12 mb-2 opacity-90 transition-opacity hover:opacity-100">
            <DotLottieReact 
              src="https://lottie.host/8cf4ba71-e5fb-44f3-8134-178c4d389417/0CCsdcgNIP.json" 
              loop 
              autoplay 
            />
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            <Image src="/logo-orange.svg" alt="SOLUX" width={22} height={22} priority />
            <span className="text-xl font-bold tracking-tighter text-white">SOLUX</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mb-10 w-full">
          <h1 className="text-2xl font-bold tracking-tight mb-2 text-white">Identity Bridge</h1>
          <p className="text-zinc-500 text-sm">Link GitHub to your settlement address.</p>
        </motion.div>

        {/* 🛠 Steps */}
        <motion.div variants={itemVariants} className="space-y-4 mb-10 w-full">
          
          {/* Step 1: GitHub */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3 overflow-hidden pr-2">
              <FolderGit2 size={18} className={session ? 'text-white' : 'text-zinc-500'} />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Step 1</span>
                <span className="text-sm font-bold truncate">{sessionUser ? `@${sessionUser.username}` : "Connect GitHub"}</span>
              </div>
            </div>
            {!session && (
              <button onClick={() => signIn("github")} className="text-xs bg-white text-black px-4 py-2 rounded-xl font-bold hover:bg-zinc-200 active:scale-95 transition-all">
                Connect
              </button>
            )}
          </div>

          {/* Step 2: Wallet */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors relative z-50">
            <div className="flex items-center gap-3 overflow-hidden pr-2">
              <Wallet size={18} className={publicKey ? 'text-white' : 'text-zinc-500'} />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Step 2</span>
                <span className="text-sm font-bold truncate">{publicKey ? "Wallet Ready" : "Solana Wallet"}</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              {walletUiReady && (
                <WalletMultiButton 
                  className={`!bg-white/5 !text-white !border !border-white/10 !h-9 !px-4 !rounded-xl !text-xs !font-bold transition-all shadow-none ${!publicKey ? '!bg-white !text-black' : ''}`} 
                />
              )}
            </div>
          </div>
        </motion.div>

        {/* 🎬 Action Area */}
        <motion.div variants={itemVariants} className="w-full relative z-10">
          {status.type === 'success' && claimIdFromUrl ? (
            <Link 
              href={`/claim/${claimIdFromUrl}`} 
              className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-persimmon hover:text-white transition-all duration-300 shadow-[0_0_30px_rgba(252,76,2,0.2)] active:scale-95"
            >
              Go to Payout <ArrowRight size={16} />
            </Link>
          ) : (
            <button
              disabled={!session || !publicKey || !activeGithubId || loading || status.type === 'success'}
              onClick={handleLinkIdentity}
              className="w-full py-4 bg-white text-black rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-persimmon hover:text-white transition-all duration-300 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed group"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? "Anchoring..." : status.type === 'success' ? <><CheckCircle2 size={18} /> Verified</> : <><LinkIcon size={18} /> Finalize Connection</>}
              </span>
            </button>
          )}

          <AnimatePresence>
            {status.msg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className={`mt-4 p-4 rounded-2xl text-xs font-mono border overflow-hidden ${
                  status.type === 'success' ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-red-500/5 border-red-500/20 text-red-400"
                }`}
              >
                <div className="flex items-start gap-2">
                  {status.type === 'success' ? <CheckCircle2 size={14} className="mt-0.5" /> : <AlertCircle size={14} className="mt-0.5" />}
                  <span className="leading-relaxed">{status.msg}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <p className="text-[11px] text-zinc-400 leading-relaxed text-center">
              <strong className="text-[#fc4c02]">Update Tip:</strong> To change your settlement address, simply connect a different wallet and click Finalize again.
            </p>
          </div>
        </motion.div>

        {/* Ghost Footer */}
        <motion.div variants={itemVariants} className="mt-8 text-center w-full">
          <p className="text-[10px] font-mono text-zinc-600 tracking-[0.2em] uppercase">
            Powered by <span className="text-[#9945FF]">SOLANA</span>
          </p>
        </motion.div>

      </motion.div>
    </div>
  );
}

export default function LinkAccountPage() {
  return (
    <Suspense fallback={<div className="bg-black min-h-screen" />}>
      <LinkContent />
    </Suspense>
  );
}