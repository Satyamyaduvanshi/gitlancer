"use client";

import { motion } from "framer-motion";
import { GitMerge, ArrowRight, Bot, ExternalLink, CheckCircle2 } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import Link from "next/link";

export default function SoluxBotIntegration() {
  return (
    <section id="integration" className="scroll-mt-20 relative bg-black py-24 sm:py-32 overflow-hidden border-t border-white/5 selection:bg-persimmon/30 selection:text-persimmon">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-persimmon/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* LEFT SIDE: Text & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start pr-0 lg:pr-8"
          >
            {/* Badge */}
            <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] backdrop-blur-xl mb-6">
              <Bot size={12} className="text-persimmon" />
              Native GitHub App
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-white mb-6 leading-[1.05]">
              Merge the PR. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-persimmon to-orange-500">Claim the bounty.</span>
            </h2>
            
            <p className="text-base sm:text-lg text-white/50 leading-relaxed font-medium mb-8">
              No SDKs or complex webhook configurations. Just install the Solux GitHub App. When a Pull Request is merged, our bot instantly calculates the bounty and drops a claim link directly in the comments.
            </p>

            <div className="flex flex-col gap-4 mb-10">
              <div className="flex items-center gap-3 text-sm font-medium text-white/70">
                <CheckCircle2 size={18} className="text-emerald-500" /> Zero codebase pollution
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-white/70">
                <CheckCircle2 size={18} className="text-emerald-500" /> 1-Click contributor payouts
              </div>
            </div>

            <Link
              href="/login"
              className="group flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              <FaGithub size={18} />
              Install GitHub App
              <ArrowRight size={16} className="text-black/50 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>


          {/* RIGHT SIDE: Hyper-Realistic GitHub PR Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full relative flex justify-center lg:justify-end"
          >
            {/* Inner Glow to make the dark card pop */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

            {/* The GitHub UI Mockup */}
            <div className="w-full max-w-[480px] bg-[#0d1117] border border-[#30363d] rounded-2xl p-5 shadow-[0_30px_100px_rgba(0,0,0,0.8)] font-sans relative z-10 text-left">
              
              {/* PR Header */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#c9d1d9] mb-3">
                  Implement Anchor Auth <span className="text-[#8b949e] font-normal">#104</span>
                </h3>
                <div className="flex items-center gap-2 text-[13px]">
                  <div className="flex items-center gap-1.5 bg-[#8250df] text-white px-3 py-1 rounded-full font-medium">
                    <GitMerge size={14} /> Merged
                  </div>
                  <span className="text-[#8b949e]">
                    <span className="font-semibold text-[#c9d1d9]">Satyamyaduvanshi</span> merged 3 commits into <code className="bg-[#161b22] px-1.5 py-0.5 rounded text-[#c9d1d9]">main</code>
                  </span>
                </div>
              </div>

              {/* Vertical Timeline Line */}
              <div className="absolute left-[39px] top-[95px] bottom-10 w-[2px] bg-[#21262d]" />

              {/* Solux Bot Comment Block */}
              <div className="mt-6 flex gap-3 relative z-10">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center flex-shrink-0 relative z-10">
                  <Bot size={20} className="text-persimmon" />
                </div>
                
                {/* Comment Box */}
                <div className="flex-1 border border-[#30363d] rounded-lg bg-[#0d1117] overflow-hidden">
                  
                  {/* Comment Header */}
                  <div className="bg-[#161b22] border-b border-[#30363d] px-4 py-2.5 flex items-center gap-2">
                    <span className="text-[#c9d1d9] font-semibold text-sm">solux-bot</span>
                    <span className="border border-[#30363d] text-[#8b949e] px-1.5 py-0.5 rounded-full text-[10px] font-medium uppercase">Bot</span>
                    <span className="text-[#8b949e] text-xs">commented just now</span>
                  </div>
                  
                  {/* Comment Body */}
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-5">
                      <div className="mt-0.5 bg-emerald-500/20 p-1 rounded-full text-emerald-400">
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <p className="text-[#c9d1d9] text-sm font-semibold mb-1">PR Audited & Bounty Settled!</p>
                        <p className="text-[#8b949e] text-[13px] leading-relaxed">
                          This code passed the Blinky AI security check. The protocol treasury has allocated <strong className="text-[#c9d1d9] font-mono bg-[#161b22] px-1 rounded">1,500 USDC</strong> for this contribution.
                        </p>
                      </div>
                    </div>

                    {/* The Magic "Claim" Button */}
                    <div className="pl-9">
                      <button className="flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] transition-colors text-white px-5 py-2.5 rounded-md font-semibold text-sm shadow-sm group">
                        Claim 1,500 USDC
                        <ExternalLink size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
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