'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Bell, ShieldAlert, CheckCircle2, Wallet, X, Clock } from 'lucide-react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function NotificationBell() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Local state to keep track of notifications the user has dismissed or read in this session
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // ⚡ Fetch Real Data
  const { data: vaults } = useSWR(userId ? `${API_URL}/api/vaults/user/${userId}` : null, fetcher);
  const { data: bounties } = useSWR(userId ? `${API_URL}/api/bounties/user/${userId}` : null, fetcher);

  // 🧠 Dynamically Generate Notifications based on real backend state
  const notifications = useMemo(() => {
    if (!vaults || !bounties) return [];
    
    const generatedNotifs: any[] = [];

    // 1. Vault Low Balance Check
    vaults.forEach((vault: any) => {
      // Calculate total spent for this specific vault
      const vaultBounties = bounties.filter((b: any) => b.vaultId === vault.id && b.status === 'CLAIMED');
      const totalSpent = vaultBounties.reduce((sum: number, b: any) => sum + b.amount, 0);
      const remainingBalance = vault.budgetLimit - totalSpent;

      // 🚨 Alert if remaining balance is 20 USDC or lower
      if (remainingBalance <= 20) {
        const repoName = vault.repositoryFullName.split('/')[1] || vault.repositoryFullName;
        generatedNotifs.push({
          id: `low_bal_${vault.id}`,
          type: 'warning',
          title: `${repoName} Balance Low`,
          message: `Your vault for ${repoName} has only ${remainingBalance} USDC remaining.`,
          time: 'Active Alert',
          timestamp: Date.now(), // Always float to top
        });
      }
    });

    // 2. Pending Payouts Check
    const pendingBounties = bounties.filter((b: any) => b.status === 'AUDITED');
    pendingBounties.forEach((b: any) => {
      generatedNotifs.push({
        id: `audit_${b.id}`,
        type: 'security',
        title: `PR #${b.prId} Ready for Payout`,
        message: `@${b.user?.githubHandle || 'Contributor'} is waiting for ${b.amount} USDC.`,
        time: new Date(b.createdAt).toLocaleDateString(),
        timestamp: new Date(b.createdAt).getTime(),
      });
    });

    // 3. Recent Settlements (Show the last 2 claimed)
    const recentClaims = bounties
      .filter((b: any) => b.status === 'CLAIMED')
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 2);
      
    recentClaims.forEach((b: any) => {
      generatedNotifs.push({
        id: `claim_${b.id}`,
        type: 'financial',
        title: 'Settlement Confirmed',
        message: `${b.amount} USDC sent to @${b.user?.githubHandle || 'Contributor'}.`,
        time: new Date(b.createdAt).toLocaleDateString(),
        timestamp: new Date(b.createdAt).getTime() - 1000, // Slightly older so it sits below active alerts
      });
    });

    // Filter out dismissed ones, determine read status, and sort by newest
    return generatedNotifs
      .filter(n => !dismissedIds.has(n.id))
      .map(n => ({ ...n, unread: !readIds.has(n.id) }))
      .sort((a, b) => b.timestamp - a.timestamp);

  }, [vaults, bounties, dismissedIds, readIds]);

  const unreadCount = notifications.filter(n => n.unread).length;

  // UX Fix: Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const markAllAsRead = () => {
    const newReadIds = new Set(readIds);
    notifications.forEach(n => newReadIds.add(n.id));
    setReadIds(newReadIds);
  };

  const removeNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDismissedIds(prev => new Set(prev).add(id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* 🔔 The Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-black/5 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200 active:scale-95 group"
      >
        <Bell size={18} className="text-foreground/60 group-hover:text-persimmon transition-colors" />
        
        {/* Unread Ping Dot */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-persimmon opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 border-2 border-background bg-persimmon"></span>
          </span>
        )}
      </button>

      {/* 📋 The Dropdown Menu */}
      <div 
        className={`absolute right-0 mt-3 w-80 sm:w-96 bg-background/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl z-50 transform origin-top-right transition-all duration-200 ease-out ${
          isOpen ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' : 'scale-95 opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        {/* Dropdown Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-persimmon/10 text-persimmon text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-[11px] text-foreground/50 hover:text-persimmon transition-colors font-medium">
              Mark all read
            </button>
          )}
        </div>

        {/* Dropdown Body */}
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
          {notifications.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center">
              <CheckCircle2 size={32} className="text-foreground/20 mb-3" />
              <p className="text-sm text-foreground/50">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`relative group flex gap-3 p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer mb-1 ${notif.unread ? 'bg-black/5 dark:bg-[#121318]' : ''}`}
              >
                {notif.unread && <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-persimmon rounded-full" />}
                
                <div className={`mt-0.5 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${
                  notif.type === 'financial' ? 'bg-emerald-500/10 text-emerald-500' :
                  notif.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                  'bg-blue-500/10 text-blue-500' 
                }`}>
                  {notif.type === 'financial' ? <Wallet size={18} /> : 
                   notif.type === 'warning' ? <ShieldAlert size={18} /> : 
                   <CheckCircle2 size={18} />}
                </div>

                <div className="flex-1 min-w-0 pr-6">
                  <p className="text-sm font-bold text-foreground truncate">{notif.title}</p>
                  <p className="text-xs text-foreground/60 leading-snug mt-0.5 line-clamp-2">{notif.message}</p>
                  <p className="text-[10px] text-foreground/40 font-mono mt-1.5 flex items-center gap-1">
                    <Clock size={10} /> {notif.time}
                  </p>
                </div>

                <button 
                  onClick={(e) => removeNotification(e, notif.id)}
                  className="absolute right-3 top-3 p-1.5 rounded-lg text-foreground/30 hover:text-foreground hover:bg-black/10 dark:hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-black/5 dark:border-white/5 text-center bg-black/5 dark:bg-white/5 rounded-b-3xl">
          <button className="text-xs text-foreground/60 hover:text-foreground font-medium transition-colors w-full py-1">
            View Settings
          </button>
        </div>
      </div>
    </div>
  );
}