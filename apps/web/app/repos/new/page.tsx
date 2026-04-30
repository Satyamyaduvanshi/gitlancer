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
import { FolderGit2, Loader2, CheckCircle2, AlertCircle, Search, GitBranch } from 'lucide-react';

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
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info', msg: string } | null>(null);

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
        } catch (err) { console.error(err); } finally { setLoadingRepos(false); }
      }
    };
    fetchRepos();
  }, [session]);

  const filteredRepos = useMemo(() => {
    return repos.filter(repo => repo.full_name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [repos, searchQuery]);

  const handleInitialize = async () => {
    if (!wallet.publicKey || !wallet.signTransaction || !session?.user) return;
    setIsInitializing(true);
    setStatus({ type: 'info', msg: 'Awaiting signature & deploying to Solana...' });

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

      setStatus({ type: 'success', msg: `Vault secured for ${selectedRepo}!` });
      setTimeout(() => router.push(`/repos/${encodeURIComponent(selectedRepo)}`), 2000);
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || 'Initialization failed' });
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto mt-4">
        <div className="mb-8 border-b border-white/5 pb-6">
          <h1 className="text-3xl font-bold text-[#e8e8ea] mb-2 uppercase tracking-tight">Deploy AI Guardian</h1>
          <p className="text-[#e8e8ea]/50 text-sm font-mono uppercase tracking-widest">
            Anchor a GitHub repository to the Solana blockchain
          </p>
        </div>

        <div className="bg-[#0b0c10] border border-white/5 p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-8">
          
          {/* Left Side: The Repo Selector */}
          <div className="flex-1 flex flex-col h-[500px]">
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-3.5 text-[#e8e8ea]/30" size={18} />
              <input 
                type="text" 
                placeholder="SEARCH REPOSITORIES..." 
                className="w-full bg-[#141413] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-[#e8e8ea] focus:outline-none focus:border-[#fc4c02] transition font-mono placeholder:text-[#e8e8ea]/20 uppercase"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loadingRepos}
              />
            </div>

            {/* Scrollable Repo List */}
            <div className="flex-1 bg-[#141413] border border-white/5 rounded-xl overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {loadingRepos ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-[#fc4c02] font-mono text-sm animate-pulse">SYNCING GITHUB...</p>
                </div>
              ) : filteredRepos.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center p-4">
                  <p className="text-[#e8e8ea]/30 font-mono text-xs uppercase">No repositories match your search.</p>
                </div>
              ) : (
                filteredRepos.map((repo) => {
                  const isSelected = selectedRepo === repo.full_name;
                  return (
                    <button
                      key={repo.id}
                      onClick={() => setSelectedRepo(repo.full_name)}
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-all group ${
                        isSelected 
                          ? 'bg-[#fc4c02]/10 border border-[#fc4c02]/50' 
                          : 'border border-transparent hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FolderGit2 size={16} className={isSelected ? 'text-[#fc4c02]' : 'text-[#e8e8ea]/30 group-hover:text-[#e8e8ea]/50'} />
                        <span className={`text-sm truncate ${isSelected ? 'text-[#fc4c02] font-bold' : 'text-[#e8e8ea]'}`}>
                          {repo.full_name}
                        </span>
                      </div>
                      {isSelected && <CheckCircle2 size={18} className="text-[#fc4c02] flex-shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Side: The Action Panel */}
          <div className="md:w-72 flex flex-col justify-between">
            <div>
              <div className="bg-[#141413] border border-white/5 p-4 rounded-xl mb-6">
                <p className="text-[10px] text-[#e8e8ea]/40 font-mono uppercase tracking-widest mb-2">Selected Target</p>
                {selectedRepo ? (
                  <p className="text-sm font-bold text-[#e8e8ea] flex items-center gap-2 break-all">
                    <GitBranch size={16} className="text-[#fc4c02]" />
                    {selectedRepo.split('/')[1]}
                  </p>
                ) : (
                  <p className="text-xs font-mono text-[#e8e8ea]/30">None selected</p>
                )}
              </div>

              <div className="space-y-4 text-xs font-mono text-[#e8e8ea]/50">
                <p className="flex items-start gap-2">
                  <span className="text-[#fc4c02] mt-0.5">01</span>
                  Smart contract PDA will be generated specifically for this repository.
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-[#fc4c02] mt-0.5">02</span>
                  Your connected wallet will be permanently anchored as the Maintainer authority.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleInitialize}
                disabled={!selectedRepo || isInitializing || !wallet.connected}
                className="w-full bg-[#fc4c02] hover:bg-[#fc4c02]/90 disabled:bg-[#1f2833] disabled:text-[#e8e8ea]/30 text-[#141413] p-4 rounded-xl font-bold transition flex justify-center items-center gap-2 active:scale-[0.98]"
              >
                {isInitializing ? (
                  <><Loader2 className="animate-spin" size={18}/> DEPLOYING...</>
                ) : (
                  'INITIALIZE VAULT'
                )}
              </button>

              {status && (
                <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 border ${
                  status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                  status.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                  'bg-blue-500/10 border-blue-500/20 text-blue-400'
                }`}>
                  {status.type === 'success' ? <CheckCircle2 size={16} className="mt-0.5" /> : <AlertCircle size={16} className="mt-0.5" />}
                  <p className="text-[10px] font-mono uppercase tracking-wide leading-relaxed">{status.msg}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}