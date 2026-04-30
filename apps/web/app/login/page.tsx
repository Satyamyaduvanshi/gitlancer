'use client';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { GitMerge, CheckCircle2, Coins } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-[#0A0A0A] text-white font-sans selection:bg-persimmon/30">
      
      {/* 🌟 LEFT SIDE: The Visual Billboard (Hidden on small screens) */}
      <div className="hidden lg:flex relative w-1/2 flex-col justify-center items-center overflow-hidden bg-[#050505]">
        
        {/* Background Image (gback.jpg) */}
        <Image 
          src="/gback.jpg" 
          alt="SOLUX Background Texture" 
          fill 
          className="object-cover opacity-30 mix-blend-screen"
          priority
        />
        
        {/* Darker, smoother gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/50 to-transparent" />

        {/* 💻 Sleek Developer-Focused Workflow Card */}
        <div className="relative z-10 w-full max-w-md bg-[#111111]/80 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]">
          
          {/* Window Controls */}
          <div className="flex gap-2 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <div className="w-2.5 h-2.5 rounded-full bg-red-700/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-300/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          
          {/* Workflow Content */}
          <div className="p-6 space-y-6">
            {/* Step 1: PR Merged */}
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                   <GitMerge size={18} />
                 </div>
                 <div className="font-mono text-sm text-white/70">
                   merged <span className="text-white font-bold tracking-tight">PR #104</span>
                 </div>
               </div>
               <span className="text-[10px] text-white/30 font-mono tracking-widest uppercase">just now</span>
            </div>

            {/* Step 2: System Check */}
            <div className="pl-4 ml-4 border-l-2 border-white/5 space-y-3 py-1">
              <div className="flex items-center gap-3 text-xs font-mono text-white/50">
                <CheckCircle2 size={14} className="text-emerald-500/70" /> 
                <span>security_audit.yml passed</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-white/50">
                <CheckCircle2 size={14} className="text-emerald-500/70" /> 
                <span>bounty_tag_verified</span>
              </div>
            </div>

            {/* Step 3: Payout */}
            <div className="flex justify-between items-center p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
               <div className="flex items-center gap-3">
                 <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-500">
                   <Coins size={16} />
                 </div>
                 <span className="font-mono text-sm text-emerald-500 font-medium">Payout settled</span>
               </div>
               <span className="font-mono text-sm font-bold text-emerald-400">+50.00 USDC</span>
            </div>
          </div>
        </div>

        {/* Minimal Value Proposition */}
        <div className="relative z-10 mt-12 text-center max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <h2 className="text-2xl font-bold mb-3 tracking-tight">Autonomous Git Treasury.</h2>
          <p className="text-white/40 text-sm leading-relaxed font-medium">
            Connect your repository, set bounties on issues, and let SOLUX handle the on-chain settlements automatically.
          </p>
        </div>
      </div>

      {/* 🔐 RIGHT SIDE: The Clean Authentication Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 relative bg-[#0A0A0A]">
        
        {/* Minimal Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="w-full max-w-[360px] relative z-10 animate-in fade-in zoom-in-95 duration-700 ease-out">
          
          {/* Logo Container */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo-orange.svg" 
                alt="SOLUX Logo" 
                width={32} 
                height={32} 
                priority 
              />
              <span className="text-2xl font-bold tracking-tighter text-white">
                SOLUX<span className="text-persimmon">.</span>
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome Back</h1>
            <p className="text-white/50 text-sm">
              Log in to manage your smart treasury.
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black py-3.5 rounded-2xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:-translate-y-0.5 active:scale-[0.98] group"
          >
            {/* Raw SVG GitHub Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="group-hover:scale-110 transition-transform duration-300"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Continue with GitHub
          </button>

          {/* Clean Footer Note */}
          <div className="mt-10 text-center">
            <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase">
              Powered by Solana
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}