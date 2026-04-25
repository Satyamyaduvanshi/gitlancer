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

export default function CreateVault() {
  const { data: session, status } = useSession();
  const { connection } = useConnection();
  const wallet = useWallet();

  const [mounted, setMounted] = useState(false);
  const [repos, setRepos] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fetchRepos = async () => {
      const token = (session as any)?.accessToken;
      if (token && mounted) {
        setLoadingRepos(true);
        try {
          const response = await axios.get('https://api.github.com/user/repos?per_page=100&sort=updated', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setRepos(response.data);
        } catch (err) { console.error("Repo fetch failed", err); }
        finally { setLoadingRepos(false); }
      }
    };
    fetchRepos();
  }, [session, mounted]);

  const handleInitialize = async () => {
    if (!wallet.publicKey || !wallet.signTransaction || !session?.user) return;
    setIsInitializing(true);

    try {
      const provider = new AnchorProvider(connection, wallet as any, { preflightCommitment: 'processed' });
      const program = new Program(idl as Idl, provider);

      const [vaultPda, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), Buffer.from(selectedRepo)],
        PROGRAM_ID
      );

      console.log(`🏗️ Initializing/Verifying vault: ${selectedRepo}`);
      
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

      // 🚀 Send FULL user info so the backend can sync the identity
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/vaults/register`, {
        repoFullName: selectedRepo,
        pdaAddress: vaultPda.toBase58(),
        maintainerId: (session.user as any).id,
        githubHandle: (session.user as any).username,
        avatarUrl: session.user.image,
        vaultBump: bump,
      });

      alert("🎉 Success! Vault is fully registered.");
      setSelectedRepo('');
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsInitializing(false);
    }
  };

  if (!mounted) return <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl h-64 animate-pulse" />;

  return (
    <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl shadow-xl text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-purple-400">Manage Vaults</h2>
        <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !rounded-lg !h-10 !text-sm" />
      </div>

      {!session ? (
        <button onClick={() => signIn('github')} className="w-full bg-white text-black p-3 rounded-lg font-bold">
          Login with GitHub
        </button>
      ) : !wallet.connected ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-800 rounded-xl">
          <p className="text-gray-400 text-sm">Connect your Solana wallet to continue</p>
        </div>
      ) : (
        <div className="space-y-4">
          <select 
            className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-purple-500 transition"
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
          >
            <option value="">-- Select a Repository --</option>
            {repos.map((repo) => (
              <option key={repo.id} value={repo.full_name}>{repo.full_name}</option>
            ))}
          </select>

          <button
            onClick={handleInitialize}
            disabled={!selectedRepo || isInitializing}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 p-3 rounded-lg font-bold transition duration-200"
          >
            {isInitializing ? "Syncing..." : "Activate SOLUX Vault"}
          </button>
        </div>
      )}
    </div>
  );
}