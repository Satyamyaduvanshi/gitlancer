"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GitPullRequest, ShieldCheck, Zap } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Blinky Audit AI",
    subtitle: "Instant static analysis",
    description: "The moment a PR is merged, Blinky intercepts the webhook. It performs deep static analysis, checks for vulnerabilities, and verifies the contribution against bounty criteria in milliseconds.",
    icon: GitPullRequest,
    color: "text-purple-500",
    glow: "shadow-[0_0_50px_rgba(168,85,247,0.3)]",
  },
  {
    id: 2,
    title: "Identity Guardian",
    subtitle: "Cryptographic binding",
    description: "Zero spoofing. The Guardian protocol cryptographically binds the contributor's GitHub handle to their verified Solana wallet, ensuring funds only flow to the legitimate author.",
    icon: ShieldCheck,
    color: "text-amber-500",
    glow: "shadow-[0_0_50px_rgba(245,158,11,0.3)]",
  },
  {
    id: 3,
    title: "Vault Settlement",
    subtitle: "Zero-friction payout",
    description: "Upon audit success, the on-chain vault is triggered. USDC is instantly routed to the contributor's wallet with zero intermediary fees. PR merged, crypto minted.",
    icon: Zap,
    color: "text-emerald-500",
    glow: "shadow-[0_0_50px_rgba(16,185,129,0.3)]",
  }
];

export default function SoluxStoryFlow() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress through this entire section (0 to 1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ================= SCROLL TRANSFORMATIONS =================

  // 1. Massive Headline Animation (Fades out and moves up as you scroll past it)
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -100]);

  // 2. Visualizer Animations (The dynamic shape on the left)
  // State 1 (Audit - Purple): 0.1 to 0.4
  // State 2 (Guardian - Amber): 0.4 to 0.7
  // State 3 (Settlement - Emerald): 0.7 to 1.0
  
  const visualizerRotateX = useTransform(scrollYProgress, [0.1, 0.4, 0.7, 1], [30, 60, 0, 45]);
  const visualizerRotateY = useTransform(scrollYProgress, [0.1, 0.4, 0.7, 1], [0, 180, 45, 360]);
  const visualizerScale = useTransform(scrollYProgress, [0.1, 0.4, 0.5, 0.7, 0.8, 1], [1, 1.2, 0.8, 1.2, 0.9, 1.1]);
  const visualizerBorderRadius = useTransform(scrollYProgress, [0.1, 0.4, 0.7, 1], ["20%", "50%", "10%", "50%"]);

  // Colors for the dynamic visualizer shape
  const borderColor1 = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], ["rgba(168,85,247,0.8)", "rgba(168,85,247,0)", "rgba(16,185,129,0)", "rgba(16,185,129,0.8)"]);
  const borderColor2 = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], ["rgba(168,85,247,0)", "rgba(245,158,11,0.8)", "rgba(245,158,11,0)", "rgba(16,185,129,0)"]);
  const borderColor3 = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], ["rgba(168,85,247,0)", "rgba(245,158,11,0)", "rgba(16,185,129,0.8)", "rgba(16,185,129,0)"]);


  return (
    // Total height is 400vh to give the user plenty of time to scroll through the 3 steps
    <section ref={containerRef} className="relative bg-black min-h-[400vh] selection:bg-persimmon/30 selection:text-persimmon">
      
      {/* ================= MASSIVE INTRO TEXT ================= */}
      <motion.div 
        style={{ opacity: headerOpacity, y: headerY }}
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden pointer-events-none z-10"
      >
        <div className="w-full border-t border-b border-white/10 py-6 mb-2 bg-black">
          <h2 className="text-[12vw] font-black tracking-tighter text-white uppercase text-center leading-none">
            PROTOCOL
          </h2>
        </div>
        <div className="w-full border-b border-white/10 py-6 bg-black">
          <h2 className="text-[12vw] font-black tracking-tighter text-white uppercase text-center leading-none">
            ARCHITECTURE
          </h2>
        </div>
      </motion.div>

      {/* ================= THE STICKY SCROLL SECTION ================= */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col lg:flex-row">
        
        {/* LEFT SIDE: Sticky Visualizer (Pins to the screen) */}
        <div className="lg:w-1/2 h-screen sticky top-0 flex items-center justify-center border-r border-white/5 bg-black overflow-hidden z-20 hidden lg:flex">
          
          {/* Subtle grid background for the visualizer */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

          {/* The Dynamic Geometric Core (Replaces the 3D model for now) */}
          <div className="relative w-96 h-96 perspective-1000 flex items-center justify-center">
            
            {/* Outer Ring */}
            <motion.div 
              style={{ 
                rotateX: visualizerRotateX, 
                rotateY: visualizerRotateY, 
                scale: visualizerScale,
                borderRadius: visualizerBorderRadius,
                borderColor: borderColor1
              }}
              className="absolute inset-0 border-[4px] border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.2)] transition-colors duration-500"
            />

            {/* Middle Ring */}
            <motion.div 
              style={{ 
                rotateX: visualizerRotateY, 
                rotateY: visualizerRotateX, 
                scale: useTransform(scrollYProgress, [0, 1], [0.8, 1.2]),
                borderRadius: visualizerBorderRadius,
                borderColor: borderColor2
              }}
              className="absolute inset-8 border-[2px] border-amber-500 border-dashed transition-colors duration-500"
            />

            {/* Inner Core */}
            <motion.div 
              style={{ 
                rotateZ: visualizerRotateY,
                scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5]),
                backgroundColor: borderColor3
              }}
              className="absolute inset-20 bg-emerald-500/20 backdrop-blur-md transition-colors duration-500"
            />
          </div>

          <div className="absolute bottom-10 left-10 text-[10px] font-mono text-white/30 uppercase tracking-widest">
            Solux Core Engine — Live Status
          </div>
        </div>

        {/* RIGHT SIDE: The Scrolling Text Blocks */}
        <div className="w-full lg:w-1/2 flex flex-col pt-[100vh]">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="h-screen flex flex-col justify-center px-8 lg:px-24 relative z-30"
            >
              {/* Feature Icon/Badge */}
              <div className="mb-6">
                <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md ${step.glow}`}>
                  <step.icon size={16} className={step.color} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${step.color}`}>
                    Phase 0{step.id}
                  </span>
                </div>
              </div>

              {/* Title (Monospace exact match to Winterfell style) */}
              <h3 className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-white mb-4">
                {step.title}
              </h3>

              {/* Subtitle */}
              <h4 className={`text-sm sm:text-base font-bold uppercase tracking-widest mb-6 ${step.color}`}>
                {step.subtitle}
              </h4>

              {/* Description */}
              <p className="text-lg sm:text-xl text-white/40 leading-relaxed font-medium max-w-lg">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}