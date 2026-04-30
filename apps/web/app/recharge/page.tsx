'use client';
import { useState, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, PublicKey } from '@solana/web3.js';
import { createTransferCheckedInstruction, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import { ArrowRight, ShieldCheck, Zap, Coins, AlertTriangle, Search, CheckCircle2, XCircle, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function RechargePage() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
  const { connection } = useConnection();
  const wallet = useWallet();

  const { data: vaults, isLoading } = useSWR(userId ? `${API_URL}/api/vaults/user/${userId}` : null, fetcher);
  
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [fundingId, setFundingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 🍞 Custom Toast Notification State
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' }>({ 
    show: false, msg: '', type: 'success' 
  });

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, msg, type });
    // Auto-hide after 4 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // 🔍 Real-time Search Filter
  const filteredVaults = useMemo(() => {
    if (!vaults) return [];
    return vaults.filter((vault: any) => 
      vault.repositoryFullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [vaults, searchQuery]);

  const executeFunding = async (pda: string) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      return showToast("Please connect your Solana wallet first.", "error");
    }
    
    const amountNum = Number(amounts[pda]);
    if (!amountNum || amountNum <= 0) {
      return showToast("Please enter a valid USDC amount.", "error");
    }

    setFundingId(pda);
    try {
      const fromAta = await getAssociatedTokenAddress(USDC_MINT, wallet.publicKey);
      const toAta = await getAssociatedTokenAddress(USDC_MINT, new PublicKey(pda), true);
      const tx = new Transaction();

      try { 
        await connection.getTokenAccountBalance(toAta); 
      } catch { 
        tx.add(createAssociatedTokenAccountInstruction(wallet.publicKey, toAta, new PublicKey(pda), USDC_MINT)); 
      }

      tx.add(createTransferCheckedInstruction(fromAta, USDC_MINT, toAta, wallet.publicKey, amountNum * 1_000_000, 6));

      const signature = await wallet.sendTransaction(tx, connection);
      console.log("Transaction Signature:", signature);
      
      setAmounts({ ...amounts, [pda]: '' });
      showToast(`Successfully funded vault with ${amountNum} USDC!`, "success");

    } catch (e: any) { 
      // Make error messages cleaner if user rejected
      let errorMsg = e.message;
      if (errorMsg.includes("User rejected")) {
        errorMsg = "Transaction was rejected in your wallet.";
      }
      showToast(errorMsg, "error");
    } finally {
      setFundingId(null);
    }
  };

  return (
    <DashboardLayout>
      {/* 🚀 Sleek Header Section */}
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700 ease-out">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Treasury Management
        </h1>
        <p className="text-foreground/50 text-sm mt-2 max-w-2xl">
          Fuel your repository smart contracts with Devnet USDC to power automated contributor payouts.
        </p>
      </div>

      {/* 💳 Wallet State & Global Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
        
        {/* ⚡ Wallet Card */}
        <div className="lg:col-span-2 bg-persimmon rounded-[2rem] p-8 shadow-xl shadow-persimmon/20 relative flex flex-col justify-between min-h-[180px] group">
          
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
          </div>
          
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h3 className="text-white/80 font-medium text-sm flex items-center gap-2">
                <ShieldCheck size={16} /> Liquidity Source
              </h3>
              <h2 className="text-2xl font-bold text-white mt-1">
                {wallet.connected ? "Wallet Connected" : "Connection Required"}
              </h2>
            </div>
            
            <div className="relative px-3 mt-4 mb-14 flex flex-col group/wallet">
                <div className="transition-transform duration-300 ease-out group-hover/wallet:scale-[1.02]">
                  <WalletMultiButtonDynamic 
                    className="w-full! justify-start! px-3! h-11! rounded-xl! bg-white/5! hover:bg-white/10! border! border-white/5! hover:border-white/10! hover:border-persimmon/30! hover:shadow-[0_0_15px_rgba(252,76,2,0.15)]! text-foreground! font-sans! font-medium! text-sm! tracking-wide transition-all duration-300 active:scale-[0.98]!" 
                  />
                </div>
                
                {/* Hand-Drawn Arrow Callout */}
                <div className="absolute -bottom-[70px] right-[100px] rotate-30 pointer-events-none select-none opacity-60 dark:opacity-80 transition-all duration-500 ease-out group-hover/wallet:opacity-100 group-hover/wallet:translate-x-1 group-hover/wallet:-rotate-3">
                  <Image 
                    src="/walletwhite.svg" 
                    alt="Connect Wallet Indicator" 
                    width={50}   
                    height={50} 
                    className="object-contain drop-shadow-md" 
                  />
                </div>
              </div>
          </div>

          <div className="relative z-10 flex items-center gap-6 mt-6">
            <div className="flex flex-col">
              <span className="text-white/50 text-[10px] uppercase font-mono tracking-widest">Network</span>
              <span className="text-white font-bold text-sm">Solana Devnet</span>
            </div>
            <div className="flex flex-col border-l border-white/20 pl-6">
              <span className="text-white/50 text-[10px] uppercase font-mono tracking-widest">Asset</span>
              <span className="text-white font-bold text-sm">USDC-Dev</span>
            </div>
          </div>
        </div>
        
        {/* Total Vaults Stats Card */}
        <div className="bg-background border border-black/5 dark:border-white/5 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.15)] flex flex-col justify-center items-center text-center group hover:border-persimmon/30 transition-all duration-500">
           <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
             <Coins size={32} />
           </div>
           <p className="text-xs font-mono text-foreground/40 uppercase tracking-widest mb-1">Total Vaults</p>
           <h2 className="text-4xl font-bold text-foreground">{vaults?.length || 0}</h2>
        </div>
      </div>

      {/* ⚠️ Caution Banner & 🔍 Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        
        {/* Caution Message */}
        <div className="flex items-start md:items-center gap-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 px-5 py-3.5 rounded-2xl text-xs flex-1 shadow-sm">
          <AlertTriangle size={18} className="flex-shrink-0 mt-0.5 md:mt-0" />
          <p className="leading-relaxed">
            <strong>Caution:</strong> You cannot add USDC directly from a faucet to the PDA. You must fund the vault using Devnet USDC held within your connected wallet.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80 flex-shrink-0 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-persimmon transition-colors" />
          <input 
            type="text" 
            placeholder="Search repositories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-black/5 dark:border-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-persimmon/20 focus:border-persimmon transition-all shadow-sm placeholder:text-foreground/30 font-sans"
          />
        </div>
      </div>

      {/* 📂 Vault Funding Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
        {isLoading ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-persimmon font-mono text-sm animate-pulse">SYNCHRONIZING VAULT DATA...</p>
          </div>
        ) : filteredVaults?.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-foreground/40 text-sm">No repositories found matching "{searchQuery}"</p>
          </div>
        ) : filteredVaults?.map((vault: any) => (
          <div 
            key={vault.id} 
            className="bg-background border border-black/5 dark:border-white/5 p-7 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.15)] flex flex-col justify-between hover:shadow-2xl hover:border-persimmon/20 transition-all duration-500 group"
          >
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-black/5 dark:bg-white/5 rounded-xl text-foreground/40 group-hover:text-persimmon group-hover:bg-persimmon/5 transition-colors">
                  <Zap size={20} />
                </div>
                <h3 className="font-bold text-foreground text-lg truncate tracking-tight">
                  {vault.repositoryFullName.split('/')[1] || vault.repositoryFullName}
                </h3>
              </div>
              <div className="bg-black/5 dark:bg-white/5 rounded-xl p-3 border border-black/5 dark:border-white/5">
                <p className="text-[10px] font-mono text-foreground/30 uppercase mb-1">PDA Address</p>
                <p className="text-[11px] font-mono text-foreground/60 truncate">{vault.pdaAddress}</p>
              </div>
            </div>
            
            <div className="flex gap-3 relative">
              <div className="relative flex-1">
                <input 
                  type="number" 
                  min="0"
                  step="any"
                  placeholder="0.00" 
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-persimmon/20 focus:border-persimmon transition font-mono pr-14 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                  value={amounts[vault.pdaAddress] || ''}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e') e.preventDefault();
                  }}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (Number(val) >= 0 || val === '') {
                      setAmounts({ ...amounts, [vault.pdaAddress]: val });
                    }
                  }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-foreground/30 pointer-events-none">USDC</span>
              </div>
              <button 
                onClick={() => executeFunding(vault.pdaAddress)}
                disabled={fundingId === vault.pdaAddress}
                className="bg-foreground text-background hover:bg-persimmon hover:text-white px-5 rounded-2xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:hover:bg-foreground active:scale-95 shadow-lg group/btn"
              >
                {fundingId === vault.pdaAddress ? (
                  <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                ) : (
                  <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🍞 Sleek Custom Toast Notification (Bottom Right) */}
      <div 
        className={`fixed bottom-6 right-6 z-[100] max-w-sm w-full bg-[#111111] border rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-start gap-3 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          toast.show ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-10 opacity-0 scale-95 pointer-events-none'
        } ${
          toast.type === 'success' ? 'border-emerald-500/30' : 'border-red-500/30'
        }`}
      >
        <div className="mt-0.5">
          {toast.type === 'success' ? (
            <CheckCircle2 size={20} className="text-emerald-500" />
          ) : (
            <XCircle size={20} className="text-red-500" />
          )}
        </div>
        <div className="flex-1 pr-4">
          <h4 className={`text-sm font-bold tracking-tight mb-1 ${toast.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
            {toast.type === 'success' ? 'Success' : 'Transaction Failed'}
          </h4>
          <p className="text-xs text-white/70 leading-relaxed break-words">{toast.msg}</p>
        </div>
        <button 
          onClick={() => setToast({ ...toast, show: false })}
          className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

    </DashboardLayout>
  );
}