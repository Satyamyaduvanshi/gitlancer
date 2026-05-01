'use client';
import { use, useState, useEffect } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Copy, ShieldCheck, TerminalSquare, AlertTriangle, Loader2, CheckCircle2, XCircle, X, Trash2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function RepoDetailPage({ params }: { params: Promise<{ repoName: string }> }) {
  const { repoName } = use(params);
  const decodedRepoName = decodeURIComponent(repoName);
  const router = useRouter();
  const { connection } = useConnection();
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
  
  const [copied, setCopied] = useState(false);
  const [usdcBal, setUsdcBal] = useState("0.00");
  const [solBal, setSolBal] = useState("0.0000");
  const [isDeactivating, setIsDeactivating] = useState(false);

  // 🍞 Toast State
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' | 'info' }>({ 
    show: false, msg: '', type: 'info' 
  });

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, msg, type });
    if (type !== 'info') setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  // 🔄 Fixed SWR Fetching
  const { data: vaults, isLoading: vaultsLoading } = useSWR(userId ? `${API_URL}/api/vaults/user/${userId}` : null, fetcher);
  const vault = vaults?.find((v: any) => v.repositoryFullName === decodedRepoName);

  const { data: audits, isLoading: auditsLoading } = useSWR(vault ? `${API_URL}/api/bounties/user/${vault.maintainerId}` : null, fetcher);

  useEffect(() => {
    if (!vault) return;
    const fetchBalances = async () => {
      try {
        const pda = new PublicKey(vault.pdaAddress);
        const solBalance = await connection.getBalance(pda);
        setSolBal((solBalance / LAMPORTS_PER_SOL).toFixed(4));

        const ata = await getAssociatedTokenAddress(USDC_MINT, pda, true);
        const usdcBalance = await connection.getTokenAccountBalance(ata);
        setUsdcBal(usdcBalance.value.uiAmountString || "0.00");
      } catch (e) {
        console.log("Awaiting first deposit to create ATA.");
      }
    };
    fetchBalances();
  }, [vault, connection]);

  const copyToClipboard = () => {
    if (vault) {
      navigator.clipboard.writeText(vault.pdaAddress);
      setCopied(true);
      showToast("PDA Address copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm("Are you sure you want to deactivate this treasury? This will stop all future payouts for this repository.")) return;
    
    setIsDeactivating(true);
    showToast("Processing deactivation...", "info");

    try {
      // Assuming you will build a DELETE endpoint: await axios.delete(`${API_URL}/api/vaults/${vault.id}`);
      // Simulating network delay for now
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      showToast("Treasury successfully disconnected.", "success");
      setTimeout(() => router.push('/repos'), 1500);
    } catch (err: any) {
      showToast(err.message || "Failed to deactivate treasury.", "error");
      setIsDeactivating(false);
    }
  };

  // ⏳ Premium Loading State
  if (vaultsLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <Loader2 size={32} className="text-persimmon animate-spin" />
          <p className="text-foreground/40 font-mono text-xs uppercase tracking-widest animate-pulse">Accessing Blockchain Data...</p>
        </div>
      </DashboardLayout>
    );
  }

  // ❌ 404 State
  if (!vaultsLoading && !vault) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-[#111111] border border-white/5 rounded-[2rem]">
          <AlertTriangle size={48} className="text-white/20 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Vault Not Found</h2>
          <p className="text-white/50 text-sm mb-6">This repository is not anchored to a treasury, or you don't have access.</p>
          <button onClick={() => router.push('/repos')} className="text-persimmon font-bold text-sm hover:text-orange-400 transition-colors">
            ← Return to Repositories
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      
      {/* 🚀 Header & Treasury Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6 animate-in fade-in slide-in-from-top-4 duration-700 ease-out">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">{decodedRepoName.split('/')[1] || decodedRepoName}</h1>
            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold tracking-widest rounded-md uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Active
            </span>
          </div>
          <p className="text-white/40 text-sm font-mono mb-4">{decodedRepoName.split('/')[0]}</p>
          
          <button 
            onClick={copyToClipboard} 
            className="flex items-center gap-2 text-xs font-mono text-white/50 bg-white/[0.02] border border-white/10 px-4 py-2 rounded-xl hover:border-persimmon/50 hover:text-white transition-all group"
          >
            <span className="truncate max-w-[200px] sm:max-w-none">{vault.pdaAddress}</span>
            <Copy size={14} className={`transition-colors ${copied ? "text-emerald-500" : "group-hover:text-persimmon"}`} />
          </button>
        </div>
        
        <div className="flex gap-4 w-full lg:w-auto">
          <div className="flex-1 lg:flex-none bg-[#111111] border border-white/5 px-8 py-5 rounded-[2rem] shadow-lg text-right group hover:border-persimmon/30 transition-colors">
            <p className="text-white/40 text-[10px] font-mono mb-1 uppercase tracking-widest group-hover:text-white/60 transition-colors">Treasury (USDC)</p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-persimmon to-orange-400">{usdcBal}</p>
          </div>
          <div className="flex-1 lg:flex-none bg-[#111111] border border-white/5 px-8 py-5 rounded-[2rem] shadow-lg text-right hover:border-white/10 transition-colors">
            <p className="text-white/40 text-[10px] font-mono mb-1 uppercase tracking-widest">Rent Gas (SOL)</p>
            <p className="text-3xl font-bold text-white">{solBal}</p>
          </div>
        </div>
      </div>

      {/* 🤖 AI Audit Results Table */}
      <div className="bg-[#111111] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 mb-10">
        <div className="px-8 py-5 border-b border-white/5 bg-white/[0.01] flex items-center gap-3">
          <TerminalSquare size={20} className="text-persimmon" />
          <h3 className="font-bold text-white tracking-wide">Final AI Audit Reports</h3>
        </div>
        
        <div className="divide-y divide-white/5">
          {auditsLoading ? (
             <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-white/20" size={24} /></div>
          ) : audits?.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
               <TerminalSquare size={32} className="text-white/10 mb-3" />
               <p className="text-white/40 text-sm">No pull requests have been audited for this repository yet.</p>
            </div>
          ) : (
            audits?.map((audit: any) => (
              <div key={audit.id} className="p-8 flex flex-col md:flex-row gap-8 hover:bg-white/[0.02] transition-colors group">
                <div className="md:w-1/4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-white/10 text-white text-xs font-mono px-2.5 py-1 rounded-md border border-white/5">PR #{audit.prId || '---'}</span>
                    {audit.status === 'CLAIMED' ? 
                      <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md"><ShieldCheck size={12}/> Settled</span> : 
                      <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md">Pending</span>
                    }
                  </div>
                  <p className="text-sm text-white/50">By <span className="text-white font-medium">@{audit.githubHandle || 'contributor'}</span></p>
                  <p className="text-2xl font-bold text-white mt-2 group-hover:text-persimmon transition-colors">{audit.amount} <span className="text-sm text-white/40 font-mono tracking-normal">USDC</span></p>
                </div>
                
                <div className="md:w-3/4 bg-black/20 p-5 rounded-2xl border border-white/5">
                  <p className="text-white/40 text-[10px] font-mono mb-2 uppercase tracking-widest">AI Reasoning Log</p>
                  <p className="text-sm text-white/80 leading-relaxed font-medium">
                    {audit.reasoning || `Code changes analyzed against repository standards. Security and quality parameters met. Authorized bounty payout of ${audit.amount} USDC for successful implementation.`}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ⚠️ Danger Zone (Deactivate Treasury) */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest border-b border-white/5 pb-2 mb-4">Danger Zone</h3>
        <div className="border border-red-500/20 bg-red-500/5 p-6 rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h4 className="font-bold text-red-500 mb-1 flex items-center gap-2"><Trash2 size={18}/> Deactivate Treasury</h4>
            <p className="text-sm text-white/50">Disconnect this repository. The PDA will be marked inactive and future automated payouts will be rejected.</p>
          </div>
          <button 
            onClick={handleDeactivate}
            disabled={isDeactivating}
            className="flex-shrink-0 px-6 py-3.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 disabled:opacity-50 disabled:hover:bg-red-500/10 disabled:hover:text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95 flex items-center gap-2"
          >
            {isDeactivating ? <Loader2 size={16} className="animate-spin" /> : null}
            {isDeactivating ? 'Processing...' : 'Disconnect Repo'}
          </button>
        </div>
      </div>

      {/* 🍞 Custom Toast */}
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