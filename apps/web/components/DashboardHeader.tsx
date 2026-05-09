'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import NotificationBell from './NotificationBell';

export default function DashboardHeader() {
  const { data: session, status } = useSession();

  // Extract just the first name for a cleaner greeting
  const name = session?.user?.name?.split(' ')[0] || 'Maintainer';
  const username = (session?.user as any)?.username || 'github_user';
  const image = session?.user?.image || '/gback.jpg'; 

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex justify-between items-center bg-background rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-black/5 dark:border-white/5 p-4 pl-8 flex-shrink-0"
    >
      
      {/* 👋 Left: Personalized Welcome Message */}
      <div className="flex flex-col justify-center">
        <h2 className="text-xl font-bold text-foreground tracking-tight">
          Welcome back, <span className="text-persimmon">{name}</span> <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
        </h2>
        <p className="text-xs text-foreground/50 font-medium mt-0.5">
          Here is what's happening with your treasury today.
        </p>
      </div>

      {/* 👤 Right: Actions & User Profile */}
      <div className="flex items-center gap-5 pr-2">
        
        {/* Notification Bell */}
        <NotificationBell />

        {/* Subtle Divider */}
        <div className="w-px h-8 bg-black/10 dark:bg-white/10" />

        {/* User Identity Info */}
        <div className="flex items-center gap-3 cursor-pointer group">
          
          {/* GitHub Name & ID (Right Aligned) */}
          <div className="flex flex-col justify-center text-right">
            {status === 'loading' ? (
              <>
                <div className="h-3 w-20 bg-steel animate-pulse rounded mb-1 ml-auto" />
                <div className="h-2 w-16 bg-steel/50 animate-pulse rounded ml-auto" />
              </>
            ) : (
              <>
                <span className="text-sm font-bold text-foreground leading-tight group-hover:text-persimmon transition-colors">{name}</span>
                <span className="text-[11px] text-foreground/50 font-mono leading-tight tracking-wide">@{username}</span>
              </>
            )}
          </div>

          {/* GitHub Avatar */}
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-black/5 dark:border-white/5 shadow-sm group-hover:border-persimmon/50 transition-all duration-300">
            {status === 'loading' ? (
              <div className="w-full h-full bg-steel animate-pulse" />
            ) : (
              <Image src={image} alt="GitHub Avatar" fill className="object-cover" />
            )}
          </div>

        </div>
      </div>

    </motion.header>
  );
}