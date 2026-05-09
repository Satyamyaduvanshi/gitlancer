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

  const activeGithubId = githubIdFromUrl || sessionUser?.id;

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
        setStatus({ type: 'success', msg: `Identity Verified: @${payload.githubHandle} linked to ${payload.walletAddress.slice(0, 4)}...${payload.walletAddress.slice(-4)}` });
      }
    } catch (error: any) {
      setStatus({ type: 'error', msg: `Link Failed: ${error.response?.data?.message || "Check connection."}` });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)', 
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <div className="flex min-h-[100svh] w-full bg-[#000000] text-zinc-100 font-nocturn-regular selection:bg-zinc-800 selection:text-white items-center justify-center relative p-4 sm:p-8">
      

      <style jsx global>{`
        .wallet-adapter-dropdown-list {
          background: #0a0a0a !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4) !important;
          z-index: 9999 !important;
          top: 40px !important;
        }
        .wallet-adapter-dropdown-list-item {
          color: #a1a1aa !important;
          font-size: 13px !important;
          font-weight: 500 !important;
        }
        .wallet-adapter-dropdown-list-item:hover {
          background: rgba(255,255,255,0.05) !important;
          color: white !important;
        }
      `}</style>

      <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.04] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 z-50"
      >
        <Link 
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-all group p-2 -ml-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span className="hidden sm:inline">Back</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[420px] relative z-10 flex flex-col items-center bg-[#0a0a0a]/90 backdrop-blur-md border border-white/20 p-6 sm:p-10 rounded-3xl shadow-2xl mt-8 sm:mt-0"
      >
        <motion.div variants={itemVariants} className="flex flex-col items-center w-full">
          <div className="w-32 h-32 -mt-6 mb-2 opacity-90 transition-opacity hover:opacity-100">
            <DotLottieReact 
              src="https://lottie.host/8cf4ba71-e5fb-44f3-8134-178c4d389417/0CCsdcgNIP.json" 
              loop 
              autoplay 
            />
          </div>

          <div className="flex items-center justify-center gap-1.5 mb-6 sm:mb-8 opacity-90">
            <Image src="/logo-orange.svg" alt="SOLUX" width={22} height={22} priority className="opacity-90 sm:w-[24px] sm:h-[24px]" />
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white">SOLUX</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-10 w-full">
          <h1 className="text-xl sm:text-2xl font-medium tracking-tight mb-2 text-white">Identity Bridge</h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-normal">Link GitHub to your settlement wallet.</p>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4 mb-8 w-full">
          <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-zinc-800/80 bg-[#050505] transition-colors hover:border-zinc-700/80">
            <div className="flex items-center gap-3 overflow-hidden pr-2">
              <div className={`text-zinc-400 flex-shrink-0 ${session ? 'text-white' : ''}`}>
                <FolderGit2 size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] sm:text-xs font-mono text-zinc-500 tracking-wider uppercase mb-0.5">Step 1</span>
                <span className={`text-xs sm:text-sm font-medium truncate ${session ? 'text-white' : 'text-zinc-400'}`}>
                  {sessionUser ? `@${sessionUser.username}` : "GitHub Account"}
                </span>
              </div>
            </div>
            
            {!session ? (
              <button onClick={() => signIn("github")} className="text-[11px] sm:text-xs bg-white text-black px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors active:scale-95 flex-shrink-0">
                Connect
              </button>
            ) : (
              <button onClick={() => signOut()} className="text-[11px] sm:text-xs text-zinc-500 hover:text-red-400 transition-colors">
                Disconnect
              </button>
            )}
          </div>

          <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-zinc-800/80 bg-[#050505] transition-colors hover:border-zinc-700/80 overflow-visible">
            <div className="flex items-center gap-3 overflow-hidden pr-2">
              <div className={`text-zinc-400 flex-shrink-0 ${publicKey ? 'text-white' : ''}`}>
                <Wallet size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] sm:text-xs font-mono text-zinc-500 tracking-wider uppercase mb-0.5">Step 2</span>
                <span className={`text-xs sm:text-sm font-medium truncate ${publicKey ? 'text-white' : 'text-zinc-400'}`}>
                  {publicKey ? "Wallet Linked" : "Solana Wallet"}
                </span>
              </div>
            </div>
            
            <div className="relative flex-shrink-0">
              {walletUiReady && (
                <WalletMultiButton 
                  className={`!bg-white !text-black hover:!bg-zinc-200 !h-8 !px-3 sm:!px-4 !rounded-lg !font-medium !text-[11px] sm:!text-xs !transition-all !duration-200 shadow-none ${publicKey ? '!bg-white/5 !text-zinc-300 border !border-white/10 hover:!bg-white/10' : ''}`} 
                />
              )}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          {status.type === 'success' && claimIdFromUrl ? (
            <Link 
              href={`/claim/${claimIdFromUrl}`} 
              className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-white text-black rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 hover:bg-[#fc4c02] hover:text-white hover:shadow-[0_0_20px_rgba(252,76,2,0.3)] active:scale-95"
            >
              Proceed to Settlement <ArrowRight size={16} />
            </Link>
          ) : (
            <button
              disabled={!session || !publicKey || !activeGithubId || loading || status.type === 'success'}
              onClick={handleLinkIdentity}
              className="group w-full flex items-center justify-center gap-2 bg-white text-black py-3 sm:py-3.5 px-4 rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 hover:bg-[#fc4c02] hover:text-white hover:shadow-[0_0_20px_rgba(252,76,2,0.3)] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? "Anchoring Data..." : status.type === 'success' ? <><CheckCircle2 size={16} /> Wallet Linked</> : <><LinkIcon size={16} /> Finalize Connection</>}
            </button>
          )}

          <AnimatePresence>
            {status.msg && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className={`mt-4 flex items-start gap-2.5 p-3 rounded-xl text-[11px] sm:text-xs font-mono border overflow-hidden ${
                  status.type === 'success' ? "bg-zinc-900/50 border-zinc-800 text-zinc-300" : "bg-red-950/20 border-red-900/30 text-red-400"
                }`}
              >
                {status.type === 'success' ? <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" /> : <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />}
                <span className="leading-relaxed">{status.msg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 sm:mt-5 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-relaxed text-center">
              <strong className="text-[#fc4c02] font-semibold tracking-wide">Update Wallet:</strong> Simply connect a different wallet and click Finalize to update your settlement address.
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6 sm:mt-8 text-center w-full">
          <p className="text-[9px] sm:text-[10px] font-mono text-zinc-600 tracking-[0.15em] uppercase">
            Powered by <a className="text-[#9945FF] opacity-100 cursor-pointer hover:text-white transition-colors">SOLANA</a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function LinkAccountPage() {
  return (
    <Suspense fallback={<div className="bg-[#000000] min-h-screen" />}>
      <LinkContent />
    </Suspense>
  );
}