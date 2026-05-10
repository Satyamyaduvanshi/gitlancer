'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';
import { Home, ArrowRight, Info } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-[#000000] text-zinc-100 font-sans selection:bg-orange-500/30 selection:text-orange-100 items-center justify-center relative overflow-hidden">
      
   
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
      {/* Deep vignette */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] pointer-events-none" />
      {/* Ambient brand glow behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* --- Home Button --- */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 z-50"
      >
        <Link 
          href="/"
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md group shadow-lg"
        >
          <Home size={16} className="transition-transform group-hover:scale-110" />
          Home
        </Link>
      </motion.div>

      {/* --- Main Login Card --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[400px] relative z-10 flex flex-col items-center bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 p-10 sm:p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] ring-1 ring-white/5"
      >
        
        {/* Lottie Animation */}
        <div 
          className="w-40 h-40 -mt-8 mb-4 opacity-80 transition-opacity hover:opacity-100 drop-shadow-2xl"
          style={{
            '--lottie-cat-eyes-color': '#ffffff',
            '--lottie-cat-whiskers-color': '#a1a1aa',
            '--lottie-cat-paws-color': '#e4e4e7',
          } as React.CSSProperties}
        >
          <DotLottieReact 
            src="https://lottie.host/8cf4ba71-e5fb-44f3-8134-178c4d389417/0CCsdcgNIP.json" 
            loop 
            autoplay 
          />
        </div>

        {/* Logo & Brand */}
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-white/10 p-1.5 rounded-lg border border-white/10 shadow-inner">
            <Image 
              src="/logo-orange.svg" 
              alt="SOLUX" 
              width={20} 
              height={20} 
              priority 
            />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            SOLUX
          </span>
        </div>

        {/* Text */}
        <div className="text-center mb-8 w-full">
          <h1 className="text-2xl font-bold tracking-tight mb-2 text-white">Welcome back</h1>
          <p className="text-zinc-400 text-sm font-medium leading-relaxed">
            Authenticate via GitHub to access <br/> your open-source treasury.
          </p>
        </div>

        {/* Premium GitHub Button */}
        <button
          onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
          className="group relative w-full flex items-center justify-center gap-3 bg-white text-black py-4 px-4 rounded-xl font-bold text-sm transition-all duration-300 hover:bg-[#fc4c02] hover:text-white hover:shadow-[0_10px_30px_rgba(252,76,2,0.3)] active:scale-[0.98] overflow-hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="relative z-10"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span className="relative z-10">Continue with GitHub</span>
        </button>

        {/* Footer Text */}
        <div className="mt-8 text-center w-full">
          <p className="text-[10px] font-mono text-zinc-500 tracking-[0.2em] uppercase">
            Powered by <a href="https://solana.com" target="_blank" rel="noreferrer" className="text-[#14F195] font-bold opacity-80 cursor-pointer hover:opacity-100 transition-opacity">SOLANA</a>
          </p>
        </div>
      </motion.div>

      {/* --- Contributor Notice (Bottom Right) --- */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 max-w-[280px]"
      >
        <div className="p-5 rounded-2xl border border-white/10 bg-[#0a0a0a]/60 backdrop-blur-2xl shadow-2xl group cursor-default relative z-10 ring-1 ring-white/5 transition-all hover:bg-[#0a0a0a]/80">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-full bg-white/5 border border-white/5 text-zinc-400 group-hover:text-white group-hover:bg-[#fc4c02]/20 group-hover:border-[#fc4c02]/30 transition-all mt-0.5 shadow-inner">
              <Info size={16} />
            </div>
            <div>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                <strong className="text-white">Contributor?</strong><br />
                No need to log in to the dashboard.
              </p>
              <Link 
                href="/link" 
                className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-[#fc4c02] hover:text-white transition-colors"
              >
                Link yourself instead
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}