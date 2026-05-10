'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 🛡️ FIX: Removed 'Github' from lucide-react imports
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const ONBOARDING_STEPS = [
  {
    id: 'overview',
    title: "Your Command Center",
    content: "Monitor your entire ecosystem in real-time. Track distributed USDC, active repository vaults, and pending contributor claims.",
    image: "/Screenshot_20260510_194049.png", 
  },
  {
    id: 'deploy',
    title: "Deploy AI Guardians",
    content: "Select a GitHub repository to anchor to the Solana blockchain. We automatically generate a unique Smart Contract PDA for each vault.",
    image: "/Screenshot_20260510_194120.png",
  },
  {
    id: 'recharge',
    title: "Treasury Management",
    content: "Fuel your smart contracts with USDC. Your connected wallet acts as the master liquidity source for automated contributor payouts.",
    image: "/Screenshot_20260510_194130.png",
  },
  {
    id: 'bot',
    title: "Mandatory: GitHub Integration",
    content: "To autonomously audit code and execute payouts on-chain, you MUST install the Blinky-Solux GitHub app on your repositories.",
    image: "custom-bot-ui", 
  }
];

export default function MaintainerOnboarding() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const isCompleted = localStorage.getItem('solux_maintainer_onboarding_complete');
    
    if (!isCompleted) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('solux_maintainer_onboarding_complete', 'true');
  };

  const handleNext = () => {
    if (currentStep === ONBOARDING_STEPS.length - 1) {
      handleClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  if (!hasMounted) return null;

  const stepData = ONBOARDING_STEPS[currentStep];

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          
          {/* 🌌 Dark Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* 📦 Centered Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()} 
          >
            
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 z-50 p-2 bg-black/40 hover:bg-white/10 backdrop-blur-md rounded-full text-white/50 hover:text-white transition-all"
            >
              <X size={20} />
            </button>

            {/* 🖼️ Top Half: Image Showcase Area */}
            <div className="w-full bg-[#111] relative border-b border-white/5 overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full aspect-video sm:aspect-[21/9] relative flex items-center justify-center p-8"
                >
                  
                  {/* Subtle Background Glow */}
                  <div className="absolute inset-0 bg-persimmon/5 blur-3xl" />

                  {stepData.image === 'custom-bot-ui' ? (
                    
                    /* 🤖 STEP 4: Custom GitHub Bot UI with Arrow */
                    <div className="relative flex flex-col items-center z-10 w-full max-w-xs">
                      
                      <motion.div 
                        initial={{ opacity: 0, y: -20, rotate: 10 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="absolute -top-16 -right-12 sm:-right-20 z-50 animate-pulse drop-shadow-xl"
                      >
                        <Image src="/arrow3.svg" alt="Look here" width={60} height={60} className="rotate-[45deg] scale-x-[-1]" />
                      </motion.div>

                      <div className="w-full p-6 rounded-2xl border border-white/10 bg-carbon shadow-2xl relative overflow-hidden">
                         <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                         <div className="flex flex-col items-center text-center relative z-10">
                            {/* 🛡️ FIX: Replaced lucide Github with the native Image component */}
                            <div className="p-3 bg-white/5 rounded-xl mb-4 flex items-center justify-center">
                              <Image src="/logos/github.svg" alt="GitHub" width={24} height={24} className="invert" />
                            </div>
                            <h4 className="font-bold text-lg text-white tracking-tight mb-2">GitHub Bot</h4>
                            <p className="text-xs text-white/60 leading-relaxed mb-6">
                              Add Solux to your repo for AI audits & payouts.
                            </p>
                            <div className="w-full py-3 rounded-xl bg-persimmon text-white font-bold text-sm shadow-[0_0_30px_rgba(252,76,2,0.4)] flex justify-center items-center gap-2">
                              Add to Repo <ArrowRight size={16} />
                            </div>
                         </div>
                      </div>
                    </div>

                  ) : (
                    /* 📸 STEPS 1-3: High Quality Screenshots */
                    <div className="relative w-[90%] h-[90%] rounded-xl overflow-hidden border border-white/10 shadow-2xl group-hover:scale-[1.02] transition-transform duration-700">
                      <Image 
                        src={stepData.image} 
                        alt={stepData.title}
                        fill
                        className="object-cover object-top opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-60" />
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* 📝 Bottom Half: Text & Controls */}
            <div className="p-6 sm:p-10 flex flex-col sm:flex-row gap-6 sm:gap-10 items-start sm:items-center justify-between">
              
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-[10px] font-mono text-persimmon uppercase tracking-widest mb-2">
                      Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
                      {stepData.title}
                    </h2>
                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl">
                      {stepData.content}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="flex flex-row sm:flex-col items-center sm:items-end gap-6 sm:gap-4 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
                
                {/* Progress Indicators */}
                <div className="flex gap-2">
                  {ONBOARDING_STEPS.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === currentStep ? 'w-8 bg-persimmon' : 'w-2 bg-white/10'
                      }`}
                    />
                  ))}
                </div>

                {/* Primary Button */}
                <button
                  onClick={handleNext}
                  className="py-3 sm:py-4 px-8 sm:px-10 bg-white text-black text-sm font-bold rounded-2xl hover:bg-persimmon hover:text-white transition-all duration-300 active:scale-95 flex items-center gap-2 group whitespace-nowrap ml-auto sm:ml-0"
                >
                  {currentStep === ONBOARDING_STEPS.length - 1 ? (
                    <>Finish Setup <CheckCircle2 size={18} /></>
                  ) : (
                    <>Next Step <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}