'use client';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  User, Bell, Webhook, ShieldAlert, Save, 
  CheckCircle2, XCircle, X, FolderGit2, ExternalLink 
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function SettingsPage() {
  const { data: session } = useSession();
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  // 🍞 Custom Toast Notification State
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' }>({ 
    show: false, msg: '', type: 'success' 
  });

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  // Mock save function for UI demonstration
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Settings successfully updated and saved to network.", "success");
    }, 1200);
  };

  // Modern Toggle Switch Component
  const Toggle = ({ label, description, defaultChecked = false }: { label: string, description: string, defaultChecked?: boolean }) => {
    const [checked, setChecked] = useState(defaultChecked);
    return (
      <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors">
        <div className="pr-4">
          <p className="text-sm font-bold text-white tracking-wide">{label}</p>
          <p className="text-xs text-white/50 mt-1 leading-relaxed">{description}</p>
        </div>
        <button 
          onClick={() => setChecked(!checked)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${checked ? 'bg-persimmon' : 'bg-white/10'}`}
        >
          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-md ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
      </div>
    );
  };

  return (
    <DashboardLayout>
      {/* 🚀 Header */}
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700 ease-out">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-foreground/50 text-sm mt-2 max-w-2xl">
          Manage your identity, notification rules, and external integrations for SOLUX.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* 📑 Left Sidebar (Tabs) */}
        <div className="md:col-span-1 space-y-2 animate-in fade-in slide-in-from-left-4 duration-700 delay-150">
          {[
            { id: 'profile', icon: User, label: 'Profile & Identity' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'integrations', icon: Webhook, label: 'Integrations' },
            { id: 'security', icon: ShieldAlert, label: 'Security' },
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
          <div className="bg-[#111111] border border-white/5 rounded-[2rem] shadow-2xl p-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            
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
                        {wallet.publicKey ? wallet.publicKey.toBase58() : 'No wallet connected'}
                      </p>
                    </div>
                    <Link href="/link?source=settings" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                      Change Wallet <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest border-b border-white/5 pb-2 mb-4">Alert Preferences</h3>
                <Toggle 
                  label="Vault Low Balance Alerts" 
                  description="Receive an alert when any of your repository vaults drop below 20 USDC."
                  defaultChecked={true}
                />
                <Toggle 
                  label="PR Audit Success" 
                  description="Get notified when the AI agent successfully audits and approves a contributor's PR."
                  defaultChecked={true}
                />
                <Toggle 
                  label="Settlement Confirmations" 
                  description="Receive an alert when a contributor successfully claims their USDC bounty from your vault."
                  defaultChecked={false}
                />
              </div>
            )}

            {/* TAB: INTEGRATIONS */}
            {activeTab === 'integrations' && (
              <div className="space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest border-b border-white/5 pb-2 mb-4">Connected Apps</h3>
                
                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <FolderGit2 size={24} className="text-white" />
                    <div>
                      <h4 className="font-bold text-white">SOLUX App</h4>
                      <p className="text-xs text-white/50">Installed on 1 organization</p>
                    </div>
                  </div>
                  <button className="text-xs text-persimmon hover:text-orange-400 font-bold transition-colors">Manage App Permissions →</button>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                  <h4 className="font-bold text-white mb-1">Discord Webhook</h4>
                  <p className="text-xs text-white/50 mb-4">Send audit logs and payout notifications directly to a Discord channel.</p>
                  <input 
                    type="url" 
                    placeholder="https://discord.com/api/webhooks/..." 
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-persimmon transition-colors"
                  />
                </div>
              </div>
            )}

            {/* TAB: SECURITY */}
            {activeTab === 'security' && (
              <div className="space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest border-b border-white/5 pb-2 mb-4">Danger Zone</h3>
                <div className="border border-red-500/20 bg-red-500/5 p-5 rounded-2xl">
                  <h4 className="font-bold text-red-500 mb-1">Disconnect Identity</h4>
                  <p className="text-xs text-white/50 mb-4">This will immediately halt all automated payouts to your repositories and sever the link to your Solana wallet.</p>
                  <button className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                    Revoke Access
                  </button>
                </div>
              </div>
            )}

            {/* Global Save Button */}
            <div className="mt-8 pt-6 border-t border-white/5 flex justify-end relative z-10">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-white/90 disabled:opacity-50 transition-all shadow-lg active:scale-95 group"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <Save size={16} className="group-hover:scale-110 transition-transform" />
                )}
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* 🍞 Sleek Custom Toast Notification */}
      <div 
        className={`fixed bottom-6 right-6 z-[100] max-w-sm w-full bg-[#111111] border rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-start gap-3 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          toast.show ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'
        } ${
          toast.type === 'success' ? 'border-emerald-500/30' : 'border-red-500/30'
        }`}
      >
        <div className="mt-0.5">
          {toast.type === 'success' ? (
            <CheckCircle2 size={20} className="text-emerald-500" />
          ) : (
            <XCircle size={20} className="text-red-500" />
          )}
        </div>
        <div className="flex-1 pr-4">
          <h4 className={`text-sm font-bold tracking-tight mb-1 ${toast.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
            {toast.type === 'success' ? 'Success' : 'Error'}
          </h4>
          <p className="text-xs text-white/70 leading-relaxed break-words">{toast.msg}</p>
        </div>
        <button 
          onClick={() => setToast({ ...toast, show: false })}
          className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

    </DashboardLayout>
  );
}