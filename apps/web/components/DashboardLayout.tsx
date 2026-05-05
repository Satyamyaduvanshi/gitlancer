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
import { motion } from 'framer-motion';
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

  // Helper component to render the animated nav items
  const NavItem = ({ item, isActive }: { item: any, isActive: boolean }) => {
    const Icon = item.icon;
    return (
      <Link href={item.href} className="relative block group">
        {/* The Sliding Background Pill */}
        {isActive && (
          <motion.div
            layoutId="sidebar-active-indicator"
            className="absolute inset-0 bg-persimmon/10 rounded-xl"
            initial={false}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 35,
              mass: 0.8
            }}
          />
        )}
        
        {/* The Text and Icon (positioned above the background) */}
        <div className={`relative z-10 flex items-center gap-3 px-3 py-2.5 transition-colors duration-300 ${
          isActive 
            ? 'text-persimmon font-medium' 
            : 'text-foreground/60 hover:text-foreground hover:translate-x-1.5'
        }`}>
          <Icon size={18} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
          <span className="text-sm tracking-wide">{item.name}</span>
        </div>
      </Link>
    );
  };

  return (
    // 🌍 Outer Background
    <div className="flex h-screen bg-black/5 dark:bg-[#050505] text-foreground font-sans selection:bg-persimmon/20 selection:text-persimmon p-3 gap-3 overflow-hidden">
      
      {/* 🧭 Floating Sidebar Card */}
      <aside className="w-[260px] bg-background rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-black/5 dark:border-white/5 flex flex-col justify-between p-5 overflow-hidden transition-all flex-shrink-0">
        
        <div className="flex flex-col h-full">
          {/* Logo & Text Block */}
          <Link href="/dashboard" className="mb-8 px-2 flex items-center gap-3 group w-fit">
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

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {/* 📂 MENU SECTION */}
            <div className="mb-8">
              <p className="px-3 text-xs font-mono text-foreground/40 uppercase tracking-widest mb-3 transition-colors duration-300 hover:text-foreground/60">Menu</p>
              <nav className="space-y-1 relative">
                {menuItems.map((item) => (
                  <NavItem key={item.name} item={item} isActive={pathname.startsWith(item.href)} />
                ))}
              </nav>
            </div>

            {/* ⚙️ GENERAL SECTION */}
            <div>
              <p className="px-3 text-xs font-mono text-foreground/40 uppercase tracking-widest mb-3 transition-colors duration-300 hover:text-foreground/60">General</p>
              <nav className="space-y-1 relative flex flex-col">
                {generalItems.map((item) => (
                  <NavItem key={item.name} item={item} isActive={pathname.startsWith(item.href)} />
                ))}

                {/* Logout Button */}
                <button 
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] text-foreground/60 hover:text-persimmon hover:bg-persimmon/10 hover:translate-x-1.5 text-left w-full group mt-2"
                >
                  <LogOut size={18} className="transition-transform duration-300 group-hover:scale-110 group-hover:-translate-x-0.5" />
                  <span className="text-sm tracking-wide">Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Wallet Button & Callout Container */}
          <div className="relative px-3 mt-4 mb-4 flex flex-col group/wallet">
            <div className="transition-transform duration-300 ease-out group-hover/wallet:scale-[1.02]">
              <WalletMultiButtonDynamic 
                className="w-full! justify-start! px-3! h-11! rounded-xl! bg-white/5! hover:bg-white/10! border! border-white/5! hover:border-white/10! hover:border-persimmon/30! hover:shadow-[0_0_15px_rgba(252,76,2,0.15)]! text-foreground! font-sans! font-medium! text-sm! tracking-wide transition-all duration-300 active:scale-[0.98]!" 
              />
            </div>
            
            {/* Hand-Drawn Arrow Callout */}
            <div className="absolute -bottom-[106px] right-[50px] pointer-events-none select-none opacity-60 dark:opacity-80 transition-all duration-500 ease-out group-hover/wallet:opacity-100 group-hover/wallet:translate-y-1 group-hover/wallet:-rotate-3 z-50">
              <Image 
                src="/walletwhite.svg" 
                alt="Connect Wallet Indicator" 
                width={70}   
                height={70} 
                className="object-contain drop-shadow-md" 
              />
            </div>
          </div>
        </div>
      </aside>

      {/* ⚡ RIGHT SIDE COLUMN: Header + Main Content Stack */}
      <div className="flex-1 flex flex-col gap-3 min-w-0 h-full">
        
        {/* 1. Floating Header Card */}
        <DashboardHeader />

        {/* 2. Main Content Card */}
        <main className="flex-1 bg-background rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-black/5 dark:border-white/5 overflow-y-auto no-scrollbar relative">
          
          {/* 🪄 THE MAGIC TRICK: Snappy Content Transition */}
          <div 
            key={pathname} 
            className="p-8 max-w-7xl mx-auto min-h-full animate-in fade-in zoom-in-[0.98] slide-in-from-bottom-2 duration-300 ease-out fill-mode-both"
          >
            {children}
          </div>

        </main>
        
      </div>
    </div>
  );
}