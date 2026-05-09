'use client';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSession, signOut } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, ShieldAlert, FolderGit2, ExternalLink, LogOut, Bell, MessageSquare, Mail, Key, ArrowRight
} from 'lucide-react'; 
import Image from 'next/image';
import Link from 'next/link';

export default function SettingsPage() {
  const { data: session } = useSession();
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useState('profile');


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)', 
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, scale: 0.98, filter: 'blur(4px)' },
    visible: { 
      opacity: 1, 
      scale: 1,
      filter: 'blur(0px)', 
      transition: { duration: 0.4, ease: "easeOut" } 
    },
    exit: { opacity: 0, scale: 0.98, filter: 'blur(4px)', transition: { duration: 0.2 } }
  };

  return (
    <DashboardLayout>
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible"
        className="w-full max-w-5xl mx-auto"
      >
        
        <motion.div variants={itemVariants} className="mb-10 border-b border-white/5 pb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Maintainer Settings
          </h1>
          <p className="text-white/50 text-sm mt-2 max-w-2xl leading-relaxed">
            Manage your connected Web3 identity, global notification routes, and strict security controls for your SOLUX ecosystem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          

          <motion.div variants={itemVariants} className="md:col-span-1 space-y-2">
            {[
              { id: 'profile', icon: User, label: 'Identity & Wallets' },
              { id: 'notifications', icon: Bell, label: 'Alerts & Routing' },
              { id: 'security', icon: ShieldAlert, label: 'Security & Access' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-bold tracking-wide ${
                  activeTab === tab.id 
                    ? 'bg-[#111111] text-persimmon border border-white/10 shadow-lg' 
                    : 'text-white/40 hover:text-white hover:bg-white/[0.02] border border-transparent'
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-persimmon' : ''} />
                {tab.label}
              </button>
            ))}
          </motion.div>


          <motion.div variants={itemVariants} className="md:col-span-3">
            <div className="bg-[#111111] border border-white/5 rounded-[2rem] shadow-2xl p-8 relative overflow-hidden min-h-[500px]">
              
              {/* Background Glow */}
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

              <AnimatePresence mode="wait">

                {activeTab === 'profile' && (
                  <motion.div 
                    key="profile"
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-8 relative z-10"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-white/5">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white/5 shadow-2xl bg-black flex-shrink-0">
                        <Image 
                          src={(session?.user as any)?.image || "/gback.jpg"} 
                          alt="Profile" 
                          width={96} height={96} 
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-1">{(session?.user as any)?.name || 'Maintainer'}</h2>
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                          <p className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60 flex items-center gap-2 font-mono">
                            {/* 🛡️ THE FIX: Replaced Lucide Github icon with a raw inline SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                              <path d="M9 18c-4.51 2-5-2-7-2" />
                            </svg>
                            @{(session?.user as any)?.username || 'github_user'}
                          </p>
                          <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold tracking-widest rounded-md uppercase flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> GitHub Linked
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Key size={14} /> Global Settlement Wallet
                      </h3>
                      <div className="bg-black/50 border border-white/5 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-white/10 transition-colors">
                        <div className="flex-1 overflow-hidden">
                          <p className="text-[10px] font-mono text-white/40 uppercase mb-2">Primary Solana Address</p>
                          <p className="text-sm font-mono text-white truncate bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                            {wallet.publicKey ? wallet.publicKey.toBase58() : 'No wallet connected in this session'}
                          </p>
                          <p className="text-xs text-white/40 mt-3 leading-relaxed">
                            This is your primary authority wallet. It is used to initialize new vault PDAs and authorize withdrawals across all your repositories.
                          </p>
                        </div>
                        <Link href="/link?source=settings" className="flex-shrink-0 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 active:scale-95">
                          Change Wallet <ExternalLink size={14} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}


                {activeTab === 'notifications' && (
                  <motion.div 
                    key="notifications"
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-8 relative z-10"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">Global Routing & Alerts</h2>
                      <p className="text-sm text-white/40">Configure how SOLUX notifies you about AI audits and treasury events.</p>
                    </div>

                    <div className="space-y-4 border-t border-white/5 pt-6">
                      <div className="flex items-start gap-4 bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                        <div className="p-2.5 bg-[#5865F2]/10 text-[#5865F2] rounded-xl"><MessageSquare size={20} /></div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-white mb-1">Discord Webhook Integration</h4>
                          <p className="text-xs text-white/50 mb-3">Get real-time alerts when PRs are merged, audited, and paid out. (Configured per-repository in Repo Settings).</p>
                          <Link href="/repos" className="text-xs font-bold text-[#5865F2] hover:text-[#4752C4] transition-colors flex items-center gap-1">
                            Manage in Repositories <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 bg-white/[0.02] border border-white/5 p-5 rounded-2xl opacity-50 grayscale">
                        <div className="p-2.5 bg-white/10 text-white rounded-xl"><Mail size={20} /></div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">Email Summaries <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-sm uppercase tracking-widest">Coming Soon</span></h4>
                          <p className="text-xs text-white/50">Weekly digest of total USDC distributed and automated logic flagged by the AI Guardian.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}


                {activeTab === 'security' && (
                  <motion.div 
                    key="security"
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-8 relative z-10"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">Security & Access</h2>
                      <p className="text-sm text-white/40">Manage your active sessions and permissions.</p>
                    </div>

                    <div className="space-y-6 border-t border-white/5 pt-6">
                      

                      <div className="border border-white/10 bg-white/[0.02] p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div>
                          <h4 className="font-bold text-white mb-1">Sign Out of Dashboard</h4>
                          <p className="text-xs text-white/50 max-w-sm leading-relaxed">
                            End your current authenticated session. This will <strong className="text-white/70">not</strong> affect the automated SOLUX payouts currently running on your repositories.
                          </p>
                        </div>
                        <button 
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>


                      <div className="border border-red-500/20 bg-red-500/5 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div>
                          <h4 className="font-bold text-red-500 mb-1">Revoke GitHub Access</h4>
                          <p className="text-xs text-white/50 max-w-sm leading-relaxed">
                            To completely stop SOLUX from reading your repositories, you must uninstall the GitHub App directly from your GitHub Developer Settings.
                          </p>
                        </div>
                        <a 
                          href="https://github.com/settings/installations" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95"
                        >
                          Manage on GitHub <ExternalLink size={14} />
                        </a>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>

        </div>
      </motion.div>
    </DashboardLayout>
  );
}