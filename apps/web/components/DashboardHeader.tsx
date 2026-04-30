'use client';
import { Search, Command, Mail } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import NotificationBell from './NotificationBell';

export default function DashboardHeader() {
  const { data: session, status } = useSession();

  const name = session?.user?.name || 'Builder';
  const username = (session?.user as any)?.username || 'github_user';
  const image = session?.user?.image || '/gback.jpg'; 

  return (
    // ⚡ Now styled exactly like the Sidebar and Main Content cards
    <header className="flex justify-between items-center bg-background rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-black/5 dark:border-white/5 p-4 pl-6 flex-shrink-0">
      
      {/* 🔍 Left: Search Bar Pill */}
      <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 px-4 py-2.5 rounded-full border border-black/5 dark:border-white/5 w-full max-w-md transition-all focus-within:ring-2 focus-within:ring-persimmon/50 focus-within:border-persimmon">
        <Search size={18} className="text-foreground/40" />
        <input 
          type="text" 
          placeholder="Search task" 
          className="bg-transparent border-none outline-none text-sm text-foreground w-full placeholder:text-foreground/30 font-sans" 
        />
        <div className="flex items-center gap-1 bg-white dark:bg-black/50 rounded-md px-1.5 py-1 text-[10px] font-mono text-foreground/50 select-none shadow-sm border border-black/5 dark:border-white/5">
          <Command size={10} />
          <span>F</span>
        </div>
      </div>

      {/* 👤 Right: Actions & User Profile */}
      <div className="flex items-center gap-3">
        
        {/* Messages / Mail Icon */}
        <button className="p-2.5 bg-black/5 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200 active:scale-95 group">
          <Mail size={18} className="text-foreground/60 group-hover:text-persimmon transition-colors" />
        </button>

        {/* Notification Bell */}
        <NotificationBell />

        {/* User Identity Info */}
        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          
          {/* GitHub Avatar */}
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-black/10 dark:border-white/10 shadow-sm group-hover:ring-2 group-hover:ring-persimmon/50 transition-all">
            {status === 'loading' ? (
              <div className="w-full h-full bg-steel animate-pulse" />
            ) : (
              <Image src={image} alt="GitHub Avatar" fill className="object-cover" />
            )}
          </div>
          
          {/* GitHub Name & ID */}
          <div className="flex flex-col justify-center pr-2">
            {status === 'loading' ? (
              <>
                <div className="h-3 w-20 bg-steel animate-pulse rounded mb-1" />
                <div className="h-2 w-16 bg-steel/50 animate-pulse rounded" />
              </>
            ) : (
              <>
                <span className="text-sm font-bold text-foreground leading-tight group-hover:text-persimmon transition-colors">{name}</span>
                <span className="text-[11px] text-foreground/50 font-mono leading-tight tracking-wide">@{username}</span>
              </>
            )}
          </div>

        </div>
      </div>

    </header>
  );
}