"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Spline from "@splinetool/react-spline";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ShieldCheck, Bot, WalletCards, Zap, ArrowRight, Wallet, CheckCircle2 } from "lucide-react";
import { FaGithub } from "react-icons/fa6";

export default function SoluxStorytelling() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch for theme-dependent rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="story" className="relative bg-[#fafafa] dark:bg-black py-32 overflow-hidden selection:bg-persimmon selection:text-white transition-colors duration-300">
      
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />


      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(252,76,2,0.05),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(252,76,2,0.08),transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-32">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="h-px w-8 bg-persimmon"></div>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-persimmon font-bold">
              The Protocol Story
            </span>
            <div className="h-px w-8 bg-persimmon"></div>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-nocturn text-4xl sm:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6 leading-[1.05]"
          >
            From pull request to payout in <span className="text-persimmon italic">seconds.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed"
          >
            Watch how SOLUX replaces human auditors and manual accounting with an autonomous, on-chain engine.
          </motion.p>
        </div>

        {/* Chapter 1: The Audit (Using your GitHub Screenshot) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="order-2 lg:order-1 relative rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl shadow-black/5 dark:shadow-persimmon/5"
          >
            {/* Replace with your actual image path */}
            <Image 
              src="/blinky-pr.png" 
              alt="Blinky GitHub Audit" 
              width={800} 
              height={500} 
              className="w-full h-auto object-cover"
            />
            {/* Subtle glow overlay to blend with the theme */}
            <div className="absolute inset-0 bg-gradient-to-t from-carbon/40 to-transparent mix-blend-overlay dark:opacity-100 opacity-0"></div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="order-1 lg:order-2 flex flex-col gap-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 dark:bg-steel border border-black/10 dark:border-white/10 text-white shadow-lg">
              <span className="font-mono text-lg font-bold">01</span>
            </div>
            <h3 className="font-nocturn text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
              Code that clears itself.
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed">
              Blinky lives directly inside your repository. The exact moment a maintainer merges a pull request, Blinky's AI audits the diff, determines the scope of work, and issues a bounty in real-time. No invoices, no back-and-forth.
            </p>
            <ul className="flex flex-col gap-3 mt-2 font-mono text-sm text-neutral-700 dark:text-neutral-300">
              <li className="flex items-center gap-3"><CheckCircle2 className="size-4 text-persimmon" /> Native GitHub Actions integration</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="size-4 text-persimmon" /> LLM-powered code valuation</li>
            </ul>
          </motion.div>
        </div>

        {/* Chapter 2: The Infrastructure (Using Spline 3D) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col gap-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 dark:bg-steel border border-black/10 dark:border-white/10 text-white shadow-lg">
              <span className="font-mono text-lg font-bold">02</span>
            </div>
            <h3 className="font-nocturn text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
              The Guardian Identity Matrix.
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed">
              We eliminated the risk of spoofed payouts. The Guardian Protocol creates an immutable cryptographic link between a contributor's GitHub handle and their Solana wallet. When Blinky triggers a payout, Guardian ensures the funds flow to the exact right network identity.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-persimmon uppercase tracking-widest font-bold cursor-pointer group">
              <span>Read the Guardian Specs</span>
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative h-[400px] sm:h-[500px] w-full rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-neutral-100 dark:bg-[#0b0c10] shadow-2xl flex items-center justify-center group"
          >
            {/* The Spline 3D Viewer */}
            {mounted && (
              <Spline
                scene={theme === 'dark' ? '/black2.splinecode' : '/white2.splinecode'}
                className="w-full h-full transition-opacity duration-1000"
              />
            )}
            
            {/* Fallback/Overlay to ensure it looks embedded */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
          </motion.div>
        </div>

        {/* Chapter 3: The Settlement (UI Mockup) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="order-2 lg:order-1 relative h-[450px] w-full rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-gradient-to-b from-white to-neutral-50 dark:from-steel dark:to-[#121820] shadow-2xl p-8 flex items-center justify-center"
          >
            {/* Abstract UI Mockup of a Solana Vault Settlement */}
            <div className="w-full max-w-sm rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-carbon p-6 shadow-xl relative z-10">
              <div className="flex items-center justify-between mb-8 border-b border-black/5 dark:border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-persimmon/10 text-persimmon">
                    <Wallet className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-neutral-500 uppercase">Vault Action</div>
                    <div className="text-sm font-semibold text-neutral-900 dark:text-white">USDC Disbursement</div>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-500/20 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase">
                  Settled
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">Recipient</span>
                  <span className="text-sm font-mono text-neutral-900 dark:text-white flex items-center gap-2">
                    <FaGithub className="size-3" /> @Satyamyaduvanshi
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">Network</span>
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">Solana Mainnet</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-sm text-neutral-500">Total Bounty</span>
                  <span className="font-nocturn text-3xl font-bold text-neutral-900 dark:text-white">5.00 <span className="text-lg text-neutral-500">USDC</span></span>
                </div>
              </div>
            </div>

            {/* Decorative background blurs inside the mockup container */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 bg-persimmon/10 dark:bg-persimmon/20 rounded-full blur-[80px] pointer-events-none"></div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="order-1 lg:order-2 flex flex-col gap-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 dark:bg-steel border border-black/10 dark:border-white/10 text-white shadow-lg">
              <span className="font-mono text-lg font-bold">03</span>
            </div>
            <h3 className="font-nocturn text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
              Instant Vault Settlement.
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed">
              No middleman holding your money hostage. Maintainers fund on-chain, multi-tenant vaults mapped to their repositories. When a PR is approved, the protocol executes the smart contract and transfers USDC directly to the developer's wallet in a fraction of a second.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}