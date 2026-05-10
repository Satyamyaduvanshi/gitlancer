"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalSquare, Wallet, ShieldCheck, ExternalLink, Activity } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

// Map your features to the screenshots you uploaded
const features = [
  {
    id: "dashboard",
    title: "Treasury Analytics",
    description: "Real-time oversight of distributed USDC, active vaults, and payout calendars.",
    icon: Wallet,
    image: "/Screenshot_20260510_234321.png", 
  },
  {
    id: "guardian",
    title: "Deploy AI Guardian",
    description: "Anchor your GitHub repository to the Solana blockchain with a unique PDA.",
    icon: ShieldCheck,
    image: "/Screenshot_20260510_234405.png",
  },
  {
    id: "bot",
    title: "Blinky Bot App",
    description: "Native GitHub integration that automatically reads PRs and audits code.",
    icon: FaGithub,
    image: "/Screenshot_20260510_234459.png",
  }
];

export function DashboardPreview() {
  const [activeFeature, setActiveFeature] = useState(features[0].id);

  // Find the currently active feature object for the image display
  const currentFeature = features.find((f) => f.id === activeFeature) || features[0];

  return (
    <section id="features" className="py-24 md:py-32 px-6 bg-[#fafafa] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="font-serif italic text-gray-400 text-xl tracking-wide">Features</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] mt-4 tracking-tight">
            The Simplest Integration
          </h2>
          <p className="text-lg md:text-xl text-gray-500 mt-6 max-w-2xl mx-auto font-light">
            Solux handles the heavy lifting of blockchain settlements, so you can focus entirely on building your open-source product.
          </p>
        </motion.div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative z-10">
          
          {/* LEFT COLUMN: Clickable Feature List & Devnet Card */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Feature Selectors */}
            <div className="flex flex-col gap-4">
              {features.map((feature) => {
                const isActive = activeFeature === feature.id;
                return (
                  <button
                    key={feature.id}
                    onClick={() => setActiveFeature(feature.id)}
                    className={`relative text-left w-full p-6 md:p-8 rounded-[1.5rem] transition-all cursor-pointer duration-300 group overflow-hidden ${
                      isActive 
                        ? "bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-gray-200/60 transform scale-[1.02]" 
                        : "bg-transparent border border-transparent hover:bg-gray-100/50"
                    }`}
                  >
                    {/* Active Orange Indicator Line */}
                    {isActive && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500 rounded-l-[1.5rem]" 
                      />
                    )}

                    <div className="flex items-start gap-4">
                      <div className={`mt-1 p-2.5 rounded-xl transition-colors duration-300 ${isActive ? "bg-orange-50 text-orange-500" : "bg-gray-100 text-gray-400 group-hover:text-gray-600"}`}>
                        <feature.icon size={22} />
                      </div>
                      <div>
                        <h4 className={`text-lg font-bold transition-colors duration-300 ${isActive ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"}`}>
                          {feature.title}
                        </h4>
                        <p className={`text-sm mt-1.5 leading-relaxed transition-colors duration-300 ${isActive ? "text-gray-500" : "text-gray-400"}`}>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* SLEEK, COMPACT DEVNET CARD (Static, placed under the list) */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[1.25rem] p-5 border border-persimmon/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden mt-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-emerald-500/10 blur-[24px] pointer-events-none rounded-full" />
              
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Protocol Status</span>
              </div>
              
              <h4 className="text-gray-900 font-bold text-base mb-1 tracking-tight">Live on Devnet</h4>
              <p className="text-gray-500 text-xs mb-5 leading-relaxed pr-4">
                Smart contracts are actively deployed and verifiable on the Solana blockchain.
              </p>

              <Link 
                href="https://explorer.solana.com/address/JBnTbnqcvXTmw7nZ6TuLbGcY7U5b8Du7YPpK5G8nByyi?cluster=devnet"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full bg-[#1a1a1a] hover:bg-black text-white px-4 py-3 rounded-xl text-xs font-bold transition-all shadow-md group"
              >
                <span className="flex items-center gap-2">
                  <Activity size={14} className="text-emerald-400" />
                  View on Explorer
                </span>
                <ExternalLink size={14} className="text-white/50 group-hover:text-white transition-colors" />
              </Link>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Image Display */}
          <div className="lg:col-span-8 relative">
            
            {/* The Dashboard Frame */}
            <div className="relative w-full bg-white p-3 rounded-[2rem] md:rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.07)] border border-gray-100 ring-1 ring-black/5 aspect-[16/10] overflow-hidden group z-10">
              
              {/* Mac-style Window Controls */}
              <div className="absolute top-6 left-6 flex gap-2 z-20">
                <div className="w-3 h-3 rounded-full  bg-red-400 transition-colors" />
                <div className="w-3 h-3 rounded-full  bg-amber-400 transition-colors" />
                <div className="w-3 h-3 rounded-full  bg-emerald-400 transition-colors" />
              </div>

              {/* Image Crossfade Animation Container */}
              <div className="absolute inset-x-3 top-14 bottom-3 bg-[#161616] rounded-[1.25rem] md:rounded-[2rem] overflow-hidden shadow-inner">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFeature.id}
                    initial={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={currentFeature.image} 
                      alt={currentFeature.title}
                      fill
                      quality={100}
                      className="object-cover object-left-top"
                      draggable={false}
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Premium Decorative Ambient Glow Behind Dashboard */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gradient-to-tr from-orange-500/10 to-transparent blur-[120px] -z-10 rounded-full pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}