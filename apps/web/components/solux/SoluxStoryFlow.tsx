"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GitPullRequest, ShieldCheck, Zap } from "lucide-react";

// Updated colors to heavily feature Persimmon and match the brand
const steps = [
  {
    id: 1,
    title: "Blinky Audit AI",
    subtitle: "Instant static analysis",
    description: "The moment a PR is merged, Blinky intercepts the webhook. It performs deep static analysis, checks for vulnerabilities, and verifies the contribution against bounty criteria in milliseconds.",
    icon: GitPullRequest,
    color: "text-persimmon", // Brand Primary
  },
  {
    id: 2,
    title: "Identity Guardian",
    subtitle: "Cryptographic binding",
    description: "Zero spoofing. The Guardian protocol cryptographically binds the contributor's GitHub handle to their verified Solana wallet, ensuring funds only flow to the legitimate author.",
    icon: ShieldCheck,
    color: "text-amber-400",
  },
  {
    id: 3,
    title: "Vault Settlement",
    subtitle: "Zero-friction payout",
    description: "Upon audit success, the on-chain vault is triggered. USDC is instantly routed to the contributor's wallet with zero intermediary fees. PR merged, crypto minted.",
    icon: Zap,
    color: "text-emerald-400",
  }
];

export default function SoluxStoryFlow() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress of the sticky section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ================= SLEEK 3D GIMBAL ANIMATIONS =================
  
  // Outer Ring
  const rotateX1 = useTransform(scrollYProgress, [0, 1], [45, 135]);
  const rotateY1 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  
  // Middle Ring (Counter-rotating)
  const rotateX2 = useTransform(scrollYProgress, [0, 1], [135, 45]);
  const rotateZ2 = useTransform(scrollYProgress, [0, 1], [0, -360]);

  // Inner Ring
  const rotateY3 = useTransform(scrollYProgress, [0, 1], [45, 360]);
  const rotateZ3 = useTransform(scrollYProgress, [0, 1], [-45, 45]);

  // Dynamic Glow that shifts colors slightly as you scroll through the phases
  const coreGlow = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    [
      "rgba(252,76,2,0.4)",  // Persimmon
      "rgba(251,191,36,0.3)", // Amber
      "rgba(52,211,153,0.3)"  // Emerald
    ]
  );

  return (
    <section id="story" className="bg-black  border-white/5 selection:bg-persimmon/30 selection:text-persimmon">
      
      {/* ================= INTRO HEADER ================= */}
      <div className="relative pt-32 pb-20 px-6 text-center z-10 flex flex-col items-center">
        <div className="flex items-center gap-2 rounded-full bg-persimmon/10 border border-persimmon/20 px-4 py-1.5 text-[10px] font-bold text-persimmon uppercase tracking-[0.2em] mb-6">
          Autonomous Architecture
        </div>
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tighter mb-6">
          The Solux <span className="text-transparent bg-clip-text bg-gradient-to-r from-persimmon to-orange-500">Flow.</span>
        </h2>
        <p className="text-lg text-white/50 max-w-xl mx-auto font-medium">
          Watch how open-source code transforms into secure, on-chain USDC settlement in milliseconds.
        </p>
      </div>

      {/* ================= SCROLLING ARCHITECTURE ================= */}
      {/* Total height is 300vh (100vh per step) */}
      <div ref={containerRef} className="relative w-full h-[300vh]">
        
        {/* ⚡ The Sticky Container - Locks to the screen while you scroll */}
        <div className="sticky top-0 left-0 w-full h-screen flex flex-col lg:flex-row overflow-hidden">
          
          {/* ==== LEFT SIDE: The Persimmon Gimbal ==== */}
          <div className="w-full lg:w-1/2 h-[40vh] lg:h-screen relative flex items-center justify-center bg-transparent lg:border-r border-white/5 overflow-hidden">
            
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
            
            {/* The 3D Object Rig */}
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center perspective-[1000px]">
              
              {/* Ambient Dynamic Background Glow */}
              <motion.div 
                style={{ backgroundColor: coreGlow }}
                className="absolute inset-0 m-auto w-48 h-48 blur-[100px] rounded-full transition-colors duration-300"
              />

              {/* Outer Data Ring */}
              <motion.div 
                style={{ rotateX: rotateX1, rotateY: rotateY1, transformStyle: "preserve-3d" }}
                className="absolute inset-0 border-[2px] border-white/10 rounded-full flex items-center justify-center shadow-[inset_0_0_50px_rgba(255,255,255,0.02)]"
              >
                <div className="absolute top-0 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] -translate-y-1.5" />
              </motion.div>

              {/* Middle Dashed Ring */}
              <motion.div 
                style={{ rotateX: rotateX2, rotateZ: rotateZ2, transformStyle: "preserve-3d" }}
                className="absolute inset-8 border-[2px] border-persimmon/40 border-dashed rounded-full flex items-center justify-center"
              />

              {/* Inner Solid Persimmon Ring */}
              <motion.div 
                style={{ rotateY: rotateY3, rotateZ: rotateZ3, transformStyle: "preserve-3d" }}
                className="absolute inset-16 border-[4px] border-persimmon/80 rounded-full shadow-[0_0_30px_rgba(252,76,2,0.3)] flex items-center justify-center"
              >
                <div className="absolute inset-0 rounded-full bg-persimmon/5 backdrop-blur-sm" />
              </motion.div>

              {/* Dead Center Core */}
              <div className="absolute m-auto w-12 h-12 bg-black border border-persimmon/50 rounded-full shadow-[0_0_40px_rgba(252,76,2,0.6)] flex items-center justify-center z-10">
                <div className="w-3 h-3 bg-persimmon rounded-full animate-ping opacity-80" />
                <div className="absolute w-3 h-3 bg-persimmon rounded-full" />
              </div>

            </div>

            {/* Solux Matrix Label */}
            <div className="absolute bottom-10 left-10 hidden lg:block">
              <h3 className="text-white font-mono font-bold text-xl tracking-tight mb-1">Execution Core</h3>
              <p className="text-persimmon font-mono text-[11px] font-bold uppercase tracking-widest">
                Live Protocol Status
              </p>
            </div>
          </div>

          {/* ==== RIGHT SIDE: The Scrolling Text ==== */}
          <div className="w-full lg:w-1/2 h-[60vh] lg:h-screen relative overflow-hidden bg-black">
            
            {/* Inner Absolute Container that slides UP exactly -200vh */}
            <motion.div 
              style={{ y: useTransform(scrollYProgress, [0, 1], ["0vh", "-200vh"]) }}
              className="absolute top-0 left-0 w-full"
            >
              {steps.map((step) => (
                <div 
                  key={step.id} 
                  className="h-screen flex flex-col justify-center px-8 sm:px-16 lg:px-24"
                >
                  {/* Phase Badge */}
                  <div className="mb-6 flex items-start">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-md bg-white/[0.03] border border-white/10 backdrop-blur-md">
                      <step.icon size={16} className={step.color} />
                      <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${step.color}`}>
                        Phase 0{step.id}
                      </span>
                    </div>
                  </div>

                  {/* Typography perfectly matched to the pixel/monospace vibe */}
                  <h3 className="text-4xl sm:text-5xl lg:text-6xl font-mono tracking-tight text-white mb-6">
                    {step.title}
                  </h3>

                  <h4 className={`text-sm sm:text-base font-bold uppercase tracking-widest mb-6 ${step.color}`}>
                    {step.subtitle}
                  </h4>

                  <p className="text-lg sm:text-xl text-[#a1a1aa] leading-relaxed font-medium max-w-lg">
                    {step.description}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}