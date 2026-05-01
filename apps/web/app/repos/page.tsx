'use client';
import { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import { Search, Plus, FolderGit2, ArrowRight } from 'lucide-react'; // ⚡ Removed 'Github'
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function RepositoriesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
  const [searchQuery, setSearchQuery] = useState('');

  const { data: vaults, isLoading } = useSWR(userId ? `${API_URL}/api/vaults/user/${userId}` : null, fetcher);

  const filteredVaults = vaults?.filter((v: any) => 
    v.repositoryFullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      
      {/* 🚀 Sleek Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 animate-in fade-in slide-in-from-top-4 duration-700 ease-out">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Repositories</h1>
            <p className="text-foreground/50 text-sm mt-1">Manage and monitor your anchored git treasuries.</p>
          </div>
        </div>
        
        {/* ⚡ The Wired-Up Button */}
        <button 
          onClick={() => router.push('/repos/new')}
          className="flex items-center gap-2 px-6 py-3.5 bg-white text-black rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-100 transition-all shadow-lg hover:shadow-white/10 active:scale-95 group flex-shrink-0"
        >
          <Plus size={18} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" /> 
          Initialize Repo
        </button>
      </div>

      {/* 🔍 Search Bar */}
      <div className="relative w-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 group">
        <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-persimmon transition-colors duration-300" />
        <input 
          type="text" 
          placeholder="Search anchored repositories..." 
          className="w-full bg-background border border-black/10 dark:border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-persimmon/20 focus:border-persimmon transition-all shadow-sm placeholder:text-foreground/30 font-sans"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 📂 Repo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
        {isLoading ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-persimmon font-mono text-sm animate-pulse">SCANNING BLOCKCHAIN FOR VAULTS...</p>
          </div>
        ) : filteredVaults?.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-[#111111]/50 border border-white/5 rounded-[2rem]">
            <p className="text-foreground/40 text-sm mb-4">No repositories found matching your criteria.</p>
            {!searchQuery && (
              <button 
                onClick={() => router.push('/repos/new')}
                className="text-persimmon font-bold text-sm hover:text-orange-400 transition-colors"
              >
                Initialize your first repository →
              </button>
            )}
          </div>
        ) : (
          filteredVaults?.map((vault: any) => (
            <div 
              key={vault.id} 
              onClick={() => router.push(`/repos/${encodeURIComponent(vault.repositoryFullName)}`)}
              className="bg-[#111111] border border-white/5 p-7 rounded-[2rem] shadow-lg cursor-pointer hover:border-persimmon/30 hover:shadow-[0_15px_40px_rgba(252,76,2,0.1)] hover:-translate-y-1 transition-all duration-500 group flex flex-col justify-between min-h-[200px]"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-white/5 rounded-xl text-white/50 group-hover:text-white group-hover:bg-white/10 transition-colors">
                    {/* ⚡ Raw SVG GitHub Icon to prevent lucide-react export issues */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-white text-lg truncate tracking-tight group-hover:text-persimmon transition-colors">
                    {vault.repositoryFullName.split('/')[1] || vault.repositoryFullName}
                  </h3>
                </div>
                
                <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5 mb-2">
                  <p className="text-[10px] font-mono text-white/30 uppercase mb-1">PDA Address</p>
                  <p className="text-[11px] font-mono text-white/60 truncate">{vault.pdaAddress}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm mt-6 pt-4 border-t border-white/5">
                <span className="text-white/30 font-mono text-[10px] uppercase tracking-widest">Network Status</span>
                
                {/* 🟢 Upgraded Green Active Indicator */}
                <span className="text-emerald-400 text-[11px] font-mono font-bold tracking-widest flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  ACTIVE
                </span>
              </div>
              
              {/* Subtle visual arrow to indicate clickability */}
              <div className="absolute right-6 top-8 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                <ArrowRight size={20} className="text-persimmon" />
              </div>
            </div>
          ))
        )}
      </div>

    </DashboardLayout>
  );
}