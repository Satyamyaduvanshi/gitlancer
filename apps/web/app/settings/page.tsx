'use client';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSession, signOut } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  User, ShieldAlert, FolderGit2, ExternalLink, LogOut 
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function SettingsPage() {
  const { data: session } = useSession();
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <DashboardLayout>
      {/* 🚀 Header */}
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700 ease-out">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Settings & Identity
        </h1>
        <p className="text-foreground/50 text-sm mt-2 max-w-2xl">
          Manage your connected GitHub profile and Web3 settlement address.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* 📑 Left Sidebar (Tabs) */}
        <div className="md:col-span-1 space-y-2 animate-in fade-in slide-in-from-left-4 duration-700 delay-150">
          {[
            { id: 'profile', icon: User, label: 'Profile & Identity' },
            { id: 'security', icon: ShieldAlert, label: 'Security & Access' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                activeTab === tab.id 
                  ? 'bg-persimmon text-white shadow-lg shadow-persimmon/20 scale-100' 
                  : 'text-foreground/60 hover:text-foreground hover:bg-white/5 hover:translate-x-1'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ⚙️ Right Content Area */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-[#111111] border border-white/5 rounded-[2rem] shadow-2xl p-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 min-h-[400px]">
            
            {/* Background Glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-persimmon/5 rounded-full blur-3xl pointer-events-none" />

            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/10 shadow-xl bg-black">
                    <Image 
                      src={(session?.user as any)?.image || "/gback.jpg"} 
                      alt="Profile" 
                      width={80} height={80} 
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{(session?.user as any)?.name || 'Maintainer'}</h2>
                    <p className="text-sm text-white/50 flex items-center gap-2 mt-1">
                      <FolderGit2 size={14} /> @{(session?.user as any)?.username || 'github_user'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest border-b border-white/5 pb-2">Web3 Identity</h3>
                  <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-mono text-white/40 uppercase mb-1">Active Treasury Wallet</p>
                      <p className="text-sm font-mono text-white tracking-wide">
                        {wallet.publicKey ? wallet.publicKey.toBase58() : 'No wallet connected in this session'}
                      </p>
                    </div>
                    <Link href="/link?source=settings" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                      Update Wallet <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SECURITY */}
            {activeTab === 'security' && (
              <div className="space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest border-b border-white/5 pb-2 mb-4">Access Control</h3>
                <div className="border border-red-500/20 bg-red-500/5 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <h4 className="font-bold text-red-500 mb-1">Sign Out of Dashboard</h4>
                    <p className="text-xs text-white/50 max-w-sm">
                      End your current session. This will not affect the automated SOLUX payouts currently running on your repositories.
                    </p>
                  </div>
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}