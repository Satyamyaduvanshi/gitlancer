'use client';
import Link from 'next/link';
import { Plus, FolderGit2 } from 'lucide-react';

export default function RecentVaults({ vaults, loading }: { vaults: any[], loading: boolean }) {
  // Take only the latest 4 for the UI widget
  const displayVaults = vaults?.slice(0, 4) || [];

  return (
    <div className="bg-background rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-black/5 dark:border-white/5 p-6 flex flex-col h-full">
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-foreground text-lg">Active Vaults</h3>
        <Link 
          href="/repos/new" 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-xs font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all"
        >
          <Plus size={14} /> New
        </Link>
      </div>

      <div className="space-y-4 flex-1">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 items-center animate-pulse">
                <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-black/5 dark:bg-white/5 rounded w-1/2" />
                  <div className="h-2 bg-black/5 dark:bg-white/5 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : displayVaults.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
            <FolderGit2 size={32} className="mb-2 text-foreground/30" />
            <p className="text-xs text-foreground/50">No vaults initialized yet.</p>
          </div>
        ) : (
          displayVaults.map((vault: any, i: number) => {
            // Generating random colors for the placeholder icons to match the design
            const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500'];
            const repoName = vault.repositoryFullName?.split('/')[1] || 'Unknown Repo';
            const dateStr = new Date(vault.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            return (
              <div key={vault.id || i} className="flex items-center gap-4 group cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-2 -mx-2 rounded-2xl transition-all">
                {/* Colored Icon Circle */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm ${colors[i % colors.length]}`}>
                  <FolderGit2 size={18} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate group-hover:text-persimmon transition-colors">{repoName}</p>
                  <p className="text-[10px] text-foreground/50 font-mono truncate mt-0.5">Anchored: {dateStr}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}