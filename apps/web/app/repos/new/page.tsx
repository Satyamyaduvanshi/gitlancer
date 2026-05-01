'use client';
import { useState, useEffect, useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import idl from '@/src/idl/solux_program.json'; 
import { FolderGit2, Loader2, CheckCircle2, Search, GitBranch, ShieldCheck, XCircle, X, Rocket } from 'lucide-react';

const PROGRAM_ID = new PublicKey("JBnTbnqcvXTmw7nZ6TuLbGcY7U5b8Du7YPpK5G8nByyi");
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function InitializeRepoPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { connection } = useConnection();
  const wallet = useWallet();

  const [repos, setRepos] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  // 🍞 Sleek Toast State (Replacing inline status)
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' | 'info' }>({ 
    show: false, msg: '', type: 'info' 
  });

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, msg, type });
    if (type !== 'info') {
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
    }
  };

  useEffect(() => {
    const fetchRepos = async () => {
      const token = (session as any)?.accessToken;
      const userId = (session as any)?.user?.id;
      if (token && userId) {
        try {
          const [repoRes, vaultRes] = await Promise.all([
            axios.get('https://api.github.com/user/repos?per_page=100&sort=updated', {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(`${API_URL}/api/vaults/user/${userId}`)
          ]);
          const registered = vaultRes.data.map((v: any) => v.repositoryFullName);
          setRepos(repoRes.data.filter((r: any) => !registered.includes(r.full_name)));
        } catch (err) { 
          console.error(err); 
          showToast("Failed to fetch GitHub repositories.", "error");
        } finally { 
          setLoadingRepos(false); 
        }
      }
    };
    fetchRepos();
  }, [session]);

  const filteredRepos = useMemo(() => {
    return repos.filter(repo => repo.full_name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [repos, searchQuery]);

  const handleInitialize = async () => {
    if (!wallet.publicKey || !wallet.signTransaction || !session?.user) {
      return showToast("Please connect your wallet first.", "error");
    }
    
    setIsInitializing(true);
    showToast("Awaiting wallet signature and deploying to Solana...", "info");

    try {
      const provider = new AnchorProvider(connection, wallet as any, { preflightCommitment: 'processed' });
      const program = new Program(idl as Idl, provider);

      const [vaultPda, bump] = PublicKey.findProgramAddressSync([Buffer.from("vault"), Buffer.from(selectedRepo)], PROGRAM_ID);

      try {
        await program.methods.initializeVault(selectedRepo).accounts({
          maintainer: wallet.publicKey,
          vaultState: vaultPda,
          systemProgram: SystemProgram.programId,
        }).rpc();
      } catch (onChainErr: any) {
        if (!onChainErr.toString().includes("already in use")) throw onChainErr;
      }

      await axios.post(`${API_URL}/api/vaults/register`, {
        repoFullName: selectedRepo,
        pdaAddress: vaultPda.toBase58(),
        maintainerId: (session.user as any).id,
        githubHandle: (session.user as any).username,
        avatarUrl: session.user.image,
        vaultBump: bump,
      });

      showToast(`Vault successfully secured for ${selectedRepo.split('/')[1]}!`, "success");
      setTimeout(() => router.push(`/repos/${encodeURIComponent(selectedRepo)}`), 1500);
      
    } catch (err: any) {
      let errorMsg = err.message || 'Initialization failed';
      if (errorMsg.includes("User rejected")) errorMsg = "Transaction was rejected in your wallet.";
      showToast(errorMsg, "error");
      setIsInitializing(false); // Only reset if error, success redirects anyway
    }
  };

  return (
    <DashboardLayout>
      
      {/* 🚀 Header */}
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700 ease-out">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-persimmon/10 rounded-2xl border border-persimmon/20">
            <Rocket className="text-persimmon" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Deploy AI Guardian</h1>
            <p className="text-foreground/50 text-sm mt-1">Anchor a GitHub repository to the Solana blockchain.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 📂 Left Side: Repo Selector (Col-span 2) */}
        <div className="lg:col-span-2 bg-[#111111] border border-white/5 rounded-[2rem] shadow-2xl p-6 flex flex-col h-[600px] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          {/* Search Bar */}
          <div className="relative mb-6 z-10 group">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-persimmon transition-colors duration-300" />
            <input 
              type="text" 
              placeholder="Search available repositories..." 
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-persimmon/20 focus:border-persimmon transition-all placeholder:text-white/30 font-sans shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loadingRepos || isInitializing}
            />
          </div>

          {/* 📜 Sleek Custom Scroll Area */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 z-10 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20 transition-colors">
            {loadingRepos ? (
              <div className="h-full flex flex-col items-center justify-center gap-4">
                <Loader2 size={32} className="text-persimmon animate-spin" />
                <p className="text-white/40 font-mono text-xs uppercase tracking-widest animate-pulse">Syncing GitHub Data...</p>
              </div>
            ) : filteredRepos.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                <FolderGit2 size={48} className="text-white/20 mb-4" />
                <p className="text-white/50 text-sm">No repositories found matching your search.</p>
                <p className="text-white/30 text-xs mt-2">All your repositories might already be anchored!</p>
              </div>
            ) : (
              filteredRepos.map((repo) => {
                const isSelected = selectedRepo === repo.full_name;
                return (
                  <button
                    key={repo.id}
                    onClick={() => setSelectedRepo(repo.full_name)}
                    disabled={isInitializing}
                    className={`w-full text-left p-5 rounded-2xl flex items-center justify-between transition-all duration-300 group ${
                      isSelected 
                        ? 'bg-persimmon/10 border border-persimmon/50 shadow-[0_0_20px_rgba(252,76,2,0.1)]' 
                        : 'bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-center gap-4 overflow-hidden pr-4">
                      <div className={`p-2.5 rounded-xl transition-colors ${isSelected ? 'bg-persimmon/20 text-persimmon' : 'bg-white/5 text-white/40 group-hover:text-white/70'}`}>
                        {/* Raw SVG GitHub Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                          <path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-white/80'}`}>
                          {repo.full_name.split('/')[1]}
                        </span>
                        <span className="text-xs text-white/40 font-mono mt-0.5 truncate">{repo.full_name.split('/')[0]}</span>
                      </div>
                    </div>
                    
                    <div className={`transition-all duration-300 ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                      <CheckCircle2 size={24} className="text-persimmon flex-shrink-0" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ⚡ Right Side: Command Center (Col-span 1) */}
        <div className="lg:col-span-1 flex flex-col justify-between bg-[#111111] border border-white/5 rounded-[2rem] shadow-2xl p-6 h-fit lg:sticky lg:top-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          
          <div>
            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl mb-6">
              <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" /> Target Configuration
              </p>
              {selectedRepo ? (
                <div>
                  <p className="text-base font-bold text-white flex items-center gap-2 break-all">
                    <GitBranch size={16} className="text-persimmon" />
                    {selectedRepo.split('/')[1]}
                  </p>
                  <p className="text-xs text-white/40 font-mono mt-1">{selectedRepo}</p>
                </div>
              ) : (
                <p className="text-sm font-medium text-white/30 italic">No repository selected</p>
              )}
            </div>

            <div className="space-y-5 text-sm text-white/60">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-xs font-mono text-white mt-0.5">1</div>
                <p className="leading-relaxed">A unique <strong className="text-white">Smart Contract PDA</strong> will be generated specifically for this repository.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-xs font-mono text-white mt-0.5">2</div>
                <p className="leading-relaxed">Your connected wallet will be permanently anchored as the <strong className="text-white">Maintainer Authority</strong>.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <button
              onClick={handleInitialize}
              disabled={!selectedRepo || isInitializing || !wallet.connected}
              className="w-full bg-persimmon hover:bg-orange-500 disabled:bg-white/5 disabled:text-white/30 text-white p-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all flex justify-center items-center gap-2 active:scale-95 shadow-lg shadow-persimmon/20 disabled:shadow-none relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10 flex items-center gap-2">
                {isInitializing ? (
                  <><Loader2 className="animate-spin" size={18}/> Deploying...</>
                ) : (
                  'Initialize Vault'
                )}
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* 🍞 Sleek Custom Toast Notification */}
      <div 
        className={`fixed bottom-6 right-6 z-[100] max-w-sm w-full bg-[#111111] border rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-start gap-3 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          toast.show ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'
        } ${
          toast.type === 'success' ? 'border-emerald-500/30' : 
          toast.type === 'error' ? 'border-red-500/30' : 'border-blue-500/30'
        }`}
      >
        <div className="mt-0.5 flex-shrink-0">
          {toast.type === 'success' ? <CheckCircle2 size={20} className="text-emerald-500" /> : 
           toast.type === 'error' ? <XCircle size={20} className="text-red-500" /> : 
           <Loader2 size={20} className="text-blue-400 animate-spin" />}
        </div>
        <div className="flex-1 pr-4">
          <h4 className={`text-sm font-bold tracking-tight mb-1 ${
            toast.type === 'success' ? 'text-emerald-400' : 
            toast.type === 'error' ? 'text-red-400' : 'text-blue-400'
          }`}>
            {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Processing'}
          </h4>
          <p className="text-xs text-white/70 leading-relaxed break-words">{toast.msg}</p>
        </div>
        {toast.type !== 'info' && (
          <button 
            onClick={() => setToast({ ...toast, show: false })}
            className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <X size={16} />
          </button>
        )}
      </div>

    </DashboardLayout>
  );
}