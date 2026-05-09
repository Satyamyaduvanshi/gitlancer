'use client';
import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Settings, User } from 'lucide-react';
import Link from 'next/link';
import NotificationBell from './NotificationBell';

export default function DashboardHeader() {
  const { data: session, status } = useSession();
  
  // Interaction States
  const [isHoveringProfile, setIsHoveringProfile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Extract just the first name for a cleaner greeting
  const name = session?.user?.name?.split(' ')[0] || 'Maintainer';
  const username = (session?.user as any)?.username || 'github_user';
  const image = session?.user?.image || '/gback.jpg'; 

  // Close dropdown when clicking anywhere outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex justify-between items-center bg-background rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-black/5 dark:border-white/5 p-4 pl-8 flex-shrink-0 relative z-50"
    >
      
      {/* 👋 Left: Personalized Welcome Message */}
      <div className="flex flex-col justify-center">
        <h2 className="text-xl font-bold text-foreground tracking-tight">
          Welcome back, <span className="text-persimmon">{name}</span>{' '}
          <span 
            className={`inline-block origin-[70%_70%] transition-transform duration-300 ${isHoveringProfile ? 'animate-wave' : ''}`}
          >
            👋
          </span>
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

        {/* User Identity Info & Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          
          {/* The Clickable Profile Area */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onMouseEnter={() => setIsHoveringProfile(true)}
            onMouseLeave={() => setIsHoveringProfile(false)}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
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
            <div className={`relative w-11 h-11 rounded-full overflow-hidden border-2 shadow-sm transition-all duration-300 ${
              isDropdownOpen ? 'border-persimmon' : 'border-black/5 dark:border-white/5 group-hover:border-persimmon/50'
            }`}>
              {status === 'loading' ? (
                <div className="w-full h-full bg-steel animate-pulse" />
              ) : (
                <Image src={image} alt="GitHub Avatar" fill className="object-cover" />
              )}
            </div>
          </div>

          {/* 🔽 Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 mt-4 w-56 bg-background border border-black/5 dark:border-white/5 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col p-2"
              >
                
                {/* User Info Header inside Dropdown */}
                <div className="px-4 py-3 border-b border-black/5 dark:border-white/5 mb-2">
                  <p className="text-xs font-mono text-foreground/50 uppercase tracking-widest mb-1">Signed in as</p>
                  <p className="text-sm font-bold text-foreground truncate">@{username}</p>
                </div>

                <Link 
                  href="/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                >
                  <Settings size={16} /> Settings
                </Link>

                <button 
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all duration-200 active:scale-95 w-full text-left"
                >
                  <LogOut size={16} /> Sign Out
                </button>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </motion.header>
  );
}