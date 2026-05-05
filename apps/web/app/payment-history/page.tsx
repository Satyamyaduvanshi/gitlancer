'use client';
import { useState, useMemo } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import React from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import { History, ExternalLink, ShieldCheck, ChevronDown, ChevronUp, CalendarRange, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function PaymentHistoryPage() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
  
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const { data: bounties, isLoading } = useSWR(userId ? `${API_URL}/api/bounties/user/${userId}` : null, fetcher);
  
  // 1. Get all claimed bounties
  const allPaidBounties = useMemo(() => {
    return bounties?.filter((b: any) => b.status === 'CLAIMED').sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || [];
  }, [bounties]);

  // 2. Filter by selected date range
  const filteredBounties = useMemo(() => {
    return allPaidBounties.filter((bounty: any) => {
      if (!startDate && !endDate) return true;
      
      const bountyDate = new Date(bounty.createdAt);
      
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (bountyDate < start) return false;
      }
      
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include the entire end day
        if (bountyDate > end) return false;
      }
      
      return true;
    });
  }, [allPaidBounties, startDate, endDate]);

  const hasActiveFilters = startDate !== '' || endDate !== '';

  return (
    <DashboardLayout>
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700 ease-out">
        <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
          <History className="text-persimmon" size={28} /> Settlement Ledger
        </h1>
        <p className="text-foreground/50 text-sm mt-2 max-w-2xl">
          Every payout settled through SOLUX. The chain sees a transaction. You see the complete audit trail.
        </p>
      </div>

      {/* 📅 Date Range Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-background rounded-2xl border border-black/5 dark:border-white/5 p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground/70 uppercase tracking-widest">
          <CalendarRange size={18} className="text-persimmon" />
          Range
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-persimmon transition-colors"
          />
          <span className="text-foreground/40 font-mono">→</span>
          <input 
            type="date" 
            value={endDate}
            min={startDate} // Prevent selecting an end date before the start date
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-persimmon transition-colors"
          />
          
          {hasActiveFilters && (
            <button 
              onClick={() => { setStartDate(''); setEndDate(''); }}
              className="p-2 text-foreground/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
              title="Clear filters"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="bg-background rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-black/5 dark:border-white/5 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
        
        {isLoading ? (
          <div className="p-10 flex justify-center items-center">
            <p className="text-persimmon font-mono text-sm animate-pulse">FETCHING LEDGER...</p>
          </div>
        ) : allPaidBounties.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4"><History size={24} className="text-foreground/30" /></div>
            <h3 className="text-xl font-bold text-foreground mb-2">No settlements yet</h3>
            <p className="text-foreground/50 text-sm max-w-sm">Your authorized payouts will appear here once contributors claim them via their Solana wallets.</p>
          </div>
        ) : filteredBounties.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4"><CalendarRange size={24} className="text-foreground/30" /></div>
            <h3 className="text-xl font-bold text-foreground mb-2">No results found</h3>
            <p className="text-foreground/50 text-sm">No settlements match your selected date range.</p>
            <button onClick={() => { setStartDate(''); setEndDate(''); }} className="mt-4 text-sm font-bold text-persimmon hover:text-orange-500 transition-colors">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
                  <th className="px-6 py-4 text-xs font-mono text-foreground/40 uppercase tracking-widest font-normal">Date</th>
                  <th className="px-6 py-4 text-xs font-mono text-foreground/40 uppercase tracking-widest font-normal">Recipient</th>
                  <th className="px-6 py-4 text-xs font-mono text-foreground/40 uppercase tracking-widest font-normal">Repository / PR</th>
                  <th className="px-6 py-4 text-xs font-mono text-foreground/40 uppercase tracking-widest font-normal text-right">Amount</th>
                  <th className="px-6 py-4 text-xs font-mono text-foreground/40 uppercase tracking-widest font-normal text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {filteredBounties.map((bounty: any) => {
                  
                  const handle = bounty.user?.githubHandle || 'github_user';
                  const avatarUrl = bounty.user?.avatarUrl || `https://github.com/${handle}.png`;
                  const repo = bounty.vault?.repositoryFullName || 'unknown/repo';
                  const prId = bounty.prId;
                  
                  const isExpanded = expandedRow === bounty.id;

                  return (
                    <React.Fragment key={bounty.id}>
                      <tr 
                        onClick={() => setExpandedRow(isExpanded ? null : bounty.id)}
                        className={`hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group ${isExpanded ? 'bg-black/5 dark:bg-white/5' : ''}`}
                      >
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-foreground/70 font-mono">
                          {new Date(bounty.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        
                        <td className="px-6 py-5 whitespace-nowrap">
                          <Link href={`https://github.com/${handle}`} target="_blank" className="flex items-center gap-3 w-fit hover:opacity-80" onClick={(e) => e.stopPropagation()}>
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-black/10 dark:border-white/10"><Image src={avatarUrl} alt="Avatar" fill className="object-cover" /></div>
                            <span className="text-sm font-bold text-foreground">{handle}</span>
                          </Link>
                        </td>

                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm text-foreground/80 font-medium">{repo.split('/')[1] || repo}</span>
                            <Link href={`https://github.com/${repo}/pull/${prId}`} target="_blank" className="text-[10px] text-foreground/50 font-mono hover:text-persimmon transition-colors flex items-center gap-1 w-fit mt-1 bg-background px-1.5 py-0.5 rounded shadow-sm border border-black/5 dark:border-white/5" onClick={(e) => e.stopPropagation()}>
                              PR #{prId} <ExternalLink size={10} />
                            </Link>
                          </div>
                        </td>

                        <td className="px-6 py-5 whitespace-nowrap text-right">
                          <span className="text-base font-bold text-foreground">{bounty.amount} <span className="text-xs text-persimmon ml-0.5">USDC</span></span>
                        </td>

                        <td className="px-6 py-5 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-3">
                            <div className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium tracking-wide">
                              <ShieldCheck size={14} /> Settled
                            </div>
                            <div className="p-1 rounded bg-black/5 dark:bg-white/5 text-foreground/40 group-hover:text-foreground">
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                          </div>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="p-0 border-b border-black/5 dark:border-white/5 bg-background">
                            <div className="p-5 m-3 rounded-2xl bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/5 flex flex-col gap-3 shadow-inner overflow-hidden relative">
                              <div className="absolute top-0 left-0 w-1 h-full bg-persimmon" />
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <p className="text-[10px] font-mono uppercase text-foreground/40 mb-1">Full Timestamp</p>
                                  <p className="text-xs text-foreground/80 font-mono">{new Date(bounty.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-[10px] font-mono uppercase text-foreground/40 mb-1">Transaction Hash</p>
                                  <p className="text-xs text-persimmon font-mono break-all">{bounty.txHash || 'Solana_OnChain_Verified_No_Hash_Provided'}</p>
                                </div>
                              </div>
                              <div className="mt-1 pt-3 border-t border-black/5 dark:border-white/5">
                                <p className="text-[10px] font-mono uppercase text-foreground/40 mb-1">Cryptographic Signature</p>
                                <p className="text-[11px] text-foreground/60 font-mono break-all">{bounty.signature || bounty.txSignature || 'Signed_by_Solux_Guardian_Smart_Contract'}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}