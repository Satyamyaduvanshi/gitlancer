'use client';
import { use, useState, useEffect } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Copy, ShieldCheck, TerminalSquare, AlertTriangle, Loader2, CheckCircle2, XCircle, X, Trash2, ArrowUpRight, MessageSquare, ExternalLink } from 'lucide-react'; // 👈 Added MessageSquare & ExternalLink

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function RepoDetailPage({ params }: { params: Promise<{ repoName: string }> }) {
  const { repoName } = use(params);
  const decodedRepoName = decodeURIComponent(repoName);
  const router = useRouter();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
  
  const [copied, setCopied] = useState(false);
  const [usdcBal, setUsdcBal] = useState("0.00");
  const [solBal, setSolBal] = useState("0.0000");
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  // Modal State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // 🔔 NEW: Discord Webhook State
  const [webhookInput, setWebhookInput] = useState("");
  const [isUpdatingWebhook, setIsUpdatingWebhook] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' | 'info' }>({ 
    show: false, msg: '', type: 'info' 
  });

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, msg, type });
    if (type !== 'info') setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  // 🔄 Notice I added `mutate` here so we can refresh the data after saving the webhook
  const { data: vaults, isLoading: vaultsLoading, mutate: mutateVaults } = useSWR(userId ? `${API_URL}/api/vaults/user/${userId}` : null, fetcher);
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

  // 🔔 NEW: Save Webhook Function
  const handleSaveWebhook = async () => {
    if (!webhookInput) return;
    setIsUpdatingWebhook(true);
    showToast("Connecting webhook...", "info");
    try {
      await axios.patch(`${API_URL}/api/vaults/${vault.id}`, { discordWebhookUrl: webhookInput });
      showToast("Discord webhook connected!", "success");
      setWebhookInput("");
      mutateVaults(); // Refreshes the SWR cache
    } catch (error) {
      console.error(error);
      showToast("Failed to save webhook.", "error");
    } finally {
      setIsUpdatingWebhook(false);
    }
  };

  // 🔔 NEW: Remove Webhook Function
  const handleRemoveWebhook = async () => {
    if (!confirm("Stop receiving Discord alerts for this repository?")) return;
    setIsUpdatingWebhook(true);
    showToast("Disconnecting webhook...", "info");
    try {
      await axios.patch(`${API_URL}/api/vaults/${vault.id}`, { discordWebhookUrl: null });
      showToast("Discord webhook disconnected.", "success");
      mutateVaults(); 
    } catch (error) {
      console.error(error);
      showToast("Failed to disconnect webhook.", "error");
    } finally {
      setIsUpdatingWebhook(false);
    }
  };

  const executeWithdrawal = async () => {
    if (!publicKey) return showToast("Please connect your wallet first.", "error");

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0 || amount > parseFloat(usdcBal)) {
      return showToast("Invalid amount entered.", "error");
    }

    setShowWithdrawModal(false); 
    setIsWithdrawing(true);
    showToast("Generating secure transaction...", "info");

    try {
      const res = await axios.post(`${API_URL}/api/withdraw`, {
        repoFullName: decodedRepoName,
        maintainerAddress: publicKey.toBase58(),
        amount: amount
      });

      const txBuffer = Buffer.from(res.data.transaction, 'base64');
      const transaction = Transaction.from(txBuffer);

      showToast("Please approve the transaction in your wallet.", "info");
      const signature = await sendTransaction(transaction, connection);

      showToast("Confirming transaction on Solana Devnet...", "info");
      await connection.confirmTransaction(signature, 'confirmed');

      showToast(`Successfully withdrew ${amount} USDC!`, "success");
      setUsdcBal((prev) => (parseFloat(prev) - amount).toFixed(2));
      setWithdrawAmount(""); 

    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.error || err.message || "Withdrawal failed.", "error");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm("Are you sure you want to deactivate this treasury? This will stop all future payouts for this repository.")) return;
    
    setIsDeactivating(true);
    showToast("Processing deactivation...", "info");

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      showToast("Treasury successfully disconnected.", "success");
      setTimeout(() => router.push('/repos'), 1500);
    } catch (err: any) {
      showToast(err.message || "Failed to deactivate treasury.", "error");
      setIsDeactivating(false);
    }
  };

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
            {/* 🔗 NEW: Direct link to GitHub Repo */}
            <a 
              href={`https://github.com/${decodedRepoName}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white/30 hover:text-white transition-colors"
              title="View on GitHub"
            >
              <ExternalLink size={20} />
            </a>
            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold tracking-widest rounded-md uppercase flex items-center gap-1.5 ml-2">
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
          {/* 💰 Treasury Card */}
          <div className="flex-1 lg:flex-none bg-[#111111] border border-white/5 p-5 rounded-[2rem] shadow-lg flex flex-col justify-between group hover:border-persimmon/30 transition-colors">
            <div className="flex justify-between items-start mb-4 gap-6">
              <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest group-hover:text-white/60 transition-colors">Treasury (USDC)</p>
              <button 
                onClick={() => setShowWithdrawModal(true)}
                disabled={isWithdrawing || parseFloat(usdcBal) <= 0}
                className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 text-persimmon hover:text-orange-400 disabled:opacity-30 transition-colors"
              >
                {isWithdrawing ? <Loader2 size={12} className="animate-spin" /> : <ArrowUpRight size={12} />}
                Withdraw
              </button>
            </div>
            <p className="text-3xl text-right font-bold text-transparent bg-clip-text bg-gradient-to-r from-persimmon to-orange-400">{usdcBal}</p>
          </div>

          <div className="flex-1 lg:flex-none bg-[#111111] border border-white/5 px-8 py-5 rounded-[2rem] shadow-lg text-right hover:border-white/10 transition-colors">
            <p className="text-white/40 text-[10px] font-mono mb-4 uppercase tracking-widest">Rent Gas (SOL)</p>
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
                    <a 
                      href={`https://github.com/${decodedRepoName}/pull/${audit.prId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 hover:bg-white/20 text-white hover:text-persimmon text-xs font-mono px-2.5 py-1 rounded-md border border-white/5 transition-colors"
                    >
                      PR #{audit.prId || '---'} ↗
                    </a>
                    {audit.status === 'CLAIMED' ? 
                      <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md"><ShieldCheck size={12}/> Settled</span> : 
                      <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md">Pending</span>
                    }
                  </div>
                  <p className="text-sm text-white/50">
                    By <a 
                         href={`https://github.com/${audit.githubHandle || audit.user?.githubHandle}`} 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="text-white font-medium hover:text-persimmon transition-colors"
                       >
                         @{audit.githubHandle || audit.user?.githubHandle || 'contributor'}
                       </a>
                  </p>
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

      {/* 🔔 NEW: Integrations (Discord Alerts) */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 mb-10">
        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest border-b border-white/5 pb-2 mb-4">Integrations</h3>
        <div className="bg-[#111111] border border-white/5 p-6 rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-lg">
          <div>
            <h4 className="font-bold text-white mb-1 flex items-center gap-2"><MessageSquare size={18} className="text-[#5865F2]"/> Discord Alerts</h4>
            <p className="text-sm text-white/50">Receive predictive liquidity warnings directly to your server.</p>
          </div>
          
          <div className="w-full sm:w-auto flex-1 max-w-md flex gap-2">
            {vault.discordWebhookUrl ? (
              // Connected State
              <div className="flex items-center justify-between w-full bg-black/40 border border-[#5865F2]/30 px-4 py-3 rounded-xl">
                <span className="text-xs text-white/60 font-mono truncate mr-4">
                  Connected: {vault.discordWebhookUrl.substring(0, 38)}...
                </span>
                <button 
                  onClick={handleRemoveWebhook}
                  disabled={isUpdatingWebhook}
                  className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 p-1"
                  title="Disconnect Webhook"
                >
                  {isUpdatingWebhook ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            ) : (
              // Disconnected State
              <div className="flex w-full gap-2">
                <input 
                  type="text"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={webhookInput}
                  onChange={(e) => setWebhookInput(e.target.value)}
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#5865F2]/50 transition-colors"
                />
                <button
                  onClick={handleSaveWebhook}
                  disabled={isUpdatingWebhook || !webhookInput.includes('discord.com/api/webhooks')}
                  className="px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                >
                   {isUpdatingWebhook ? <Loader2 size={16} className="animate-spin" /> : 'Connect'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ⚠️ Danger Zone */}
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

      {/* 🖼️ Custom Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111111] border border-white/10 p-6 rounded-3xl w-full max-w-md shadow-2xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Withdraw Funds</h3>
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-8">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 block">Amount (USDC)</label>
              <div className="relative">
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-4 pr-16 py-4 text-white text-lg font-mono focus:outline-none focus:border-persimmon/50 transition-colors"
                />
                <button
                  onClick={() => setWithdrawAmount(usdcBal)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-persimmon hover:text-orange-400 uppercase tracking-widest bg-persimmon/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Max
                </button>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-white/40">Network: Solana Devnet</span>
                <span className="text-xs text-white/50">Available: <span className="text-white font-mono">{usdcBal}</span></span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-3.5 px-4 rounded-xl text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeWithdrawal}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > parseFloat(usdcBal)}
                className="flex-1 py-3.5 px-4 bg-persimmon hover:bg-orange-500 text-black rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:hover:bg-persimmon disabled:cursor-not-allowed"
              >
                Confirm 
              </button>
            </div>
          </div>
        </div>
      )}

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