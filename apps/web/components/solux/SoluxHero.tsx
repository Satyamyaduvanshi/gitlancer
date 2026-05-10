"use client";

import { motion } from "framer-motion";
import { CheckCircle2, GitMerge, ArrowRight, Bot, Sparkles } from "lucide-react";
import { FaGithub, FaDiscord } from "react-icons/fa6";
import { SiSolana } from "react-icons/si";
import Link from "next/link";
import Image from "next/image";

// Array for the infinite slider
const techStack = [
  { name: "Solana", icon: SiSolana, color: "text-[#14F195]" },
  { name: "GitHub", icon: FaGithub, color: "text-[#181717]" },
  { name: "Discord", icon: FaDiscord, color: "text-[#5865F2]" },
  { name: "Llama AI", icon: Sparkles, color: "text-purple-500" },
];

// Duplicate to create a seamless infinite loop
const marqueeItems = [...techStack, ...techStack, ...techStack, ...techStack, ...techStack];

export default function SoluxHero() {
  return (
    <section className="relative w-full pt-20 pb-0 px-6 min-h-screen flex flex-col items-center justify-between overflow-hidden">
      
      {/* 1. Subtle Box/Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center">
        <div className="w-full h-[800px] bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-80" />
      </div>

      {/* Main Top Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center mt-8">
        
        {/* Tiny Script/Italic Kicker */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <span className="font-serif italic text-gray-500 text-lg bg-white px-4 py-1 rounded-full border border-gray-100 shadow-sm">
            Mainnet Beta Soon!
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#1a1a1a] max-w-4xl leading-[1.05] mb-4"
        >
          Merge Code. <br/>
          Mint <span className="text from-text-[#1a1a1a] via-[#3a2a23] to-orange-600">Crypto.</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-500 max-w-2xl mb-8"
        >
          Stop making contributors wait weeks for bounties. Automate your open-source treasury with instant USDC settlements—verified by Blinky AI.
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
        >
          <Link 
            href="/dashboard" 
            className="group flex items-center justify-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-black hover:scale-105 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.1)] w-full sm:w-auto"
          >
            Initialize Dashboard
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="https://github.com/apps/blinky-solux" 
            className="flex items-center justify-center gap-2 bg-white text-[#1a1a1a] border border-orange-500/80 px-9 py-3 rounded-full font-bold text-sm hover:bg-gray-50 hover:scale-105 transition-all shadow-sm w-full sm:w-auto"
          >
            <Image src="/logo-orange.svg" alt="Solux Logo" width={18} height={18} className="object-contain" />
            Add GitHub Bot
          </Link>
        </motion.div>
      </div>

      {/* Hero Illustration & Mockup (FITS IN SCREEN) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="relative w-full max-w-[1200px] mx-auto h-[350px] md:h-[450px] mt-6 flex-grow flex justify-center"
      >
        {/* Cartoon Illustration - Faded at bottom ONLY */}
        <div className="absolute inset-0 w-full h-full flex justify-center [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)] overflow-hidden pointer-events-none">
          <img 
            src="https://cdn.prod.website-files.com/684d582f1c52bdf38cbb5c8d/68e8f533b2d110c6d06c6afd_Group%201261154922%20(2)-p-1600.png" 
            alt="Solux Flow Illustration" 
            className="w-full h-full object-cover object-top sm:object-contain scale-[1.5] md:scale-[1.1] origin-top opacity-100 drop-shadow-sm "
          />
        </div>

        {/* Stacked PR Mockup Cards (Increased Size & Centered outside the mask) */}
        <div className="absolute top-[45%] md:top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[420px] z-20">
          
          {/* Background Card 2 (Bottom-most, rotated left) */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm border border-gray-100 rounded-3xl transform -rotate-3 scale-[0.92] translate-y-4 shadow-sm z-0 transition-transform hover:-rotate-6" />
          
          {/* Background Card 1 (Middle, rotated right) */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl transform rotate-2 scale-[0.96] translate-y-2 shadow-md z-10 transition-transform hover:rotate-4" />
          
          {/* Main Foreground Card (Larger) */}
          <div className="relative bg-white p-6 md:p-8 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-gray-100 z-20">
            
            <div className="flex items-center gap-4 mb-5 border-b border-gray-50 pb-5">
              <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                <Image src="/logo-orange.svg" alt="Solux Logo" width={24} height={24} className="object-contain" />
              </div>
              <div className="text-left">
                <p className="text-base md:text-lg font-bold text-gray-900 leading-tight">PR #104 Merged</p>
                <p className="text-[12px] md:text-[13px] font-medium text-gray-500 mt-0.5">Blinky Audit: Passed</p>
              </div>
            </div>
            
            <div className="text-left mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Treasury Allocated</span>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 size={12} className="stroke-[3px]" /> Verified
                </span>
              </div>
              <p className="text-4xl md:text-5xl font-black text-[#1a1a1a] tracking-tight">
                1,500 <span className="text-xl md:text-2xl text-gray-400 font-bold tracking-normal">USDC</span>
              </p>
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3.5 md:py-4 rounded-xl text-sm md:text-base font-bold shadow-[0_8px_16px_rgba(252,76,2,0.2)] hover:bg-orange-600 transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm">
              Claim to Wallet
            </button>
          </div>

        </div>
      </motion.div>

      {/* Slick Infinite Company Slider (Pushed to bottom) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="w-full mt-auto  backdrop-blur-sm py-6 overflow-hidden relative z-10 h-[100px]"
      >
        {/* Mask to fade edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#fafafa] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#fafafa] to-transparent z-10" />

        <div className="flex whitespace-nowrap overflow-hidden w-full">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
            className="flex items-center gap-16 md:gap-24 px-8"
          >
            {marqueeItems.map((tech, i) => (
              <div key={i} className="flex items-center justify-center gap-3 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 cursor-default">
                <tech.icon size={24} className={tech.color} />
                <span className="text-lg font-bold tracking-tight text-gray-800">
                  {tech.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

    </section>
  );
}