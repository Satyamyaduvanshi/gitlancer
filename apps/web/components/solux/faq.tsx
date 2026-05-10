"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa6"; // Using react-icons to fix the build error
import Link from "next/link";

const faq = [
  {
    q: "What is SOLUX?",
    a: "SOLUX is an autonomous bounty protocol that bridges GitHub and Solana. It automates payouts via Solana Blinks directly in the GitHub UI.",
  },
  {
    q: "How do I claim a bounty?",
    a: "Once your PR is merged, our bot (Blinky) posts a 'Blink' in the comments. You can claim your USDC reward with a single click using any Solana-compatible wallet.",
  },
  {
    q: "What is the Guardian Protocol?",
    a: "The Guardian is our identity layer. It cryptographically links your GitHub handle to your Solana wallet to ensure payouts are secure.",
  },
  {
    q: "Do I need to leave GitHub to get paid?",
    a: "After a one-time setup on the SOLUX dashboard, the entire workflow—from code merge to payout—happens entirely within GitHub.",
  }
];

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-24 px-6 bg-[#fafafa] overflow-hidden">
      
      {/* 1. FLOATING GITHUB CARD (Bottom Left) */}
      <div className="absolute bottom-10 left-10 hidden lg:block z-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="bg-white p-5 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-gray-100 w-[240px]"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Feedback</span>
          </div>
          
          <h4 className="text-gray-900 font-bold text-sm mb-1 tracking-tight">Find an error?</h4>
          <p className="text-gray-500 text-[11px] mb-4 leading-relaxed">
            Help us improve the protocol by reporting bugs directly.
          </p>

          <Link 
            href="https://github.com/satyamyaduvanshi/gitlancer"
            target="_blank"
            className="flex items-center justify-between w-full bg-[#1a1a1a] hover:bg-black text-white px-3 py-2 rounded-xl text-[11px] font-bold transition-all"
          >
            <span className="flex items-center gap-2">
              <FaGithub size={14} />
              Open Issue
            </span>
            <ExternalLink size={14} className="text-white/40" />
          </Link>
        </motion.div>
      </div>

      {/* 2. FAQ CONTENT */}
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="font-serif italic text-gray-400 text-xl">Got Questions?</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mt-2">
            Here's the Deal.
          </h2>
        </div>

        <div className="space-y-4">
          {faq.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <div 
                key={index}
                className={`rounded-[1.5rem] border transition-all duration-300 overflow-hidden ${
                  isActive 
                    ? "bg-white border-orange-200 shadow-[0_10px_30px_rgba(252,76,2,0.05)]" 
                    : "bg-transparent border-gray-200 hover:border-gray-300 hover:bg-white/50"
                }`}
              >
                <button
                  className="flex w-full items-center justify-between p-6 md:p-8 text-left focus:outline-none group"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className={`font-bold text-lg md:text-xl transition-colors ${isActive ? "text-orange-600" : "text-[#1a1a1a] group-hover:text-orange-500"}`}>
                    {item.q}
                  </span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${isActive ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600"}`}>
                    {isActive ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="px-6 md:px-8 pb-6 md:pb-8"
                    >
                      <p className="text-gray-500 leading-relaxed text-base md:text-lg border-t border-gray-100 pt-6">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}