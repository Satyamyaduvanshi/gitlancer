'use client';
import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createTransferCheckedInstruction, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

export default function VaultDashboard() {
  const { data: session } = useSession();
  const { connection } = useConnection();
  const wallet = useWallet();
  
  const [vaults, setVaults] = useState<any[]>([]);
  const [bounties, setBounties] = useState<any[]>([]);
  
  const [initialLoading, setInitialLoading] = useState(true); 
  const [usdcBalances, setUsdcBalances] = useState<Record<string, string>>({});
  const [pdaSolBalances, setPdaSolBalances] = useState<Record<string, string>>({});
  const [rechargeAmounts, setRechargeAmounts] = useState<Record<string, number>>({});
  const [solBalance, setSolBalance] = useState<string>("0.0000");
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    const userId = (session?.user as any)?.id;
    if (!userId) return;

    const loadAllData = async (showLoadingScreen: boolean) => {
      if (showLoadingScreen) setInitialLoading(true);
      try {
        const [vRes, bRes] = await Promise.all([
          axios.get(`${API_URL}/api/vaults/user/${userId}`),
          axios.get(`${API_URL}/api/bounties/user/${userId}`)
        ]);
        
        setVaults(vRes.data);
        setBounties(bRes.data);
        await fetchBalances(vRes.data);

        if (wallet.publicKey) {
          const bal = await connection.getBalance(wallet.publicKey);
          setSolBalance((bal / LAMPORTS_PER_SOL).toFixed(4));
        }
      } catch (err) {
        console.error("Silent fetch failed:", err);
      } finally {
        if (showLoadingScreen) setInitialLoading(false);
      }
    };

    loadAllData(vaults.length === 0);
    const interval = setInterval(() => loadAllData(false), 10000);
    return () => clearInterval(interval);
  }, [session, wallet.publicKey, connection]);

  const fetchBalances = async (vaultList: any[]) => {
    const newUsdc: Record<string, string> = {};
    const newSol: Record<string, string> = {};
    
    for (const v of vaultList) {
      const pda = new PublicKey(v.pdaAddress);
      
      // Get SOL Balance of PDA
      try {
        const solBal = await connection.getBalance(pda);
        newSol[v.pdaAddress] = (solBal / LAMPORTS_PER_SOL).toFixed(4);
      } catch (e) { newSol[v.pdaAddress] = "0.0000"; }

      // Get USDC Balance of PDA
      try {
        const toAta = await getAssociatedTokenAddress(USDC_MINT, pda, true);
        const balance = await connection.getTokenAccountBalance(toAta);
        newUsdc[v.pdaAddress] = balance.value.uiAmountString || "0.00";
      } catch (e) { newUsdc[v.pdaAddress] = "0.00"; }
    }
    setUsdcBalances(newUsdc);
    setPdaSolBalances(newSol);
  };

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleRecharge = async (pda: string, amount: number) => {
    if (!wallet.publicKey || !wallet.signTransaction) return alert("Connect wallet!");
    if (!amount || amount <= 0) return alert("Invalid amount.");

    try {
      const fromAta = await getAssociatedTokenAddress(USDC_MINT, wallet.publicKey);
      const toAta = await getAssociatedTokenAddress(USDC_MINT, new PublicKey(pda), true);
      const tx = new Transaction();

      try {
        await connection.getTokenAccountBalance(toAta);
      } catch (e) {
        tx.add(createAssociatedTokenAccountInstruction(wallet.publicKey, toAta, new PublicKey(pda), USDC_MINT));
      }

      tx.add(createTransferCheckedInstruction(fromAta, USDC_MINT, toAta, wallet.publicKey, amount * 1_000_000, 6));

      await wallet.sendTransaction(tx, connection);
      alert(`🚀 Success! TX sent. Balance will update shortly.`);
      setRechargeAmounts({...rechargeAmounts, [pda]: 0});
    } catch (e: any) {
      alert("Recharge failed. Ensure you have enough Devnet USDC in your Phantom wallet.");
    }
  };

  if (initialLoading) return <div className="animate-pulse bg-slate-800 h-64 rounded-2xl w-full mt-10" />;

  return (
    <div className="mt-8 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/20 flex items-center justify-center rounded-xl border border-purple-500/30">
            <span className="text-xl">👛</span>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Personal Wallet</p>
            <p className="text-sm font-mono text-slate-300">
              {wallet.publicKey ? `${wallet.publicKey.toBase58().slice(0, 6)}...${wallet.publicKey.toBase58().slice(-6)}` : "Disconnected"}
            </p>
          </div>
        </div>
        <div className="text-right mt-4 sm:mt-0">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Available Gas</p>
          <p className="text-2xl font-bold text-white">{solBalance} <span className="text-purple-400 text-sm">SOL</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MAINTAINER VAULTS */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col h-full shadow-lg">
          <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2"><span>🏦</span> My Vaults</h3>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {vaults.map(v => (
              <div key={v.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-500/50 transition">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-sm text-white">{v.repositoryFullName}</p>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-400">{usdcBalances[v.pdaAddress] || "0.00"} USDC</p>
                    <p className="text-[9px] text-slate-500">{pdaSolBalances[v.pdaAddress] || "0.0000"} SOL</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-slate-900 p-1.5 rounded mb-3 border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-mono truncate">{v.pdaAddress}</p>
                  <button 
                    onClick={() => handleCopy(v.pdaAddress)}
                    className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded hover:bg-slate-700 transition"
                  >
                    {copiedAddress === v.pdaAddress ? "Copied!" : "Copy"}
                  </button>
                </div>

                <div className="flex gap-2">
                  <input 
                    type="number" placeholder="USDC" min="1"
                    className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 text-xs text-white outline-none focus:border-emerald-500"
                    value={rechargeAmounts[v.pdaAddress] || ''}
                    onChange={(e) => setRechargeAmounts({...rechargeAmounts, [v.pdaAddress]: Number(e.target.value)})}
                  />
                  <button 
                    onClick={() => handleRecharge(v.pdaAddress, rechargeAmounts[v.pdaAddress] || 10)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-2 rounded-lg text-xs font-bold text-white transition active:scale-95"
                  >
                    Fund Vault
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTRIBUTOR BOUNTIES */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col h-full shadow-lg">
          <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2"><span>🎁</span> My Bounties</h3>
          <div className="flex-1 space-y-3 overflow-y-auto pr-2">
            {bounties.map(b => (
              <div key={b.id} className={`flex justify-between items-center p-4 rounded-xl border ${b.status === 'CLAIMED' ? 'bg-slate-950 border-slate-800' : 'bg-slate-950 border-purple-500/30'}`}>
                <div>
                  <p className={`text-base font-bold ${b.status === 'CLAIMED' ? 'text-slate-600 line-through' : 'text-white'}`}>
                    {b.amount} <span className="text-xs">USDC</span>
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">PR #{b.prId}</p>
                </div>
                {b.status === 'CLAIMED' ? (
                  <div className="px-3 py-1 bg-slate-900 rounded-md border border-slate-800"><span className="text-[10px] text-slate-500 uppercase">Paid ✓</span></div>
                ) : (
                  <button onClick={() => window.location.href = `/claim/${(session?.user as any).id}`} className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-5 py-2 rounded-lg font-bold transition">Claim Now</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}