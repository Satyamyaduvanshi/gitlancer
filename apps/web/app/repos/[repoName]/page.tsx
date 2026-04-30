'use client';
import { use, useState, useEffect } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import DashboardLayout from '@/components/DashboardLayout';
import { Copy, ShieldCheck, TerminalSquare } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function RepoDetailPage({ params }: { params: Promise<{ repoName: string }> }) {
  const { repoName } = use(params);
  const decodedRepoName = decodeURIComponent(repoName);
  const { connection } = useConnection();
  
  const [copied, setCopied] = useState(false);
  const [usdcBal, setUsdcBal] = useState("0.00");
  const [solBal, setSolBal] = useState("0.0000");

  const { data: vaults } = useSWR(`${API_URL}/api/vaults`, fetcher);
  const vault = vaults?.find((v: any) => v.repositoryFullName === decodedRepoName);

  // Note: Swap this endpoint to fetch bounties specifically by vaultId if your backend supports it
  const { data: audits } = useSWR(vault ? `${API_URL}/api/bounties/user/${vault.maintainerId}` : null, fetcher);

  useEffect(() => {
    if (!vault) return;
    const pda = new PublicKey(vault.pdaAddress);
    connection.getBalance(pda).then(bal => setSolBal((bal / LAMPORTS_PER_SOL).toFixed(4))).catch(() => {});
    getAssociatedTokenAddress(USDC_MINT, pda, true)
      .then(ata => connection.getTokenAccountBalance(ata))
      .then(bal => setUsdcBal(bal.value.uiAmountString || "0.00")).catch(() => {});
  }, [vault, connection]);

  const copyToClipboard = () => {
    if (vault) {
      navigator.clipboard.writeText(vault.pdaAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!vault) return <DashboardLayout><div className="animate-pulse h-64 bg-[#0b0c10] border border-white/5 rounded-2xl" /></DashboardLayout>;

  return (
    <DashboardLayout>
      {/* Header & Treasury Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#e8e8ea] mb-2">{decodedRepoName}</h1>
          <button onClick={copyToClipboard} className="flex items-center gap-2 text-xs font-mono text-[#e8e8ea]/50 bg-[#0b0c10] border border-white/5 px-3 py-1.5 rounded-lg hover:border-[#fc4c02]/50 hover:text-[#e8e8ea] transition">
            {vault.pdaAddress} <Copy size={12} className={copied ? "text-[#fc4c02]" : ""} />
          </button>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-[#0b0c10] border border-white/5 px-6 py-4 rounded-xl text-right">
            <p className="text-[#e8e8ea]/50 text-xs font-mono mb-1 uppercase">Treasury (USDC)</p>
            <p className="text-2xl font-bold text-[#fc4c02]">{usdcBal}</p>
          </div>
          <div className="bg-[#0b0c10] border border-white/5 px-6 py-4 rounded-xl text-right">
            <p className="text-[#e8e8ea]/50 text-xs font-mono mb-1 uppercase">Gas (SOL)</p>
            <p className="text-2xl font-bold text-[#e8e8ea]">{solBal}</p>
          </div>
        </div>
      </div>

      {/* AI Audit Results Table */}
      <div className="bg-[#0b0c10] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
          <TerminalSquare size={16} className="text-[#fc4c02]" />
          <h3 className="font-bold text-[#e8e8ea]">Final AI Audit Reports</h3>
        </div>
        
        <div className="divide-y divide-white/5">
          {audits?.length === 0 ? (
            <div className="p-8 text-center text-[#e8e8ea]/40 text-sm font-mono">No audits generated for this repository yet.</div>
          ) : (
            audits?.map((audit: any) => (
              <div key={audit.id} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-white/[0.02] transition">
                <div className="md:w-1/4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#1f2833] text-[#e8e8ea] text-xs font-mono px-2 py-1 rounded">PR #{audit.prId}</span>
                    {audit.status === 'CLAIMED' ? 
                      <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-[#fc4c02]"><ShieldCheck size={12}/> Paid</span> : 
                      <span className="text-[10px] uppercase font-bold text-[#e8e8ea]/50">Pending</span>
                    }
                  </div>
                  <p className="text-sm text-[#e8e8ea]/60">By <span className="text-[#e8e8ea] font-medium">@contributor</span></p>
                  <p className="text-xl font-bold text-[#fc4c02] mt-2">{audit.amount} USDC</p>
                </div>
                
                <div className="md:w-3/4">
                  <p className="text-[#e8e8ea]/50 text-xs font-mono mb-2 uppercase">AI Reasoning</p>
                  <p className="text-sm text-[#e8e8ea] leading-relaxed">
                    {/* Assuming your backend starts saving the reasoning string, map it here. Using a placeholder based on amount for now if not available. */}
                    {audit.reasoning || `Code changes analyzed. Quality standards met. Authorized bounty of ${audit.amount} USDC for successful implementation.`}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}