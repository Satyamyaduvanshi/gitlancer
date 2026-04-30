'use client';

import { Suspense, useState, useSyncExternalStore } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FolderGit2, Wallet, Link as LinkIcon, CheckCircle, LogOut, ShieldCheck, AlertCircle, ArrowRight, HelpCircle } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import Image from 'next/image';

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
    <main className="flex flex-col min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-persimmon/30 relative overflow-hidden">
      
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
      <div className="flex-1 flex items-center justify-center p-4 relative z-10 w-full">
        
        {/* 🌟 Unified Dashboard Container 🌟 */}
        <div className="max-w-xl w-full p-2 rounded-[2.5rem] bg-black/20 border border-white/[0.02] shadow-[inset_0_0_80px_rgba(0,0,0,0.5)] backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]">
          
          <div className="w-full space-y-8 bg-[#111111] p-10 rounded-[2rem] border border-white/5 shadow-2xl relative transform transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            
            {/* Soft background glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-persimmon/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 opacity-50 hover:opacity-100" />

            <header className="flex flex-col items-center gap-3 relative z-10 group cursor-default">
              <div className="p-4 bg-persimmon/10 border border-persimmon/20 rounded-2xl shadow-[inset_0_0_20px_rgba(252,76,2,0.1)] transition-all duration-500 group-hover:scale-110 group-hover:shadow-[inset_0_0_30px_rgba(252,76,2,0.3)] group-hover:-rotate-3">
                <ShieldCheck className="text-persimmon w-10 h-10 transition-transform duration-500" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-center text-white drop-shadow-md transition-colors duration-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70">
                Identity Bridge
              </h1>
              <p className="text-white/50 text-sm text-center px-2 font-medium">
                Anchor your GitHub identity to the Solana blockchain to receive automated treasury payouts.
              </p>
            </header>

            <section className="space-y-5 relative z-10">
              
              {/* GitHub Identity Box */}
              <div className="space-y-2 group/box">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 transition-colors duration-300 group-hover/box:text-white/60">1. Authenticate Identity</label>
                <div className="flex items-center justify-between p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl transition-transform duration-500 group-hover/box:scale-110 ${sessionUser ? "bg-emerald-500/10 text-emerald-500" : "bg-white/10 text-white/40"}`}>
                      <FolderGit2 size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white tracking-wide">{sessionUser ? `@${sessionUser.username}` : "GitHub Profile"}</span>
                      <span className="text-[10px] text-white/40 font-mono tracking-wide mt-0.5">{sessionUser ? `ID: ${githubIdFromUrl}` : "Required for verification"}</span>
                    </div>
                  </div>
                  {!session ? (
                    <button onClick={() => signIn("github")} className="text-xs bg-white text-black px-5 py-2.5 rounded-xl font-bold hover:bg-white/90 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest shadow-lg">
                      Connect
                    </button>
                  ) : (
                    <button onClick={() => signOut()} className="text-white/30 hover:text-red-400 transition-all duration-300 p-2.5 bg-white/5 hover:bg-red-500/10 rounded-xl">
                      <LogOut size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Solana Wallet Box */}
              <div className="space-y-2 group/box">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 transition-colors duration-300 group-hover/box:text-white/60">2. Link Settlement Address</label>
                <div className="flex items-center justify-between p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl transition-transform duration-500 group-hover/box:scale-110 ${publicKey ? "bg-persimmon/10 text-persimmon" : "bg-white/10 text-white/40"}`}>
                      <Wallet size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white tracking-wide">{publicKey ? "Wallet Connected" : "Phantom / Solflare"}</span>
                      <span className="text-[10px] text-white/40 font-mono tracking-wide mt-0.5">
                        {publicKey ? `${publicKey.toBase58().slice(0, 8)}...` : "Awaiting signature"}
                      </span>
                    </div>
                  </div>
                  <div className="relative z-50">
                    {walletUiReady && <WalletMultiButton className="!bg-[#222222] hover:!bg-persimmon !text-white !h-10 !text-xs !rounded-xl !px-5 transition-all duration-300 uppercase !font-bold shadow-none" />}
                  </div>
                </div>
              </div>

              {/* Action Button Area */}
              <div className="pt-6 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
                {status.type === 'success' && claimIdFromUrl ? (
                  <Link href={`/claim/${claimIdFromUrl}`} className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-400 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-emerald-500/20 active:scale-95 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <span className="relative z-10 flex items-center gap-2">
                      Proceed to Claim Bounty <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                ) : (
                  <button
                    disabled={!session || !publicKey || !githubIdFromUrl || loading || status.type === 'success'}
                    onClick={handleLinkIdentity}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-white/90 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-white/10 active:scale-95 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <span className="relative z-10 flex items-center gap-2">
                      {loading ? "Anchoring..." : <><LinkIcon size={18} className="group-hover:rotate-12 transition-transform" /> Finalize Identity Bridge</>}
                    </span>
                  </button>
                )}
                
                {status.msg && (
                  <div className={`mt-5 flex items-center gap-3 p-4 rounded-xl text-xs font-mono border animate-in fade-in zoom-in-95 duration-500 transition-all ${
                    status.type === 'success' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                  }`}>
                    {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {status.msg}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ❓ Help Button (Bottom Right) */}
      <button className="fixed bottom-6 right-6 p-3 bg-[#111111] border border-white/10 rounded-full text-white/50 hover:text-white hover:border-white/30 transition-all duration-300 z-50 group shadow-lg">
         <HelpCircle size={20} className="group-hover:scale-110 transition-transform" />
      </button>

    </main>
  );
}

export default function LinkAccountPage() {
  return (
    <Suspense fallback={<div className="bg-[#0A0A0A] min-h-screen" />}>
      <LinkContent />
    </Suspense>
  );
}