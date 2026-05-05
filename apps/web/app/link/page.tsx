'use client';

import { Suspense, useState, useSyncExternalStore } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FolderGit2, Wallet, Link as LinkIcon, CheckCircle2, LogOut, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
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
    <main className="flex flex-col min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-persimmon/30 relative">
      
      {/* Hyper-clean subtle dotted background */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Minimalist Header */}
      <nav className="w-full p-8 flex items-center justify-between relative z-20">
        <Link href="/" className="flex items-center gap-3 group">
          <Image 
            src="/logo-orange.svg" 
            alt="SOLUX Logo" 
            width={24} 
            height={24} 
            className="group-hover:scale-110 transition-transform duration-300"
          />
          <span className="text-xl font-bold tracking-tighter">
            SOLUX<span className="text-persimmon">.</span>
          </span>
        </Link>
        <Link href="/" className="text-xs font-bold text-white/40 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors">
          <ArrowLeft size={14} /> Back to App
        </Link>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10 w-full mb-20">
        
        <div className="max-w-xl w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-3">Setup Identity Bridge</h1>
            <p className="text-white/50 text-sm max-w-md mx-auto">
              Connect your developer profile to your settlement address to securely receive automated payouts.
            </p>
          </div>

          <div className="bg-[#111111] rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
            
            <div className="p-8 space-y-6">
              
              {/* Step 1: GitHub */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${session ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/40'}`}>
                    <FolderGit2 size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Step 1</span>
                      {session && <CheckCircle2 size={12} className="text-emerald-400" />}
                    </div>
                    <p className="text-sm font-bold text-white">{sessionUser ? `@${sessionUser.username}` : "Connect GitHub"}</p>
                    {sessionUser && githubIdFromUrl && <p className="text-[10px] text-white/40 font-mono mt-0.5">ID: {githubIdFromUrl}</p>}
                  </div>
                </div>
                
                {!session ? (
                  <button onClick={() => signIn("github")} className="text-xs bg-white text-black px-5 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-colors uppercase tracking-widest">
                    Connect
                  </button>
                ) : (
                  <button onClick={() => signOut()} className="text-xs text-red-400 bg-red-500/10 px-4 py-2.5 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-colors uppercase tracking-widest">
                    Disconnect
                  </button>
                )}
              </div>

              {/* Step 2: Wallet */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${publicKey ? 'bg-persimmon/10 text-persimmon' : 'bg-white/5 text-white/40'}`}>
                    <Wallet size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Step 2</span>
                      {publicKey && <CheckCircle2 size={12} className="text-persimmon" />}
                    </div>
                    <p className="text-sm font-bold text-white">{publicKey ? "Wallet Connected" : "Connect Solana"}</p>
                    {publicKey && <p className="text-[10px] text-white/40 font-mono mt-0.5">{publicKey.toBase58().slice(0, 12)}...</p>}
                  </div>
                </div>
                
                <div className="relative z-50">
                  {walletUiReady && <WalletMultiButton className="!bg-[#222222] hover:!bg-persimmon !text-white !h-9 !text-xs !rounded-xl !px-4 transition-all duration-300 uppercase !font-bold shadow-none border border-white/5" />}
                </div>
              </div>

            </div>

            {/* Footer Action Area */}
            <div className="p-8 bg-black/20 border-t border-white/5">
              {status.type === 'success' && claimIdFromUrl ? (
                <Link href={`/claim/${claimIdFromUrl}`} className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-bold text-sm uppercase tracking-widest transition-colors shadow-lg shadow-emerald-500/20">
                  Proceed to Settlement <ArrowRight size={16} />
                </Link>
              ) : (
                <button
                  disabled={!session || !publicKey || !githubIdFromUrl || loading || status.type === 'success'}
                  onClick={handleLinkIdentity}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-200 disabled:opacity-20 disabled:cursor-not-allowed transition-colors shadow-lg"
                >
                  {loading ? "Anchoring Data..." : <><LinkIcon size={16} /> Finalize Connection</>}
                </button>
              )}
              
              {status.msg && (
                <div className={`mt-4 flex items-start gap-3 p-4 rounded-xl text-xs font-mono border ${
                  status.type === 'success' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}>
                  {status.type === 'success' ? <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" /> : <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />}
                  <span className="leading-relaxed">{status.msg}</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
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