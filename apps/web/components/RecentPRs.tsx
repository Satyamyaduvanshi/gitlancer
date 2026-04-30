'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, GitPullRequest } from 'lucide-react';

export default function RecentPRs({ bounties, loading }: { bounties: any[], loading: boolean }) {
  const recentItems = bounties?.slice(0, 5) || [];

  return (
    <div className="bg-background rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-black/5 dark:border-white/5 p-6 flex flex-col h-full min-h-[300px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
          <GitPullRequest size={20} className="text-persimmon" /> Recent Contributions
        </h3>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-black/5 dark:bg-white/5 rounded-2xl w-full" />)}
          </div>
        ) : recentItems.length === 0 ? (
          <p className="text-xs text-foreground/30 text-center mt-10">No recent PR activity found.</p>
        ) : (
          recentItems.map((bounty: any) => {
            // ⚡ THE FIX: Extracting from Prisma relations
            const handle = bounty.user?.githubHandle || 'github_user';
            const avatarUrl = bounty.user?.avatarUrl || `https://github.com/${handle}.png`;
            const repo = bounty.vault?.repositoryFullName || 'unknown/repo';
            const prId = bounty.prId;

            return (
              <div key={bounty.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group border border-transparent hover:border-black/5 dark:hover:border-white/5">
                
                {/* 👤 Clickable User Profile */}
                <Link href={`https://github.com/${handle}`} target="_blank" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-black/10 dark:border-white/10 shadow-sm">
                    <Image src={avatarUrl} alt={handle} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground leading-tight tracking-wide">
                      {handle}
                    </p>
                    <p className="text-[10px] text-foreground/50 font-mono mt-0.5 bg-black/5 dark:bg-white/5 w-fit px-1.5 py-0.5 rounded">
                      PR #{prId}
                    </p>
                  </div>
                </Link>

                {/* 🔗 Clickable PR Link */}
                <Link 
                  href={`https://github.com/${repo}/pull/${prId}`}
                  target="_blank"
                  className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-foreground/40 hover:text-persimmon hover:bg-persimmon/10 transition-all opacity-50 group-hover:opacity-100 shadow-sm"
                >
                  <ExternalLink size={16} />
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}