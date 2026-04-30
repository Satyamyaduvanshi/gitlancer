'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderGit2, 
  Settings, 
  WalletCards, 
  LogOut, 
  ArrowRight,
  HelpCircle,
  History,
  HandCoins 
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import dynamic from 'next/dynamic';
import DashboardHeader from './DashboardHeader';

// 🛡️ Hydration Fix: Dynamically import the wallet button
const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Menu Section Items
  const menuItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Repositories', href: '/repos', icon: FolderGit2 },
    { name: 'Recharge', href: '/recharge', icon: WalletCards },
    { name: 'Payment History', href: '/payment-history', icon: History },
    { name: 'Pending Claims', href: '/pending-claim', icon: HandCoins } 
  ];

  // General Section Items
  const generalItems = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help', href: '/help', icon: HelpCircle },
  ];

  return (
    // 🌍 Outer Background
    <div className="flex h-screen bg-black/5 dark:bg-[#050505] text-foreground font-sans selection:bg-persimmon/20 selection:text-persimmon p-3 gap-3 overflow-hidden">
      
      {/* 🧭 Floating Sidebar Card */}
      <aside className="w-[260px] bg-background rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-black/5 dark:border-white/5 flex flex-col justify-between p-5 overflow-hidden transition-all flex-shrink-0">
        
        <div>
          {/* Logo & Text Block */}
          <Link href="/dashboard" className="mb-8 px-2 flex items-center gap-3 group">
            <Image 
              src="/logo-orange.svg" 
              alt="Official SOLUX Logo" 
              width={28} 
              height={28} 
              priority 
              className="flex-shrink-0 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3"
            />
            <span className="text-2xl font-bold tracking-tighter text-foreground transition-colors duration-300">
              SOLUX<span className="text-persimmon">.</span>
            </span>
          </Link>

          {/* 📂 MENU SECTION */}
          <div className="mb-8">
            <p className="px-3 text-xs font-mono text-foreground/40 uppercase tracking-widest mb-3 transition-colors duration-300 hover:text-foreground/60">Menu</p>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group ${
                      isActive 
                        ? 'bg-persimmon/10 text-persimmon font-medium shadow-sm scale-100' 
                        : 'text-foreground/60 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:translate-x-1.5'
                    }`}
                  >
                    <Icon size={18} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="text-sm tracking-wide">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ⚙️ GENERAL SECTION */}
          <div>
            <p className="px-3 text-xs font-mono text-foreground/40 uppercase tracking-widest mb-3 transition-colors duration-300 hover:text-foreground/60">General</p>
            <nav className="space-y-1 flex flex-col">
              {generalItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group ${
                      isActive 
                        ? 'bg-persimmon/10 text-persimmon font-medium shadow-sm scale-100' 
                        : 'text-foreground/60 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:translate-x-1.5'
                    }`}
                  >
                    <Icon size={18} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="text-sm tracking-wide">{item.name}</span>
                  </Link>
                );
              })}

              {/* Logout Button */}
              <button 
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] text-foreground/60 hover:text-persimmon hover:bg-persimmon/10 hover:translate-x-1.5 text-left w-full group"
              >
                <LogOut size={18} className="transition-transform duration-300 group-hover:scale-110 group-hover:-translate-x-0.5" />
                <span className="text-sm tracking-wide">Logout</span>
              </button>

             {/* Wallet Button & Callout Container */}
             <div className="relative px-3 mt-4 mb-14 flex flex-col group/wallet">
                <div className="transition-transform duration-300 ease-out group-hover/wallet:scale-[1.02]">
                  <WalletMultiButtonDynamic 
                    className="w-full! justify-start! px-3! h-11! rounded-xl! bg-white/5! hover:bg-white/10! border! border-white/5! hover:border-white/10! hover:border-persimmon/30! hover:shadow-[0_0_15px_rgba(252,76,2,0.15)]! text-foreground! font-sans! font-medium! text-sm! tracking-wide transition-all duration-300 active:scale-[0.98]!" 
                  />
                </div>
                
                {/* Hand-Drawn Arrow Callout */}
                <div className="absolute -bottom-[106px] right-[50px] pointer-events-none select-none opacity-60 dark:opacity-80 transition-all duration-500 ease-out group-hover/wallet:opacity-100 group-hover/wallet:translate-y-1 group-hover/wallet:-rotate-3">
                  <Image 
                    src="/walletwhite.svg" 
                    alt="Connect Wallet Indicator" 
                    width={70}   
                    height={70} 
                    className="object-contain drop-shadow-md" 
                  />
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* ⚡ REDESIGNED GITHUB BOT AD BLOCK */}
        <div className="relative p-5 mt-4 rounded-2xl border border-black/5 dark:border-white/5 bg-carbon overflow-hidden group shadow-lg transition-all duration-500 hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:border-white/10 hover:-translate-y-1">
          <Image 
            src="/gback.jpg" 
            alt="Github Integration" 
            fill 
            className="object-cover opacity-20 transition-all duration-700 ease-out group-hover:opacity-50 group-hover:scale-110" 
          />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-2.5 mb-3 transition-transform duration-500 group-hover:scale-105">
              <Image src="/logos/github.svg" alt="GitHub Logo" width={20} height={20} className="invert dark:invert-0 drop-shadow-md" />
              <h4 className="font-bold text-sm text-white tracking-tight drop-shadow-md">GitHub Bot</h4>
            </div>
            <p className="text-xs text-white/70 leading-relaxed max-w-[170px] mb-5 drop-shadow-sm transition-colors duration-300 group-hover:text-white">
              Add Solux to your repo for AI audits & payouts.
            </p>
            <Link href="#" className="flex items-center justify-center gap-2 px-5 py-2.5 w-full rounded-xl bg-persimmon text-white font-bold text-xs transition-all duration-500 hover:bg-orange-500 hover:shadow-[0_8px_25px_rgba(252,76,2,0.5)] hover:-translate-y-0.5 active:scale-[0.96] overflow-hidden group/btn">
              <div className="absolute inset-[-20px] bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10 flex items-center gap-2">
                Add to Repository
                <ArrowRight size={14} strokeWidth={2.5} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </aside>

      {/* ⚡ RIGHT SIDE COLUMN: Header + Main Content Stack */}
      <div className="flex-1 flex flex-col gap-3 min-w-0 h-full">
        
        {/* 1. Floating Header Card */}
        <DashboardHeader />

        {/* 2. Main Content Card */}
        <main className="flex-1 bg-background rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-black/5 dark:border-white/5 overflow-y-auto no-scrollbar relative">
          
          {/* 🪄 THE MAGIC TRICK: Keying the container to the pathname forces Next.js to re-mount and re-animate on route changes! */}
          <div 
            key={pathname} 
            className="p-8 max-w-7xl mx-auto min-h-full animate-in fade-in slide-in-from-bottom-8 duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] fill-mode-both"
          >
            {children}
          </div>

        </main>
        
      </div>
    </div>
  );
}