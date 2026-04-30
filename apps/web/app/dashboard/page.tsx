'use client';
import { useMemo } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import PayoutCalendar from '@/components/PayoutCalendar';
import RecentVaults from '@/components/RecentVaults';
import RecentPRs from '@/components/RecentPRs';
import { ArrowUpRight } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function DashboardOverview() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const { data: vaults, isLoading: vaultsLoading } = useSWR(userId ? `${API_URL}/api/vaults/user/${userId}` : null, fetcher);
  const { data: bounties, isLoading: bountiesLoading } = useSWR(userId ? `${API_URL}/api/bounties/user/${userId}` : null, fetcher);

  const { totalPaid, growthPct, pendingBounties } = useMemo(() => {
    if (!bounties) return { totalPaid: 0, growthPct: 0, pendingBounties: 0 };
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

    const currentMonth = bounties.filter((b: any) => b.status === 'CLAIMED' && new Date(b.createdAt) > thirtyDaysAgo);
    const prevMonth = bounties.filter((b: any) => b.status === 'CLAIMED' && new Date(b.createdAt) <= thirtyDaysAgo && new Date(b.createdAt) > sixtyDaysAgo);

    const currentTotal = currentMonth.reduce((sum: number, b: any) => sum + b.amount, 0);
    const prevTotal = prevMonth.reduce((sum: number, b: any) => sum + b.amount, 0) || 1;

    return {
      totalPaid: bounties.filter((b: any) => b.status === 'CLAIMED').reduce((sum: number, b: any) => sum + b.amount, 0),
      growthPct: Math.round(((currentTotal - prevTotal) / prevTotal) * 100),
      pendingBounties: bounties.filter((b: any) => b.status === 'AUDITED').length
    };
  }, [bounties]);

  const chartData = useMemo(() => {
    if (!bounties || bounties.length === 0) return [];
    const grouped = bounties.reduce((acc: any, bounty: any) => {
      const dateStr = new Date(bounty.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!acc[dateStr]) acc[dateStr] = 0;
      acc[dateStr] += bounty.amount;
      return acc;
    }, {});
    return Object.keys(grouped).map(date => ({ date, amount: grouped[date] })).reverse(); 
  }, [bounties]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-foreground/50 text-sm mt-1">Real-time oversight of the SOLUX treasury ecosystem.</p>
      </div>

      {/* 🚀 Top Row: Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <Link href="/payment-history" className="block transition-transform hover:-translate-y-1">
          <div className="bg-persimmon rounded-3xl p-6 shadow-lg shadow-persimmon/20 relative overflow-hidden flex flex-col justify-between min-h-[160px] h-full group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:bg-white/20 transition-all" />
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-white/90 font-medium text-sm">Total USDC Distributed</h3>
              <div className="p-1.5 bg-white/20 rounded-full text-white backdrop-blur-sm group-hover:bg-white/30 transition-colors"><ArrowUpRight size={16} /></div>
            </div>
            <div>
              <h2 className="text-5xl font-bold text-white mb-2">{totalPaid}</h2>
              <p className="text-xs text-white/70 font-medium flex items-center gap-1.5">
                <span className={`bg-white/20 px-1.5 py-0.5 rounded text-[10px]`}>{growthPct >= 0 ? `+${growthPct}%` : `${growthPct}%`}</span> 
                {growthPct >= 0 ? 'Increased' : 'Decreased'} from last month
              </p>
            </div>
          </div>
        </Link>
        <Link href="/repos" className="block">
          <StatCard title="Active Vaults" value={vaults?.length || 0} loading={vaultsLoading} trend="Steady operations" />
        </Link>
        <Link href="/pending-claim" className="block">
          <StatCard title="Pending Claims" value={pendingBounties} loading={bountiesLoading} trend="Awaiting withdrawal" />
        </Link>
      </div>

      {/* 📈 Middle Row: Chart & Calendar (Height 400px) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2 bg-background border border-black/5 dark:border-white/5 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] h-[400px] flex flex-col">
          <div className="flex items-center gap-2 mb-6"><h3 className="font-bold text-foreground text-lg">Treasury Analytics</h3></div>
          <div className="flex-1 w-full h-full -ml-4">
            {bountiesLoading ? (
              <div className="w-full h-full flex justify-center items-center"><p className="text-persimmon font-mono text-sm animate-pulse">AGGREGATING DATA...</p></div>
            ) : chartData.length === 0 ? (
              <div className="w-full h-full flex justify-center items-center border-2 border-dashed border-black/5 dark:border-white/5 rounded-2xl"><p className="text-foreground/30 font-mono text-xs uppercase">No distribution data available yet.</p></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fc4c02" stopOpacity={0.3}/><stop offset="95%" stopColor="#fc4c02" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.1)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(150, 150, 150, 0.4)" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="rgba(150, 150, 150, 0.4)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip cursor={{ stroke: '#fc4c02', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ backgroundColor: 'var(--color-background)', borderColor: 'rgba(150,150,150,0.1)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '13px', color: 'var(--color-foreground)' }} itemStyle={{ color: '#fc4c02', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="amount" stroke="#fc4c02" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="h-[400px]">
          <PayoutCalendar bounties={bounties || []} />
        </div>
      </div>

      {/* 🗂️ Bottom Row: Vaults & PRs side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <RecentVaults vaults={vaults} loading={vaultsLoading} />
        </div>
        <div className="lg:col-span-2">
          <RecentPRs bounties={bounties || []} loading={bountiesLoading} />
        </div>
      </div>

    </DashboardLayout>
  );
}

function StatCard({ title, value, loading, trend }: { title: string, value: string | number, loading: boolean, trend: string }) {
  return (
    <div className="bg-background border border-black/5 dark:border-white/5 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col justify-between min-h-[160px] h-full group hover:-translate-y-1 transition-transform duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-foreground/70 font-medium text-sm">{title}</h3>
        <div className="p-1.5 border border-black/10 dark:border-white/10 rounded-full text-foreground/50 group-hover:text-persimmon group-hover:border-persimmon/50 transition-colors">
          <ArrowUpRight size={16} />
        </div>
      </div>
      <div>
        {loading ? <div className="h-10 w-16 bg-black/5 dark:bg-white/5 animate-pulse rounded-lg mb-2"></div> : <h2 className="text-5xl font-bold text-foreground mb-2">{value}</h2>}
        <p className="text-xs text-foreground/50 font-medium">{trend}</p>
      </div>
    </div>
  );
}