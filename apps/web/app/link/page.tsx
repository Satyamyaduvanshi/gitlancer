'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FolderGit, Wallet, Link as LinkIcon, CheckCircle, LogOut, ShieldCheck } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export default function LinkAccount() {
  const { data: session } = useSession();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const walletUiReady = useIsClient();
  const [Success,setSuccess] = useState(false);

  // Define the username safely
  const username = (session?.user as { username?: string } | undefined)?.username;

  const handleLink = async () => {
    console.log("🚀 Attempting to link handle:", username);
    setSuccess(false);
  
    if (!username) {
      alert("Session error: Please 'Sign Out' and 'Sign In' again to capture your unique GitHub handle.");
      return;
    }

    if (!publicKey) {
      alert("Please connect your Solana wallet first.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ORACLE_URL}/api/users/link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubHandle: username,
          walletAddress: publicKey.toBase58(),
        }),
      });

      if (res.ok) {
        alert(`Success! @${username} is now linked to ${publicKey.toBase58().slice(0, 8)}...`);
      } else {
        const err = await res.json();
        alert(`Error: ${err.message || "Check Oracle logs"}`);
      }
    } catch (e) {
      console.error("Connection error:", e);
      alert("Could not connect to Oracle. Ensure it is running on port 3000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-4">
      <div className="max-w-md w-full space-y-8 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="flex flex-col items-center gap-2">
          <ShieldCheck className="text-purple-500 w-12 h-12" />
          <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            GitLancer Guardian
          </h1>
          <p className="text-slate-400 text-sm text-center">
            Link your GitHub identity to your Solana wallet to claim bounties.
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1: GitHub Auth */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Step 1: GitHub</label>
            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3">
                <FolderGit className={username ? "text-green-400" : "text-slate-400"} />
                <span className="font-medium">
                  {username ? `@${username}` : "Not Connected"}
                </span>
              </div>
              {!session ? (
                <button 
                  onClick={() => signIn("github")} 
                  className="text-sm bg-white text-black px-4 py-1.5 rounded-md font-bold hover:bg-slate-200 transition"
                >
                  Connect
                </button>
              ) : (
                <button 
                  onClick={() => signOut()} 
                  className="text-slate-400 hover:text-red-400 transition"
                  title="Sign out to refresh session"
                >
                  <LogOut size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Step 2: Wallet Auth */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Step 2: Wallet</label>
            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3">
                <Wallet className={publicKey ? "text-purple-400" : "text-slate-400"} />
                <span className="font-medium text-xs truncate max-w-[140px]">
                  {publicKey ? publicKey.toBase58() : "Not Connected"}
                </span>
              </div>
              {walletUiReady ? (
                <WalletMultiButton className="!bg-purple-600 !h-9 !text-xs !rounded-md hover:!bg-purple-700 transition" />
              ) : (
                <div
                  className="!h-9 min-w-[11rem] rounded-md bg-purple-600/30 border border-purple-500/20"
                  aria-hidden
                />
              )}
            </div>
          </div>

          {/* Final Step: Bridge Identity */}
          <div className="pt-4">
            <button
              disabled={!username || !publicKey || loading}
              onClick={handleLink}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:opacity-90 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-900/20"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <LinkIcon size={20} />
                  Finalize Identity Bridge
                </>
              )}
            </button>
            {username && publicKey && (
              <p className="text-[10px] text-center text-slate-500 mt-4 flex items-center justify-center gap-1">
                <CheckCircle size={10} /> Cryptographically linking GitHub and Solana
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}