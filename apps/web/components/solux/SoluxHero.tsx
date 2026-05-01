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

  // 3. Mini Pipeline Lighting Animation
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
      className="relative isolate min-h-screen w-full overflow-hidden bg-black selection:bg-persimmon/30 selection:text-persimmon flex flex-col items-center justify-center pt-20 pb-12"
    >
      
      {/* 🌌 Custom React Three Fiber Background */}
      <Solux3DBackground />

      {/* ⚡ Modern Vignette Overlay */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_0%,#000000_80%)] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-persimmon/5 to-transparent blur-3xl pointer-events-none" />

      {/* 🚀 Main Centered Content */}
      <div className="relative z-20 mx-auto w-full max-w-5xl px-6 flex flex-col items-center text-center">
        
        <motion.div variants={containerVars} className="flex flex-col items-center w-full">
          
          {/* Version Badge */}
          <motion.div
            variants={itemVars}
            className="flex items-center gap-2 rounded-full bg-[#111]/80 border border-white/10 px-3 py-1.5 backdrop-blur-md mb-8 shadow-xl"
          >
            <span className="relative flex h-2 w-2 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono font-medium text-white/70 pr-1 tracking-wide uppercase">
              Mainnet Beta Soon
            </span>
          </motion.div>

          {/* MASSIVE Premium Headline */}
          <motion.h1
            variants={itemVars}
            className="text-6xl sm:text-7xl lg:text-[6.5rem] font-bold leading-[1.05] tracking-tighter text-white drop-shadow-2xl"
          >
            Merge code. <br className="sm:hidden" />
            Mint <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-persimmon to-orange-500">crypto.</span>
          </motion.h1>

          {/* Enlarged Tagline */}
          <motion.p
            variants={itemVars}
            className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-white/50 leading-relaxed font-medium"
          >
            The autonomous treasury for open-source. Ship PRs and get paid directly to your Solana wallet in milliseconds.
          </motion.p>

          {/* ================= THE REFINED "CODE FLOW" VISUALIZER ================= */}
          <motion.div 
            variants={flowVars}
            className="mt-12 relative overflow-hidden flex items-center gap-3 sm:gap-6 bg-[#0a0a0a]/80 border border-white/10 rounded-full px-6 py-3 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)]"
          >
            {/* Animated scanning light effect inside the pill */}
            <motion.div 
              animate={{ x: ["-200%", "200%"] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }} 
              className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" 
            />

            {/* Step 1 */}
            <motion.div variants={stepVars} className="flex items-center gap-2">
              <GitPullRequest size={16} className="text-white/50" />
              <span className="text-sm font-mono text-white/70 tracking-tight">Merge PR</span>
            </motion.div>

            <ChevronRight size={14} className="text-white/20" />

            {/* Step 2 */}
            <motion.div variants={stepVars} className="flex items-center gap-2">
              <Cpu size={16} className="text-persimmon" />
              <span className="text-sm font-mono text-persimmon tracking-tight">Audit Passed</span>
            </motion.div>

            <ChevronRight size={14} className="text-white/20" />

            {/* Step 3 */}
            <motion.div variants={stepVars} className="flex items-center gap-2">
              <Wallet size={16} className="text-emerald-400" />
              <span className="text-sm font-mono text-emerald-400 tracking-tight">Settled</span>
            </motion.div>
          </motion.div>

          {/* Smart CTA Buttons */}
          <motion.div variants={itemVars} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5 w-full">
            
            {/* Intelligent Auth Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link
                href={isLoggedIn ? "/dashboard" : "/login"}
                className="group flex items-center justify-center gap-2 bg-white text-black px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] w-full"
              >
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
            </motion.div>
            
            {/* Docs Button */}
            <motion.div whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link
                href="/docs"
                className="flex items-center justify-center gap-2 bg-transparent border border-white/15 text-white/80 hover:text-white px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all w-full"
              >
                <BookOpen size={16} className="text-white/50" />
                Documentation
              </Link>
            </motion.div>

          </motion.div>

        </motion.div>
      </div>
    </motion.section>
  );
}