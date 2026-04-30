'use client';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import { HandCoins, Clock, ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function ClaimPage() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
  const [claimingId, setClaimingId] = useState<string | null>(null);

  // ⚡ Fetch Real Data!
  const { data: bounties, isLoading } = useSWR(userId ? `${API_URL}/api/bounties/user/${userId}` : null, fetcher);

  // Filter only bounties that are 'AUDITED' (waiting for payout)
  const pendingClaims = bounties?.filter((b: any) => b.status === 'AUDITED').sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || [];
  
  // Calculate the total outstanding dynamically
  const totalPendingAmount = pendingClaims.reduce((sum: number, claim: any) => sum + claim.amount, 0);

  // ⚡ Real Claim Function
  const handleClaim = async (claimId: string) => {
    setClaimingId(claimId);
    try {
      // TODO: If you are using Solana wallet adapter, you would trigger `sendTransaction` here first!
      // const signature = await sendTransaction(...);

      // Tell the backend to update the status to CLAIMED
      await axios.patch(`${API_URL}/api/bounties/${claimId}`, {
        status: 'CLAIMED',
        // txHash: signature // Pass the signature if generated on frontend
      });

      // Instantly refresh the UI without reloading the page
      mutate(`${API_URL}/api/bounties/user/${userId}`);
      
    } catch (error) {
      console.error("Failed to process claim:", error);
      alert("Failed to process claim. Check the console for details.");
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <DashboardLayout>
      
      {/* Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <HandCoins className="text-persimmon" size={36} /> Pending Claims
          </h1>
          <p className="text-foreground/50 text-base mt-2">Authorize on-chain USDC transfers for AI-audited contributions.</p>
        </div>
        
        {/* Total Outstanding Action Box */}
        <div className="bg-persimmon/10 border border-persimmon/20 px-6 py-4 rounded-2xl flex items-center gap-6">
          <div>
            <p className="text-xs font-mono text-persimmon/80 uppercase tracking-widest mb-1">Total Outstanding</p>
            <h2 className="text-3xl font-bold text-persimmon">{totalPendingAmount} <span className="text-lg">USDC</span></h2>
          </div>
          <button 
            disabled={pendingClaims.length === 0}
            className={`font-bold py-2.5 px-5 rounded-xl transition-all shadow-lg active:scale-95 ${
              pendingClaims.length === 0 
                ? 'bg-persimmon/50 text-white/50 shadow-none cursor-not-allowed'
                : 'bg-persimmon hover:bg-persimmon/90 text-white shadow-persimmon/20'
            }`}
          >
            Process All
          </button>
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {isLoading ? (
           <div className="bg-background rounded-3xl border border-black/5 dark:border-white/5 p-16 flex flex-col items-center justify-center text-center shadow-sm">
             <p className="text-persimmon font-mono text-sm animate-pulse">FETCHING PENDING CLAIMS...</p>
           </div>
        ) : pendingClaims.length === 0 ? (
          <div className="bg-background rounded-3xl border border-black/5 dark:border-white/5 p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <CheckCircle2 size={48} className="text-emerald-500/50 mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">All Caught Up</h3>
            <p className="text-foreground/50 text-sm">There are no pending claims awaiting your authorization.</p>
          </div>
        ) : (
          pendingClaims.map((claim: any) => {
            // ⚡ Extracting from Prisma relations just like the Payment History page
            const handle = claim.user?.githubHandle || 'github_user';
            const avatarUrl = claim.user?.avatarUrl || `https://github.com/${handle}.png`;
            const repo = claim.vault?.repositoryFullName || 'unknown/repo';
            const prId = claim.prId;

            return (
              <div key={claim.id} className="bg-background rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-black/5 dark:border-white/5 p-6 flex items-center justify-between group hover:border-black/10 dark:hover:border-white/10 transition-all">
                
                {/* 1. Recipient Info */}
                <div className="flex items-center gap-4 w-1/4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-black/10 dark:border-white/10">
                    <Image src={avatarUrl} alt={handle} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mb-0.5">Recipient</p>
                    <p className="text-base font-bold text-foreground tracking-wide">{handle}</p>
                  </div>
                </div>

                {/* 2. Repository & PR */}
                <div className="w-1/4">
                  <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mb-0.5">Contribution</p>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{repo.split('/')[1] || repo}</span>
                    <Link href={`https://github.com/${repo}/pull/${prId}`} target="_blank" className="text-xs text-foreground/50 font-mono hover:text-persimmon transition-colors flex items-center gap-1 w-fit mt-1">
                      PR #{prId} <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>

                {/* 3. Status / Time */}
                <div className="w-1/4">
                  <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mb-1">Status</p>
                  <div className="flex flex-col gap-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold w-fit">
                      <ShieldAlert size={14} /> AI Audited
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-foreground/40 font-mono">
                      <Clock size={10} /> {new Date(claim.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* 4. Action Area */}
                <div className="w-1/4 flex items-center justify-end gap-5">
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mb-0.5">Payout</p>
                    <p className="text-2xl font-bold text-foreground">{claim.amount} <span className="text-xs text-persimmon">USDC</span></p>
                  </div>
                  
                  <button 
                    onClick={() => handleClaim(claim.id)}
                    disabled={claimingId === claim.id}
                    className={`py-3 px-6 rounded-xl font-bold text-sm transition-all shadow-sm ${
                      claimingId === claim.id 
                        ? 'bg-black/5 dark:bg-white/5 text-foreground/30 cursor-not-allowed'
                        : 'bg-foreground text-background hover:opacity-90 active:scale-95'
                    }`}
                  >
                    {claimingId === claim.id ? 'Signing...' : 'Authorize'}
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </DashboardLayout>
  );
}