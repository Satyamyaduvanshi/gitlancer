'use client';

import { Suspense, useState, useSyncExternalStore } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FolderGit, Wallet, Link as LinkIcon, CheckCircle, LogOut, ShieldCheck, AlertCircle } from "lucide-react";
import axios from "axios";

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function LinkContent() {
  const { data: session } = useSession();
  const { publicKey } = useWallet();
  const searchParams = useSearchParams();
  const walletUiReady = useIsClient();

  // Primary identifiers from URL and Session
  const githubIdFromUrl = searchParams.get("githubId");
  
  // Cast session to include the custom NextAuth properties we added
  const sessionUser = session?.user as { id?: string; name?: string; image?: string; username?: string };
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; msg: string }>({ type: null, msg: "" });

  const handleLinkIdentity = async () => {
    if (!githubIdFromUrl || !publicKey || !sessionUser) return;

    // 🛡️ THE CRITICAL SECURITY GUARDRAIL
    // Prevent hackers from linking their wallet to someone else's GitHub ID
    if (sessionUser.id !== githubIdFromUrl) {
      setStatus({ 
        type: 'error', 
        msg: `Security Violation: You are logged in as @${sessionUser.username}, but trying to link a wallet for GitHub ID ${githubIdFromUrl}.` 
      });
      return; 
    }

    setLoading(true);
    setStatus({ type: null, msg: "" });

    try {
      const oracleUrl = process.env.NEXT_PUBLIC_ORACLE_URL || 'http://localhost:3000';
      
      const payload = {
        githubId: githubIdFromUrl,
        githubHandle: sessionUser.username || "Unknown",
        walletAddress: publicKey.toBase58(),
        avatarUrl: sessionUser.image || ""
      };

      const response = await axios.post(`${oracleUrl}/api/users/link`, payload);

      if (response.status === 201 || response.status === 200) {
        setStatus({ 
          type: 'success', 
          msg: `Identity Verified: @${payload.githubHandle} linked to ${payload.walletAddress.slice(0, 4)}...${payload.walletAddress.slice(-4)}` 
        });
      }
    } catch (error: any) {
      const errorDetail = error.response?.data?.message || "Check Oracle connection and logs.";
      setStatus({ type: 'error', msg: `Link Failed: ${errorDetail}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-4 font-sans">
      <div className="max-w-md w-full space-y-8 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <header className="flex flex-col items-center gap-2">
          <div className="p-3 bg-purple-500/10 rounded-full">
            <ShieldCheck className="text-purple-500 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-center">
            GitLancer Guardian
          </h1>
          <p className="text-slate-500 text-xs text-center px-4">
            Cryptographically anchoring GitHub identities to the Solana blockchain.
          </p>
        </header>

        <section className="space-y-4">
          {/* GitHub Identity Mapping */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">GitHub Authentication</label>
            <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <FolderGit size={18} className={sessionUser ? "text-green-400" : "text-slate-600"} />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{sessionUser ? `@${sessionUser.username}` : "Required"}</span>
                  <span className="text-[10px] text-slate-500 font-mono">ID: {githubIdFromUrl || "Missing"}</span>
                </div>
              </div>
              {!session ? (
                <button 
                  onClick={() => signIn("github")} 
                  className="text-[11px] bg-white text-black px-3 py-1.5 rounded font-bold hover:bg-slate-200 transition uppercase"
                >
                  Sign In
                </button>
              ) : (
                <button onClick={() => signOut()} className="text-slate-500 hover:text-red-400 transition">
                  <LogOut size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Wallet Connection Mapping */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Solana Infrastructure</label>
            <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <Wallet size={18} className={publicKey ? "text-purple-400" : "text-slate-600"} />
                <span className="text-[11px] font-mono text-slate-300">
                  {publicKey ? `${publicKey.toBase58().slice(0, 12)}...` : "Disconnected"}
                </span>
              </div>
              {walletUiReady && <WalletMultiButton className="!bg-purple-600 !h-8 !text-[10px] !rounded !px-4 hover:!bg-purple-700 transition uppercase !font-bold" />}
            </div>
          </div>

          {/* Submission Control */}
          <div className="pt-4">
            <button
              disabled={!session || !publicKey || !githubIdFromUrl || loading}
              onClick={handleLinkIdentity}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Syncing..." : <><LinkIcon size={16} /> Finalize Identity Bridge</>}
            </button>
            
            {status.msg && (
              <div className={`mt-4 flex items-center gap-2 p-3 rounded-lg text-[10px] font-mono border ${
                status.type === 'success' ? "bg-green-500/5 border-green-500/20 text-green-400" : "bg-red-500/5 border-red-500/20 text-red-400"
              }`}>
                {status.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                {status.msg}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LinkAccountPage() {
  return (
    <Suspense fallback={<div className="bg-slate-950 min-h-screen" />}>
      <LinkContent />
    </Suspense>
  );
}