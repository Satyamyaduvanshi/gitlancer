'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle2, Sparkles, Code2, FolderGit2, WalletCards, LayoutDashboard, HelpCircle } from 'lucide-react';
import Image from 'next/image';

const TOUR_STEPS = [
  {
    id: 'welcome',
    icon: Sparkles,
    title: "Welcome to SOLUX",
    content: "Let's take a quick 30-second tour of your new command center.",
  },
  {
    id: 'wallet',
    icon: WalletCards,
    title: "Secure Settlement",
    content: "Attach your wallet to the platform in the sidebar. SOLUX requires an active connection to manage your treasury—otherwise, nothing works!",
  },
  {
    id: 'bot',
    icon: Code2,
    title: "Automated Audits",
    content: "Install the GitHub app from the bottom left. You need this to initialize blinky-solux so it can autonomously audit your repositories.",
  },
  {
    id: 'repos',
    icon: FolderGit2,
    title: "Vault Management",
    content: "Head to Repositories. This is where the magic happens. Initialize your repo vaults here and keep an eye on active bounties.",
  },
  {
    id: 'recharge',
    icon: WalletCards,
    title: "Fuel the Treasury",
    content: "Keep operations running smoothly. Use the Recharge section to fund your repository vaults directly from your connected wallet.",
  },
  {
    id: 'overview',
    icon: LayoutDashboard,
    title: "Command Center",
    content: "Your Overview gives you real-time, high-level analytics of your entire board, treasury stats, and active vaults.",
  },
  {
    id: 'help',
    icon: HelpCircle,
    title: "We're Here",
    content: "Lost? Click Help in the sidebar to learn how to navigate the platform or get direct assistance from the team.",
  }
];

export default function FloatingOnboarding() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    // 🛡️ THE FIX: Check local storage so it ONLY runs the first time
    const isCompleted = localStorage.getItem('solux_onboarding_complete');
    
    // Wait for initial dashboard entrance animations to finish (1.5s) before popping up
    if (!isCompleted) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // 🛡️ THE FIX: Set local storage so it never runs again
    localStorage.setItem('solux_onboarding_complete', 'true');
  };

  const handleNext = () => {
    if (currentStep === TOUR_STEPS.length - 1) {
      handleClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  if (!hasMounted) return null;

  const stepData = TOUR_STEPS[currentStep];
  const StepIcon = stepData.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(5px)" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[9999] w-[calc(100vw-32px)] sm:w-[380px]"
          style={{ perspective: "1000px" }}
        >
          <div className="bg-[#111111]/95 backdrop-blur-2xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] rounded-[2rem] p-6 sm:p-8 relative overflow-hidden">
            
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-persimmon/20 blur-[50px] rounded-full pointer-events-none" />

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-persimmon">
                <StepIcon size={24} />
              </div>
              <button 
                onClick={handleClose}
                className="p-2 bg-black/20 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 min-h-[110px]"
              >
                <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                  {stepData.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {stepData.content}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between relative z-10">
              <div className="flex gap-1.5">
                {TOUR_STEPS.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === currentStep ? 'w-6 bg-persimmon' : i < currentStep ? 'w-2 bg-white/20' : 'w-2 bg-white/5'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="py-2.5 px-6 bg-white text-black text-sm font-bold rounded-xl hover:bg-persimmon hover:text-white hover:shadow-[0_0_20px_rgba(252,76,2,0.3)] transition-all duration-300 active:scale-95 flex items-center gap-2 group"
              >
                {currentStep === TOUR_STEPS.length - 1 ? (
                  <>Finish <CheckCircle2 size={16} /></>
                ) : (
                  <>Next <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}