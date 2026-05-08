"use client";

import { motion, Variants } from "framer-motion";
import { ChevronRight, Cpu, Wallet, GitPullRequest, ArrowRight, BookOpen } from "lucide-react"; 
import { FaGithub } from "react-icons/fa6"; 
import Link from "next/link";
import { useSession } from "next-auth/react"; 
import Solux3DBackground from "./Solux3DBackground"; 

export default function SoluxHero() {
  const { data: session, status } = useSession(); 
  const isLoggedIn = status === "authenticated";

  // 1. Page Entrance
  const pageEntrance = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, ease: "easeOut" } }
  };

  // 2. Text Animations
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // 3. Mini Pipeline Animation
  const flowVars: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { staggerChildren: 0.2, delayChildren: 0.8, duration: 0.5 }
    }
  };

  const stepVars: Variants = {
    hidden: { opacity: 0.3, filter: "grayscale(100%)" },
    visible: { opacity: 1, filter: "grayscale(0%)", transition: { duration: 0.4 } }
  };

  return (
    <motion.section 
      initial="hidden" 
      animate="visible" 
      variants={pageEntrance}
      className="relative isolate min-h-screen w-full overflow-hidden bg-[#050505] selection:bg-[#fc4c02]/30 selection:text-[#fc4c02] flex flex-col items-center justify-center pt-20 pb-12"
    >
      
      {/* 🌌 Custom React Three Fiber Background */}
      <Solux3DBackground />

      {/* ⚡ Modern Vignette Overlay */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_80%)] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#fc4c02]/10 to-transparent blur-3xl pointer-events-none" />

      {/* 🚀 Main Centered Content */}
      <div className="relative z-20 mx-auto w-full max-w-5xl px-6 flex flex-col items-center text-center">
        
        <motion.div variants={containerVars} className="flex flex-col items-center w-full">
          
          {/* 🛡️ REFINED: Minimalist Version Badge (Removed the heavy box) */}
          <motion.div
            variants={itemVars}
            className="flex items-center gap-3 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[12px] font-mono font-medium text-white/50 tracking-[0.2em] uppercase">
              Mainnet Beta Soon
            </span>
          </motion.div>

          {/* MASSIVE Premium Headline */}
          <motion.h1
            variants={itemVars}
            className="text-6xl sm:text-7xl lg:text-[7rem] font-bold leading-[1.05] tracking-tighter text-white drop-shadow-2xl"
          >
            Merge code. <br className="sm:hidden" />
            Mint <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#fc4c02] to-orange-600">crypto.</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={itemVars}
            className="mt-8 max-w-2xl mx-auto text-lg sm:text-xl text-white/50 leading-relaxed font-light"
          >
            The autonomous treasury for open-source. Ship PRs and get paid directly to your Solana wallet in milliseconds.
          </motion.p>

          {/* 🛡️ REFINED: The "Code Flow" Visualizer (Removed the pill border, made it sleek) */}
          <motion.div 
            variants={flowVars}
            className="mt-14 flex items-center justify-center gap-4 sm:gap-8"
          >
            {/* Step 1 */}
            <motion.div variants={stepVars} className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <GitPullRequest size={18} className="text-white/70" />
              </div>
              <span className="text-xs font-mono text-white/50 tracking-tight">Merge PR</span>
            </motion.div>

            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-white/10 via-white/30 to-white/10" />

            {/* Step 2 */}
            <motion.div variants={stepVars} className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-[#fc4c02]/10 flex items-center justify-center border border-[#fc4c02]/20 shadow-[0_0_15px_rgba(252,76,2,0.2)]">
                <Cpu size={18} className="text-[#fc4c02]" />
              </div>
              <span className="text-xs font-mono text-[#fc4c02] tracking-tight">Audit Passed</span>
            </motion.div>

            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-white/10 via-white/30 to-white/10" />

            {/* Step 3 */}
            <motion.div variants={stepVars} className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Wallet size={18} className="text-emerald-400" />
              </div>
              <span className="text-xs font-mono text-emerald-400 tracking-tight">Settled</span>
            </motion.div>
          </motion.div>

          {/* Smart CTA Buttons */}
          <motion.div variants={itemVars} className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            
            {/* Primary Button */}
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="group relative flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-95 w-full sm:w-auto overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-[200%] group-hover:animate-[shimmer_1.5s_infinite]" />
              {isLoggedIn ? (
                <>
                  Go to Dashboard
                  <ArrowRight size={18} className="text-black/50 group-hover:translate-x-1 transition-transform ml-1" />
                </>
              ) : (
                <>
                  <FaGithub size={18} />
                  Connect GitHub
                  <ArrowRight size={18} className="text-black/50 group-hover:translate-x-1 transition-transform ml-1" />
                </>
              )}
            </Link>
            
            {/* Secondary Button */}
            <Link
              href="/docs"
              className="group flex items-center justify-center gap-2 bg-transparent text-white/70 hover:text-white px-8 py-4 rounded-xl font-semibold text-sm tracking-wide transition-all hover:bg-white/5 active:scale-95 w-full sm:w-auto"
            >
              <BookOpen size={16} className="text-white/40 group-hover:text-white/80 transition-colors" />
              Documentation
            </Link>

          </motion.div>

        </motion.div>
      </div>
    </motion.section>
  );
}