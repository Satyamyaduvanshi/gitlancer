"use client";

import { motion, Variants } from "framer-motion";

export default function SoluxHero() {
  // Container entrance animation
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Smooth opening animations for the bottom cards
  const cardLeftVars: Variants = {
    hidden: { opacity: 0, x: -60, y: 60, rotate: -15 },
    visible: { 
      opacity: 1, x: 0, y: 0, rotate: -6, 
      transition: { type: "spring", stiffness: 80, damping: 15, delay: 0.8 } 
    }
  };

  const cardRightVars: Variants = {
    hidden: { opacity: 0, x: 60, y: 60, rotate: 15 },
    visible: { 
      opacity: 1, x: 0, y: 0, rotate: 6, 
      transition: { type: "spring", stiffness: 80, damping: 15, delay: 1.0 } 
    }
  };

  const cardCenterVars: Variants = {
    hidden: { opacity: 0, y: 80, scale: 0.9 },
    visible: { 
      opacity: 1, y: 0, scale: 1, 
      transition: { type: "spring", stiffness: 100, damping: 20, delay: 1.2 } 
    }
  };

  // Subtle floating animation for the background objects
  const floatAnimation = {
    y: [-8, 8, -8],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <section className="relative isolate min-h-dvh w-full overflow-hidden bg-[#fafafa] dark:bg-black selection:bg-persimmon selection:text-white">
      {/* Drawing Paper Noise Texture */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />


      {/* Floating Background Assets - SIZES INCREASED */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Top Left Paperclip */}
        <motion.img
          animate={floatAnimation}
          src="./logos/solana.svg"
          alt=""
          className="absolute top-[8%] left-[2%] w-24 md:w-36 -rotate-12 opacity-90 drop-shadow-sm"
        />
        {/* Left Keyboard */}
        <motion.img
          animate={{ y: [-15, 15, -15], transition: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
          src="https://framerusercontent.com/images/rHF7ngOvRWlxUCFw3CaFKk47z8.png?scale-down-to=1024&width=1611&height=968"
          alt=""
          className="absolute scale-110 top-[57%] -left-20 w-64 md:w-[28rem] -rotate-12 opacity-95 drop-shadow-lg dark:brightness-75 dark:contrast-125"
        />
        {/* Top Right Laptop */}
        <motion.img
          animate={{ y: [10, -10, 10], transition: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }}
          src="https://framerusercontent.com/images/57aau0qXXJZVzKDCkclMnY0ykdc.png?scale-down-to=1024&width=3180&height=2832"
          alt=""
          className="absolute -top-10 -right-70 w-72 md:w-[32rem] rotate-[15deg] opacity-95 drop-shadow-xl dark:brightness-75 dark:contrast-125"
        />
        {/* Bottom Right Binder Clip */}
        <motion.img
          animate={floatAnimation}
          src="https://framerusercontent.com/images/HU9hBZdjRywQqBdKxn8A7kQTgg8.png?width=532&height=607"
          alt=""
          className="absolute bottom-[15%] right-[5%] w-20 md:w-32 rotate-[35deg] opacity-90 drop-shadow-md scale-200"
        />
      </div>

      <div className="relative z-20 mx-auto flex min-h-dvh w-full max-w-5xl flex-col items-center justify-start px-4 pt-32 pb-14 text-center sm:px-6 lg:px-8">
        <motion.div
          variants={containerVars}
          initial="hidden"
          animate="visible"
          className="mx-auto flex flex-col items-center pointer-events-auto w-full"
        >
          {/* Top Badge */}
          <motion.div
            variants={itemVars}
            className="w-fit rounded-full bg-persimmon/10 px-4 py-1.5 text-[11px] font-medium text-persimmon dark:bg-persimmon/10 dark:text-persimmon border border-permisson/20 dark:border-persimmon/20 backdrop-blur-sm"
          >
            Same day settlement, 0% developer fees
          </motion.div>

          {/* Headline - "code" Highlighted */}
          <motion.h1
            variants={itemVars}
            className="mt-6 font-nocturn text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-neutral-900 dark:text-white"
          >
            Engineered for contributors.
            <br />
            Governed by <span className="text-persimmon">code</span>.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVars}
            className="mt-6 max-w-xl text-pretty text-[clamp(1rem,2vw,1.1rem)] leading-relaxed text-neutral-600 dark:text-neutral-400"
          >
            The autonomous bridge between GitHub and Solana. Merge a pull request and get paid direct to your wallet in seconds.
          </motion.p>

          {/* CTA & Trust Badges */}
          <motion.div variants={itemVars} className="mt-8 flex flex-col items-center gap-6">
            {/* Smoothed Hover Animation for Button */}
            <motion.button
              whileHover={{ 
                scale: 1.04, 
                boxShadow: "0px 8px 25px rgba(252, 76, 2, 0.35)" 
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-8 py-4 text-sm font-semibold text-white transition-colors dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              Connect GitHub
            </motion.button>

            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-sky-600 dark:text-sky-400">
              <span className="flex items-center gap-1.5">
                <CheckCircleIcon /> Verified PRs
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircleIcon /> On-chain Vaults
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircleIcon /> Instant USDC
              </span>
            </div>
          </motion.div>

          {/* Overlapping Mockup Cards with Entrance & Hover Animations */}
          <div className="relative mt-24 h-[300px] w-full max-w-3xl">
            {/* Left Background Card */}
            <motion.div 
              variants={cardLeftVars}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 50, y: -15 }}
              className="absolute left-[10%] top-12 z-10 w-[350px] origin-bottom-left rounded-2xl bg-white p-6 shadow-xl dark:bg-carbon dark:border dark:border-white/5 cursor-pointer"
            >
              <div className="text-left font-mono text-[10px] text-neutral-400 uppercase tracking-wider mb-4">Pull Request #104</div>
              <div className="flex justify-between items-center border-b border-neutral-100 dark:border-white/10 pb-4">
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white">Implement Anchor Auth</div>
                  <div className="text-xs text-neutral-500 mt-1">@Satyamyaduvanshi</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
                  git
                </div>
              </div>
            </motion.div>

            {/* Right Background Card */}
            <motion.div 
              variants={cardRightVars}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 50, y: -15 }}
              className="absolute right-[10%] top-16 z-10 w-[350px] origin-bottom-right rounded-2xl bg-white p-6 shadow-xl dark:bg-carbon dark:border dark:border-white/5 cursor-pointer"
            >
              <div className="text-left font-mono text-[10px] text-neutral-400 uppercase tracking-wider mb-4">Solana Vault</div>
              <div className="flex justify-between items-center border-b border-neutral-100 dark:border-white/10 pb-4">
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white">Treasury Payout</div>
                  <div className="text-xs text-neutral-500 mt-1">Status: Success</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                  $
                </div>
              </div>
            </motion.div>

            {/* Center Main Card */}
            <motion.div 
              variants={cardCenterVars}
              whileHover={{ scale: 1.03, y: -10 }}
              className="absolute left-1/2 top-0 z-30 w-[420px] -translate-x-1/2 rounded-2xl bg-white p-6 shadow-2xl shadow-neutral-200/50 dark:bg-[#020406] dark:shadow-black/50 dark:border dark:border-white/10 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="text-left font-mono text-[10px] text-neutral-400 uppercase tracking-wider">Protocol Settlement</div>
                <div className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">MERGED</div>
              </div>
              
              <div className="flex justify-between items-start border-b border-neutral-100 dark:border-white/10 pb-6 mb-4">
                <div className="text-left">
                  <div className="text-xs text-neutral-500 mb-2">CONTRIBUTOR</div>
                  <div className="flex items-center gap-2">
                    {/* Integrated User Avatar */}
                    <img 
                      src="https://avatars.githubusercontent.com/u/88279507?s=400&u=d9943d656dcd302b3599d1ac3041afbc4e67156d&v=4" 
                      alt="Satyam Yaduvanshi" 
                      className="h-7 w-7 rounded-full border border-neutral-200 dark:border-white/20"
                    />
                    <div className="font-medium text-neutral-900 dark:text-white text-sm">Satyam Yaduvanshi</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-neutral-500 mb-1">BOUNTY</div>
                  <div className="font-nocturn text-2xl font-bold text-neutral-900 dark:text-white">$1,500.00</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>0xSolux...A7f9</span>
                <span className="flex items-center gap-1 text-persimmon"><LockIcon /> Guardian Verified</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Simple SVG Icons
function CheckCircleIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}