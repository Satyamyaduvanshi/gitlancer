'use client';
import { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import { Search, Plus } from 'lucide-react';
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#e8e8ea] mb-1">Repositories</h1>
          <p className="text-[#e8e8ea]/50 text-xs font-mono uppercase tracking-widest">Manage anchored git treasuries</p>
        </div>
        
        {/* ⚡ The Wired-Up Button */}
        <button 
          onClick={() => router.push('/repos/new')}
          className="bg-[#e8e8ea] hover:bg-white text-[#141413] px-6 py-3 font-bold text-sm flex items-center gap-2 transition-all active:scale-[0.98]"
        >
          <Plus size={18} strokeWidth={3} /> INITIALIZE REPO
        </button>
      </div>

      {/* Search Bar - Brutalist Input */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-3.5 text-[#e8e8ea]/30" size={18} />
        <input 
          type="text" 
          placeholder="SEARCH ANCHORED REPOSITORIES..." 
          className="w-full bg-[#0b0c10] border border-white/10 py-3 pl-12 pr-4 text-sm text-[#e8e8ea] focus:outline-none focus:border-[#fc4c02] transition font-mono placeholder:text-[#e8e8ea]/20 uppercase"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Repo List - Sharp Edges, High Contrast */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-[#fc4c02] font-mono text-sm animate-pulse">SCANNING BLOCKCHAIN...</p>
        ) : filteredVaults?.length === 0 ? (
          <p className="text-[#e8e8ea]/40 font-mono text-sm">No repositories found. Initialize one to start.</p>
        ) : (
          filteredVaults?.map((vault: any) => (
            <div 
              key={vault.id} 
              onClick={() => router.push(`/repos/${encodeURIComponent(vault.repositoryFullName)}`)}
              className="bg-[#0b0c10] border border-white/5 p-6 cursor-pointer hover:border-[#fc4c02] transition-colors group flex flex-col justify-between min-h-[160px]"
            >
              <div>
                <h3 className="text-[#e8e8ea] font-bold text-lg mb-2 group-hover:text-[#fc4c02] transition-colors">{vault.repositoryFullName}</h3>
                <p className="text-xs font-mono text-[#e8e8ea]/40 truncate">{vault.pdaAddress}</p>
              </div>
              
              <div className="flex justify-between items-center text-sm mt-6 border-t border-white/5 pt-4">
                <span className="text-[#e8e8ea]/30 font-mono text-[10px] uppercase tracking-widest">Status</span>
                <span className="text-[#fc4c02] text-xs font-mono font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#fc4c02] rounded-full animate-pulse"></span> ACTIVE
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}