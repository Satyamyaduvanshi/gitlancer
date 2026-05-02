"use client";

import { motion } from "framer-motion";
import { GitMerge, ArrowRight, Bot, ExternalLink, CheckCircle2 } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import Link from "next/link";

export default function SoluxBotIntegration() {
  return (
    <section id="integration" className="relative bg-black py-24 sm:py-32 overflow-hidden selection:bg-persimmon/30 selection:text-persimmon">
      
      {/* ⚡ Ambient Protocol Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-persimmon/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          
          {/* ================= LEFT SIDE: Text & CTA ================= */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start pr-0 lg:pr-8"
          >
            <div className="flex items-center gap-2 rounded-full bg-[#111] border border-white/10 px-3 py-1.5 text-[10px] font-bold text-white/70 uppercase tracking-[0.2em] mb-6">
              <Bot size={14} className="text-persimmon" />
              Native GitHub App
            </div>

            <h2 className="text-5xl sm:text-6xl font-bold tracking-tighter text-white mb-6 leading-[1.05]">
              Merge the PR. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-persimmon to-orange-500">Claim the bounty.</span>
            </h2>
            
            <p className="text-lg text-white/50 leading-relaxed font-medium mb-10 max-w-md">
              No complex SDKs. Just install the Solux App. When a Pull Request is merged, our bot calculates the payout and drops a secure claim link directly in the comments.
            </p>

            <Link
              href="https://github.com/apps/blinky-solux"
              className="group flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all hover:bg-neutral-200"
            >
              <FaGithub size={18} />
              Install GitHub App
              <ArrowRight size={16} className="text-black/50 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* ================= RIGHT SIDE: Flat & Clean PR Mockup ================= */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full relative flex justify-center lg:justify-end"
          >
            {/* The Floating UI Container */}
            <div className="w-full max-w-[480px] bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] font-sans relative z-10 text-left">
              
              {/* PR Header */}
              <div className="mb-6 relative z-10">
                <h3 className="text-[17px] font-semibold text-[#c9d1d9] mb-3">
                  Implement Anchor Auth <span className="text-[#8b949e] font-normal">#104</span>
                </h3>
                <div className="flex items-center gap-2 text-[13px]">
                  <div className="flex items-center gap-1.5 bg-[#8250df] text-white px-3 py-1 rounded-full font-medium">
                    <GitMerge size={14} /> Merged
                  </div>
                  <span className="text-[#8b949e]">
                    <span className="font-semibold text-[#c9d1d9]">Satyamyaduvanshi</span> merged commits into <code className="bg-[#161b22] px-1.5 py-0.5 rounded text-[#c9d1d9]">main</code>
                  </span>
                </div>
              </div>

              {/* Vertical Timeline Line */}
              <div className="absolute left-[44px] top-[100px] bottom-10 w-[2px] bg-[#21262d] z-0" />

              {/* Solux Bot Comment Block */}
              <div className="mt-6 flex gap-4 relative z-10">
                
                {/* Bot Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center flex-shrink-0 relative z-10">
                  <Bot size={20} className="text-persimmon" />
                </div>
                
                {/* Comment Box */}
                <div className="flex-1 border border-[#30363d] rounded-xl bg-[#0d1117] overflow-hidden">
                  
                  {/* Comment Header */}
                  <div className="bg-[#161b22] border-b border-[#30363d] px-4 py-2.5 flex items-center gap-2">
                    <span className="text-[#c9d1d9] font-semibold text-sm">solux-bot</span>
                    <span className="border border-[#30363d] text-[#8b949e] px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Bot</span>
                  </div>
                  
                  {/* Comment Body */}
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-6">
                      <div className="mt-0.5 text-emerald-400">
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <p className="text-[#c9d1d9] text-sm font-semibold mb-1">Bounty Settled & Ready</p>
                        <p className="text-[#8b949e] text-[13px] leading-relaxed">
                          Blinky AI security check passed. The protocol treasury has allocated <strong className="text-emerald-400 font-mono bg-[#161b22] px-1.5 py-0.5 rounded">1,500 USDC</strong> for this code.
                        </p>
                      </div>
                    </div>

                    {/* The Claim Button */}
                    <div className="pl-7">
                      <button className="flex items-center justify-center gap-2 w-full bg-[#238636] hover:bg-[#2ea043] transition-colors text-white px-5 py-2.5 rounded-lg font-semibold text-sm">
                        Claim 1,500 USDC
                        <ExternalLink size={14} className="opacity-70" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}