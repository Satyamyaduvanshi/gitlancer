"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Network, Bot } from "lucide-react"; 

export default function SoluxMaintainersStrip() {
  return (
    <section id="social-proof" className="bg-black py-24 sm:py-32 relative overflow-hidden border-t border-white/5 selection:bg-persimmon/30 selection:text-persimmon">
      
      {/* Subtle Top Glow (Connects visually from the section above) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-persimmon/50 to-transparent opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] bg-persimmon/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 flex flex-col items-center">
        
        {/* Aggressive, Minimalist Header */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[11px] font-mono text-white/40 uppercase tracking-[0.3em] mb-12 text-center"
        >
          Engineered with elite infrastructure
        </motion.p>

        {/* Naked, Floating Logo Strip */}
        <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-20 lg:gap-24 w-full">
          
          {/* Solana */}
          <motion.div
            initial={{ opacity: 0, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="group flex items-center justify-center cursor-pointer"
          >
            <Image 
              src="/logos/solana.svg" 
              alt="Solana" 
              width={140} 
              height={32} 
              className="h-6 sm:h-7 w-auto opacity-40 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 group-hover:drop-shadow-[0_0_15px_rgba(20,241,149,0.4)]" 
            />
          </motion.div>
        
          {/* GitHub */}
          <motion.div
            initial={{ opacity: 0, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="group flex items-center justify-center cursor-pointer"
          >
            <Image 
              src="/logos/github.svg" 
              alt="GitHub" 
              width={120} 
              height={32} 
              className="h-6 sm:h-7 w-auto invert opacity-40 transition-all duration-500 group-hover:opacity-100 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
            />
          </motion.div>

          {/* Anchor Framework */}
          <motion.div
            initial={{ opacity: 0, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="group flex items-center justify-center gap-3 cursor-pointer opacity-40 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
          >
            <Network size={28} className="text-white group-hover:text-blue-400 transition-colors duration-500 group-hover:drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-white transition-colors duration-500">Anchor</span>
          </motion.div>

          {/* OpenAI / LLM Engine */}
          <motion.div
            initial={{ opacity: 0, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="group flex items-center justify-center gap-3 cursor-pointer opacity-40 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
          >
            <Bot size={28} className="text-white group-hover:text-emerald-400 transition-colors duration-500 group-hover:drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-white transition-colors duration-500">OpenAI</span>
          </motion.div>

        </div>
      </div>
    </section>
  );
}