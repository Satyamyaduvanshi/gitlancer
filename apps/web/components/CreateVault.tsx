'use client';
import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { useSession, signIn } from 'next-auth/react';
import axios from 'axios';
import idl from '../src/idl/solux_program.json'; 

const PROGRAM_ID = new PublicKey("JBnTbnqcvXTmw7nZ6TuLbGcY7U5b8Du7YPpK5G8nByyi");
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function CreateVault() {
  const { data: session } = useSession();
  const { connection } = useConnection();
  const wallet = useWallet();

  const [mounted, setMounted] = useState(false);
  const [repos, setRepos] = useState<any[]>([]);
  const [existingVaults, setExistingVaults] = useState<string[]>([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // 🛡️ Modern UI Alert State
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info', msg: string } | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fetchReposAndVaults = async () => {
      const token = (session as any)?.accessToken;
      const userId = (session as any)?.user?.id;
      
      if (token && userId && mounted) {
        setLoadingRepos(true);
        try {
          // Fetch GitHub repos and Existing DB Vaults simultaneously
          const [repoRes, vaultRes] = await Promise.all([
            axios.get('https://api.github.com/user/repos?per_page=100&sort=updated', {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(`${API_URL}/api/vaults/user/${userId}`)
          ]);
          
          const registeredRepoNames = vaultRes.data.map((v: any) => v.repositoryFullName);
          setExistingVaults(registeredRepoNames);
          
          // Filter out repos that are already initialized
          const availableRepos = repoRes.data.filter((r: any) => !registeredRepoNames.includes(r.full_name));
          setRepos(availableRepos);
          
        } catch (err) { 
          console.error("Fetch failed", err); 
        } finally { 
          setLoadingRepos(false); 
        }
      }
    };
    fetchReposAndVaults();
  }, [session, mounted]);

  const handleInitialize = async () => {
    if (!wallet.publicKey || !wallet.signTransaction || !session?.user) return;
    setIsInitializing(true);
    setStatus({ type: 'info', msg: 'Processing transaction on Solana...' });

    try {
      const provider = new AnchorProvider(connection, wallet as any, { preflightCommitment: 'processed' });
      const program = new Program(idl as Idl, provider);

      const [vaultPda, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), Buffer.from(selectedRepo)],
        PROGRAM_ID
      );

      try {
        await program.methods
          .initializeVault(selectedRepo)
          .accounts({
            maintainer: wallet.publicKey,
            vaultState: vaultPda,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
      } catch (onChainErr: any) {
        const msg = onChainErr.toString();
        if (!msg.includes("already in use") && !msg.includes("already been processed")) {
          throw onChainErr;
        }
      }

      await axios.post(`${API_URL}/api/vaults/register`, {
        repoFullName: selectedRepo,
        pdaAddress: vaultPda.toBase58(),
        maintainerId: (session.user as any).id,
        githubHandle: (session.user as any).username,
        avatarUrl: session.user.image,
        vaultBump: bump,
      });

      setStatus({ type: 'success', msg: `🎉 Vault registered for ${selectedRepo}` });
      setRepos(repos.filter(r => r.full_name !== selectedRepo)); // Remove from dropdown
      setSelectedRepo('');
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', msg: `Error: ${err.response?.data?.message || err.message}` });
    } finally {
      setIsInitializing(false);
    }
  };

  if (!mounted) return <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl h-64 animate-pulse" />;

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-emerald-400">Initialize Vault</h2>
        <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !rounded-lg !h-10 !text-sm" />
      </div>

      {!session ? (
        <button onClick={() => signIn('github')} className="w-full bg-white text-black p-3 rounded-lg font-bold">
          Login with GitHub
        </button>
      ) : !wallet.connected ? (
        <div className="text-center py-10 border-2 border-dashed border-slate-800 rounded-xl">
          <p className="text-slate-400 text-sm">Connect your Solana wallet to continue</p>
        </div>
      ) : (
        <div className="space-y-4">
          <select 
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 outline-none focus:border-emerald-500 transition text-sm"
            value={selectedRepo}
            onChange={(e) => {
              setSelectedRepo(e.target.value);
              setStatus(null); // Clear alert on new selection
            }}
          >
            <option value="">-- Select an Uninitialized Repository --</option>
            {loadingRepos ? <option disabled>Loading...</option> : 
              repos.map((repo) => (
                <option key={repo.id} value={repo.full_name}>{repo.full_name}</option>
              ))
            }
          </select>

          <button
            onClick={handleInitialize}
            disabled={!selectedRepo || isInitializing}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 p-3 rounded-lg font-bold transition duration-200"
          >
            {isInitializing ? "Syncing with Blockchain..." : "Activate SOLUX Vault"}
          </button>

          {/* Modern Alert Box */}
          {status && (
            <div className={`p-3 rounded-lg text-xs font-mono border ${
              status.type === 'success' ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' :
              status.type === 'error' ? 'bg-red-900/20 border-red-500/30 text-red-400' :
              'bg-blue-900/20 border-blue-500/30 text-blue-400'
            }`}>
              {status.msg}
            </div>
          )}
        </div>
      )}
    </div>
  );
}