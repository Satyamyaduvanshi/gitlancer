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
import { motion, LayoutGroup } from 'framer-motion';
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

  // 🪄 Animated Nav Item Component
  const NavItem = ({ item, isActive }: { item: any, isActive: boolean }) => {
    const Icon = item.icon;
    return (
      <Link href={item.href} className="relative block group">
        
        {isActive && (
          <motion.div
            layoutId="sidebar-active-indicator"
            layoutDependency={pathname} 
            className="absolute inset-0 bg-persimmon/10 rounded-xl"
            initial={false}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 30,
            }}
          />
        )}

        {!isActive && (
          <div className="absolute inset-0 bg-black/5 dark:bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]" />
        )}
        
        {/* 🛡️ TIGHTER PADDING: Reduced to py-2 instead of py-2.5 */}
        <div className={`relative z-10 flex items-center gap-3 px-3 py-2 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isActive 
            ? 'text-persimmon font-medium scale-100' 
            : 'text-foreground/60 hover:text-foreground group-hover:translate-x-1.5'
        }`}>
          <Icon size={18} className={`transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
          <span className="text-sm tracking-wide">{item.name}</span>
        </div>
      </Link>
    );
  };

  // --- 🎬 MASTER ENTRANCE ANIMATIONS ---
  const layoutVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.2 } }
  };

  const sidebarVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      variants={layoutVariants}
      initial="hidden"
      animate="visible"
      // 🛡️ TIGHTER GAP: Reduced from p-3 gap-3 to p-2 gap-2
      className="flex h-screen bg-black/5 dark:bg-[#050505] text-foreground font-sans selection:bg-persimmon/20 selection:text-persimmon p-2 gap-2 overflow-hidden"
    >
      
      {/* 🧭 Floating Sidebar Card */}
      <motion.aside 
        variants={sidebarVariants}
        // 🛡️ SLIMMER SIDEBAR: Reduced width to 230px, reduced padding to p-4
        className="w-[230px] bg-background rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-black/40 dark:border-white/40 flex flex-col justify-between p-4 overflow-hidden transition-all flex-shrink-0"
      >
        
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col pb-2">
          
          <Link href="/dashboard" className="mb-6 px-2 flex items-center gap-3 group w-fit">
            <Image 
              src="/logo-orange.svg" 
              alt="Official SOLUX Logo" 
              width={24} 
              height={24} 
              priority 
              className="flex-shrink-0 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3"
            />
            <span className="text-xl font-bold tracking-tighter text-foreground transition-colors duration-300">
              SOLUX<span className="text-persimmon">.</span>
            </span>
          </Link>

          <LayoutGroup id="solux-sidebar">
            <div className="mb-6">
              <p className="px-3 text-[10px] font-mono text-foreground/40 uppercase tracking-widest mb-2 transition-colors duration-300 hover:text-foreground/60">Menu</p>
              <nav className="space-y-0.5 relative">
                {menuItems.map((item) => (
                  <NavItem key={item.name} item={item} isActive={pathname.startsWith(item.href)} />
                ))}
              </nav>
            </div>

            <div className="flex-1">
              <p className="px-3 text-[10px] font-mono text-foreground/40 uppercase tracking-widest mb-2 transition-colors duration-300 hover:text-foreground/60">General</p>
              <nav className="space-y-0.5 relative flex flex-col">
                {generalItems.map((item) => (
                  <NavItem key={item.name} item={item} isActive={pathname.startsWith(item.href)} />
                ))}

                <button 
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] text-foreground/60 hover:text-persimmon hover:bg-persimmon/10 hover:translate-x-1.5 text-left w-full group mt-1"
                >
                  <LogOut size={18} className="transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 group-hover:-translate-x-0.5" />
                  <span className="text-sm tracking-wide">Logout</span>
                </button>

                <div className="relative mt-3 mb-10 flex flex-col group/wallet">
                  <div className="transition-transform duration-300 ease-out group-hover/wallet:scale-[1.02]">
                    <WalletMultiButtonDynamic 
                      className="w-full! justify-start! px-3! h-9! min-h-[36px]! rounded-xl! bg-white/5! hover:bg-white/10! border! border-white/5! hover:border-white/10! hover:border-persimmon/30! hover:shadow-[0_0_15px_rgba(252,76,2,0.15)]! text-foreground! font-sans! font-medium! text-sm! tracking-wide transition-all duration-300 active:scale-[0.98]!" 
                    />
                  </div>
                  
                  <div className="absolute -bottom-[60px] right-[20px] pointer-events-none select-none opacity-60 dark:opacity-80 transition-all duration-500 ease-out group-hover/wallet:opacity-100 group-hover/wallet:translate-y-1 group-hover/wallet:-rotate-3 z-50">
                    <Image 
                      src="/walletwhite.svg" 
                      alt="Connect Wallet Indicator" 
                      width={50}   
                      height={50} 
                      className="object-contain drop-shadow-md" 
                    />
                  </div>
                </div>
              </nav>
            </div>
          </LayoutGroup>
        </div>

        {/* ⚡ GITHUB BOT AD BLOCK - Tighter padding */}
        <div className="relative p-4 shrink-0 rounded-2xl border border-black/5 dark:border-white/5 bg-carbon overflow-hidden group shadow-lg transition-all duration-500 hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:border-white/10 hover:-translate-y-1 mt-2">
          <Image 
            src="/gback.jpg" 
            alt="Github Integration" 
            fill 
            className="object-cover opacity-20 transition-all duration-700 ease-out group-hover:opacity-50 group-hover:scale-110" 
          />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-2 mb-2 transition-transform duration-500 group-hover:scale-105">
              <Image src="/logos/github.svg" alt="GitHub Logo" width={16} height={16} className="invert dark:invert-0 drop-shadow-md" />
              <h4 className="font-bold text-sm text-white tracking-tight drop-shadow-md">GitHub Bot</h4>
            </div>
            <p className="text-[11px] text-white/70 leading-relaxed max-w-[150px] mb-3 drop-shadow-sm transition-colors duration-300 group-hover:text-white">
              Add Solux to your repo for AI audits & payouts.
            </p>
            <Link href="https://github.com/apps/blinky-solux" className="flex items-center justify-center gap-2 px-3 py-2 w-full rounded-xl bg-persimmon text-white font-bold text-xs transition-all duration-500 hover:bg-orange-500 hover:shadow-[0_8px_25px_rgba(252,76,2,0.5)] hover:-translate-y-0.5 active:scale-[0.96] overflow-hidden group/btn">
              <div className="absolute inset-[-20px] bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10 flex items-center gap-2">
                Add to Repo
                <ArrowRight size={14} strokeWidth={2.5} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>

      </motion.aside>

      {/* ⚡ RIGHT SIDE COLUMN */}
      <motion.div variants={contentVariants} className="flex-1 flex flex-col gap-2 min-w-0 h-full">
        
        <DashboardHeader />

        <main 
          className="flex-1 bg-background rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-black/40 dark:border-white/40 overflow-y-auto no-scrollbar relative"
        >
          
          <div 
            key={pathname} 
            // 🛡️ TIGHTER PADDING: Reduced from p-8 to p-6
            className="p-6 max-w-7xl mx-auto min-h-full animate-in fade-in zoom-in-[0.98] slide-in-from-bottom-2 duration-300 ease-out fill-mode-both"
          >
            {children}
          </div>

        </main>
        
      </motion.div>
    </motion.div>
  );
}