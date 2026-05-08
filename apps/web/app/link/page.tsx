'use client';

import { Suspense, useState, useSyncExternalStore } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FolderGit2, Wallet, Link as LinkIcon, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import Image from 'next/image';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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

  const handleLinkIdentity = async () => {
    if (!githubIdFromUrl || !publicKey || !sessionUser) return;

    if (sessionUser.id !== githubIdFromUrl) {
      setStatus({ type: 'error', msg: `Security Violation: Logged in as @${sessionUser.username}, but linking ID ${githubIdFromUrl}.` });
      return; 
    }

    setLoading(true);
    setStatus({ type: null, msg: "" });

    try {
      const oracleUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const payload = {
        githubId: githubIdFromUrl,
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

  return (
    <div className="flex min-h-screen w-full bg-[#000000] text-zinc-100 font-nocturn-regular selection:bg-zinc-800 selection:text-white items-center justify-center relative overflow-hidden">
      
      {/* 🌌 FULL SCREEN DOT BACKGROUND (Shadcn Style) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.04] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] pointer-events-none" />

      {/* 🔙 BACK BUTTON */}
      <Link 
        href="/"
        className="absolute top-6 left-6 sm:top-10 sm:left-10 z-50 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-all group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover:-translate-x-1"
        >
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back
      </Link>

      {/* 📦 THE CONTAINER (Minimalist Monochrome Card) */}
      <div className="w-full max-w-[420px] relative z-10 flex flex-col items-center bg-[#0a0a0a]/90 backdrop-blur-md border border-white/20 p-8 sm:p-10 rounded-2xl shadow-2xl">
        
        {/* 🤝 CUSTOMIZED Animated Handshake (Lottie) */}
        <div 
          className="w-32 h-32 -mt-10 mb-2 opacity-80 transition-opacity hover:opacity-100"
          style={{
            // You can customize the handshake colors here if the Lottie supports it
            '--lottie-color-1': '#ffffff',
            '--lottie-color-2': '#a1a1aa',
          } as React.CSSProperties}
        >
          <DotLottieReact 
            // 🚨 REPLACE THIS URL with your actual Handshake Lottie JSON URL from LottieFiles
            src="https://lottie.host/your-handshake-lottie-url.json" 
            loop 
            autoplay 
          />
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-1 mb-8 opacity-90">
          <Image 
            src="/logo-orange.svg" 
            alt="SOLUX" 
            width={24} 
            height={24} 
            priority 
            className="opacity-90" 
          />
          <span className="text-xl font-bold tracking-tight text-white">
            SOLUX
          </span>
        </div>

        {/* Quiet Typography */}
        <div className="text-center mb-10 w-full">
          <h1 className="text-2xl font-medium tracking-tight mb-2 text-white">Identity Bridge</h1>
          <p className="text-zinc-500 text-sm font-normal">
            Connect your developer profile to 
          </p>
          <p className="text-zinc-500 text-sm font-normal">
            your settlement address.
          </p>
        </div>

        {/* 🛠 THE STEPS */}
        <div className="space-y-4 mb-8 w-full">
          
          {/* Step 1: GitHub */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-800/80 bg-[#050505] transition-colors hover:border-zinc-700/80">
            <div className="flex items-center gap-3">
              <div className={`text-zinc-400 ${session ? 'text-white' : ''}`}>
                <FolderGit2 size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-zinc-500 tracking-wider uppercase mb-0.5">Step 1</span>
                <span className={`text-sm font-medium ${session ? 'text-white' : 'text-zinc-400'}`}>
                  {sessionUser ? `@${sessionUser.username}` : "GitHub Account"}
                </span>
              </div>
            </div>
            
            {!session ? (
              <button 
                onClick={() => signIn("github")} 
                className="text-xs hover:bg-persimmon hover:text-white hover:duration-300 bg-white text-black px-4 py-2 rounded-md font-medium transition-colors active:scale-95"
              >
                Connect
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-white opacity-80" />
                <button 
                  onClick={() => signOut()} 
                  className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Wallet */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-800/80 bg-[#050505] transition-colors hover:border-zinc-700/80">
            <div className="flex items-center gap-3">
              <div className={`text-zinc-400 ${publicKey ? 'text-white' : ''}`}>
                <Wallet size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-zinc-500 tracking-wider uppercase mb-0.5">Step 2</span>
                <span className={`text-sm font-medium ${publicKey ? 'text-white' : 'text-zinc-400'}`}>
                  {publicKey ? "Wallet Linked" : "Solana Wallet"}
                </span>
              </div>
            </div>
            
            <div className="relative z-50">
              {walletUiReady && (
                <WalletMultiButton 
                  className={`!bg-white !text-black hover:!bg-persimmon hover:!text-white hover:!duration-300 !h-8 !px-4 !rounded-md !font-medium !text-xs !transition-all !duration-200 active:!scale-95 shadow-none ${publicKey ? '!bg-transparent !text-zinc-500 border !border-zinc-800 hover:!text-white hover:!bg-zinc-900' : ''}`} 
                >
                  {publicKey ? publicKey.toBase58().slice(0, 4) + '...' + publicKey.toBase58().slice(-4) : 'Connect'}
                </WalletMultiButton>
              )}
            </div>
          </div>
        </div>

        {/* ✨ ACTION AREA */}
        <div className="w-full">
          {status.type === 'success' && claimIdFromUrl ? (
            <Link 
              href={`/claim/${claimIdFromUrl}`} 
              className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black rounded-lg font-medium text-sm transition-all duration-300 hover:bg-[#fc4c02] hover:text-white hover:shadow-[0_0_20px_rgba(252,76,2,0.3)] active:scale-90"
            >
              Proceed to Settlement <ArrowRight size={16} />
            </Link>
          ) : (
            <button
              disabled={!session || !publicKey || !githubIdFromUrl || loading || status.type === 'success'}
              onClick={handleLinkIdentity}
              className="group w-full flex items-center justify-center gap-2 bg-white text-black py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 hover:bg-[#fc4c02] hover:text-white hover:shadow-[0_0_20px_rgba(252,76,2,0.3)] active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black disabled:hover:shadow-none disabled:active:scale-100"
            >
              {loading ? "Anchoring Data..." : <><LinkIcon size={16} /> Finalize Connection</>}
            </button>
          )}

          {/* Status Messages */}
          {status.msg && (
            <div className={`mt-4 flex items-start gap-2.5 p-3 rounded-lg text-xs font-mono border ${
              status.type === 'success' ? "bg-zinc-900/50 border-zinc-800 text-zinc-300" : "bg-red-950/20 border-red-900/30 text-red-400"
            }`}>
              {status.type === 'success' ? <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" /> : <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />}
              <span className="leading-relaxed">{status.msg}</span>
            </div>
          )}

          {/* 📝 Notice Block */}
          <div className="mt-5 p-3.5 rounded-lg bg-zinc-900/40 border border-zinc-800/50">
            <p className="text-[11px] text-zinc-400 leading-relaxed text-center">
              <strong className="text-zinc-300 font-medium">Notice:</strong> You can change your wallet at any time by re-linking it if you lose access or prefer to receive funds in a different wallet.
            </p>
          </div>
        </div>

        {/* Ghost Footer */}
        <div className="mt-8 text-center w-full">
          <p className="text-[10px] font-mono text-zinc-600 tracking-[0.15em] uppercase">
            Powered by <a className="text-[#9945FF] opacity-100 cursor-pointer hover:text-white transition-colors">SOLANA</a>
          </p>
        </div>

      </div>
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