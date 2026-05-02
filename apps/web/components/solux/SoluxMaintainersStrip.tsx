"use client";

import { motion } from "framer-motion";
import { Network, Sparkles } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { SiSolana } from "react-icons/si"; // We use Simple Icons for the Solana logo

// 1. Define the core stack using purely React Icons (No local images needed!)
const coreStack = [
  { name: "Solana", icon: SiSolana, color: "group-hover:text-[#14F195]" }, // Official Solana Green
  { name: "GitHub", icon: FaGithub, color: "group-hover:text-white" },
  { name: "Anchor", icon: Network, color: "group-hover:text-blue-400" },
  { name: "Gemini", icon: Sparkles, color: "group-hover:text-purple-400" },
];

// 2. Multiply it 4 times for the perfect infinite loop
const techStack = [...coreStack, ...coreStack, ...coreStack, ...coreStack];

export default function SoluxMaintainersStrip() {
  return (
    <section className="bg-black py-20 relative overflow-hidden selection:bg-persimmon/30 selection:text-persimmon">
      
      {/* Subtle Top Divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto w-full relative z-10 flex flex-col items-center">
        
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] mb-12 text-center px-4">
          Engineered with elite infrastructure
        </p>

        {/* 🚀 Seamless Infinite Marquee */}
        <div 
          className="w-full flex overflow-hidden"
          style={{ 
            maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)", 
            WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" 
          }}
        >
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 40, repeat: Infinity }}
            className="flex items-center gap-16 sm:gap-24 lg:gap-32 w-max px-8"
          >
            {techStack.map((tech, i) => (
              <div 
                key={i} 
                className="group flex items-center justify-center gap-3 opacity-50 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 cursor-pointer"
              >
                <tech.icon size={26} className={`text-white transition-colors duration-500 ${tech.color}`} />
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-white transition-colors duration-500">
                  {tech.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}