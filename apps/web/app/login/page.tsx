'use client';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-[#000000] text-zinc-100 font-nocturn-regular selection:bg-zinc-800 selection:text-white items-center justify-center relative overflow-hidden">
      
      {/* 🌌 FULL SCREEN DOT BACKGROUND (Shadcn Style) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.06] pointer-events-none" />
      {/* Radial mask to smoothly fade out the dots toward the edges */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] pointer-events-none" />

      {/* 🔙 BACK BUTTON */}
      <Link 
        href="/"
        className="absolute top-6 left-6 sm:top-10 sm:left-10 z-50 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-all group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover:-translate-x-1"
        >
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back
      </Link>

      {/* 📦 THE CONTAINER (Minimalist Monochrome Card) */}
      <div className="w-full max-w-sm relative z-10 flex flex-col items-center bg-[#0a0a0a]/90 backdrop-blur-md border border-white/20 p-8 sm:p-10 rounded-2xl shadow-2xl">
        
        {/* 🐱 CUSTOMIZED Animated Cat (Lottie) - Grayscale Accents */}
        <div 
          className="w-40 h-40 -mt-6 mb-2 opacity-80 transition-opacity hover:opacity-100"
          style={{
            // Accents changed to stark white and soft gray for a colorless, clean look
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

        {/* Logo - Filtered to match the monochrome vibe */}
        <div className="flex items-center gap-1 mb-8 opacity-90">
          <Image 
            src="/logo-orange.svg" 
            alt="SOLUX" 
            width={24} 
            height={24} 
            priority 
            className="opacity-90" 
          />
          <span className="text-xl font-bold tracking-tight text-white ">
            SOLUX
          </span>
        </div>

        {/* Quiet Typography */}
        <div className="text-center mb-8 w-full">
          <h1 className="text-2xl font-medium tracking-tight mb-2 text-white">Sign in</h1>
          <p className="text-zinc-500 text-sm font-normal">
            Authenticate via GitHub to access 
          </p>
          <p className="text-zinc-500 text-sm font-normal">
          your treasury.
          </p>
        </div>

        {/* ✨ High-Contrast Minimalist Button */}
        <button
          onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
          className="group w-full flex items-center justify-center gap-3 bg-white text-black py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-persimmon/70 hover:text-white active:scale-90 hover:duration-300 ease-in-out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span>Continue with GitHub</span>
        </button>

        {/* Ghost Footer */}
        <div className="mt-8 text-center w-full">
          <p className="text-[10px] font-mono text-zinc-600 tracking-[0.15em] uppercase">
            Powered by <a className="text-[#9945FF] opacity-100 cursor-pointer hover:text-white transition-colors" >SOLANA</a>
          </p>
        </div>
      </div>

      {/* 💡 CONTRIBUTOR NOTE (Bottom Right Floating Card) */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-50 max-w-[280px]">
        
        {/* 🏹 Hand-drawn Notice Arrow (Pulled further up and left) */}
        <div className=" -top-[90px] -left-[105px] sm:-top-[105px] sm:-left-[100px] pointer-events-none opacity-80 z-20 transition-transform hover:scale-105">
          <Image 
            src="/notice.svg" 
            alt="Notice Arrow" 
            width={80} 
            height={80} 
            className="w-24 sm:w-32 h-auto drop-shadow-lg"
          />
        </div>

        <div className="p-4 rounded-2xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl shadow-2xl group cursor-default relative z-10">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-white/5 text-zinc-400 group-hover:text-white transition-colors mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
              </svg>
            </div>
            <div>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                <strong className="text-persimmon font-medium">Contributor?</strong><br />
                No need to log in to the dashboard.
              </p>
              <Link 
                href="/link" 
                className="inline-flex items-center gap-1.5 mt-2.5 text-xs font-medium text-white hover:text-zinc-300 transition-colors"
              >
                Link yourself instead
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}