"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { ArrowRight } from "lucide-react";

export default function SoluxFooter() {
  // Animation for the massive bottom letters
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const letterVars = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: { 
      opacity: 1, y: 0, scale: 1, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    },
  };

  // The "Flower Bloom" animation for the logo
  const flowerLogoVars = {
    hidden: { scale: 0, rotate: -90, opacity: 0 },
    visible: { 
      scale: 1, 
      rotate: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 80, damping: 12, delay: 0.6 } 
    },
  };

  return (
    <footer className="w-full bg-black pt-24 pb-8 selection:bg-persimmon/30 selection:text-persimmon border-t border-white/5">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        
        {/* Top Section: Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 pb-24 border-b border-white/10">
          
          {/* Left Column: Headline & Mission (Spans 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-8 pr-0 lg:pr-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold tracking-tighter text-white leading-[1.1]"
            >
              Engineered for contributors. <br className="hidden md:block" />
              Governed by <span className="text-persimmon">code.</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-base max-w-md leading-relaxed font-medium"
            >
              The autonomous bridge between GitHub and Solana. Merge a pull request and get paid directly to your wallet in seconds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-white uppercase tracking-widest transition-all group"
              >
                Initialize Treasury 
                <ArrowRight size={16} className="text-persimmon group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right Column: 3-Column Link Grid with Vertical Borders (Spans 7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-0 mt-4 lg:mt-0">
            
            {/* Column 1: Ecosystem */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-6 sm:border-l sm:border-white/10 sm:pl-8 lg:pl-12"
            >
              <h4 className="text-lg font-bold text-white tracking-tight">Ecosystem</h4>
              <div className="flex flex-col gap-4 text-[13px] text-white/50 font-medium">
                <Link href="#blinky" className="hover:text-white transition-colors">Blinky Audit AI</Link>
                <Link href="#vaults" className="hover:text-white transition-colors">Vault Orchestrator</Link>
                <Link href="#guardian" className="hover:text-white transition-colors">Identity Guardian</Link>
                <Link href="#settlement" className="hover:text-white transition-colors">USDC Settlement</Link>
              </div>
            </motion.div>

            {/* Column 2: Resources */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-6 sm:border-l sm:border-white/10 sm:pl-8 lg:pl-12"
            >
              <h4 className="text-lg font-bold text-white tracking-tight">Resources</h4>
              <div className="flex flex-col gap-4 text-[13px] text-white/50 font-medium">
                <Link href="/docs" className="hover:text-white transition-colors">Developer Docs</Link>
                <Link href="/docs/anchor" className="hover:text-white transition-colors">Smart Contract Guide</Link>
                <Link href="/docs/api" className="hover:text-white transition-colors">API Reference</Link>
                <Link href="/help" className="hover:text-white transition-colors">Help Center</Link>
              </div>
            </motion.div>

            {/* Column 3: Connect */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-col gap-6 sm:border-l sm:border-white/10 sm:pl-8 lg:pl-12"
            >
              <h4 className="text-lg font-bold text-white tracking-tight">Connect</h4>
              <div className="flex flex-col gap-4 text-[13px] text-white/50 font-medium">
                <Link href="https://x.com/SOLUXdev" target="_blank" className="flex items-center gap-2 hover:text-white transition-colors">
                  <FaXTwitter size={14} /> Twitter
                </Link>
                <Link href="https://github.com/Satyamyaduvanshi" target="_blank" className="flex items-center gap-2 hover:text-white transition-colors">
                  <FaGithub size={14} /> GitHub
                </Link>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Bottom Section: Massive Text & Blooming Logo */}
        <div className="pt-16 pb-8 flex flex-col items-center justify-center">
          <motion.div 
            variants={containerVars}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex items-center justify-center gap-4 sm:gap-8 w-full overflow-hidden"
          >
            {/* Massive Letters */}
            {["S", "O", "L", "U", "X"].map((letter, i) => (
              <motion.span 
                key={i} 
                variants={letterVars}
                className="text-[15vw] md:text-[12vw] font-black tracking-tighter text-white leading-none font-mono"
              >
                {letter}
              </motion.span>
            ))}

            {/* Blooming Flower Logo */}
            <motion.div variants={flowerLogoVars} className="relative w-[12vw] h-[12vw] md:w-[8vw] md:h-[8vw] flex-shrink-0 mt-4 md:mt-8">
              <Image 
                src="/logo-orange.svg" 
                alt="SOLUX Logo" 
                fill 
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Copyright Centered at Bottom */}
        <div className="mt-8 flex justify-center text-center">
          <p className="text-[11px] text-white/30 font-mono tracking-widest uppercase">
            © {new Date().getFullYear()} Solux. Powered by Solana.
          </p>
        </div>

      </div>
    </footer>
  );
}