"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function SoluxFooter() {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();

  return (
    <footer className="relative w-full overflow-hidden border-t border-black bg-[#fafafa] pt-24 pb-12 dark:border-white/5 dark:bg-black selection:bg-persimmon selection:text-white">
      {/* Structural Protocol Glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-persimmon/40 to-transparent dark:via-persimmon/20" />
      <div className="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 h-64 w-[60%] rounded-[100%] bg-persimmon/5 blur-[100px] dark:bg-persimmon/10" />


      
      

      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-12">
          
          {/* Brand & Mission Column (Takes up 5 columns on large screens) */}
          <div className="flex flex-col gap-8 lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              {/* Pure CSS Geometric Logo */}
              <div className="relative flex size-12 items-center justify-center rounded-xl border border-black/10 bg-gradient-to-br from-neutral-100 to-neutral-200 shadow-inner dark:border-white/5 dark:from-steel dark:to-[#121820]">
                <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_top_right,rgba(252,76,2,0.15),transparent_50%)]" />
                <div className="h-4 w-4 rotate-45 rounded-[2px] border-[2px] border-persimmon shadow-[0_0_12px_rgba(252,76,2,0.5)]" />
              </div>
              <span className="font-nocturn text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                SOLUX.
              </span>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="max-w-sm text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400"
            >
              The autonomous bridge between GitHub contributions and Solana rewards. Engineered for sovereign developers.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mt-2"
            >
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
                  className="group flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-white text-neutral-500 transition-all hover:border-persimmon hover:text-persimmon dark:border-white/10 dark:bg-[#1a222c] dark:hover:border-persimmon/50 dark:hover:bg-steel dark:hover:text-persimmon"
                >
                  {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </button>
              )}
              
              <Link
                href="https://github.com/Satyamyaduvanshi/gitlancer"
                target="_blank"
                className="group flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-white text-neutral-500 transition-all hover:border-persimmon hover:text-persimmon dark:border-white/10 dark:bg-[#1a222c] dark:hover:border-persimmon/50 dark:hover:bg-steel dark:hover:text-persimmon"
              >
                <FaGithub className="size-[18px]" />
              </Link>
              
               <Link
                href="https://x.com/SATYAMyada62558"
                target="_blank"
                className="group flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-white text-neutral-500 transition-all hover:border-persimmon hover:text-persimmon dark:border-white/10 dark:bg-[#1a222c] dark:hover:border-persimmon/50 dark:hover:bg-steel dark:hover:text-persimmon"
              >
                <FaXTwitter className="size-[16px]" />
              </Link>
            </motion.div>
          </div>

          {/* Spacer Column for Large Screens */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Links Column 1: Ecosystem */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-6 lg:col-span-3"
          >
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-200">
              Ecosystem
            </h4>
            <div className="flex flex-col gap-3.5 font-sans text-[14px] font-medium text-neutral-500 dark:text-neutral-400">
              <Link href="#guardian" className="w-fit transition-colors hover:text-persimmon">Guardian Protocol</Link>
              <Link href="#blinky" className="w-fit transition-colors hover:text-persimmon">Blinky Audit Bot</Link>
              <Link href="#vaults" className="w-fit transition-colors hover:text-persimmon">Multi-tenant Vaults</Link>
              <Link href="#settlement" className="w-fit transition-colors hover:text-persimmon">USDC Settlement</Link>
            </div>
          </motion.div>

          {/* Links Column 2: Resources */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-6 lg:col-span-3"
          >
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-200">
              Resources
            </h4>
            <div className="flex flex-col gap-3.5 font-sans text-[14px] font-medium text-neutral-500 dark:text-neutral-400">
              <Link href="/docs" className="w-fit transition-colors hover:text-persimmon">Developer Docs</Link>
              <Link href="/docs/anchor" className="w-fit transition-colors hover:text-persimmon">Anchor Integration</Link>
              <Link href="/docs/nestjs" className="w-fit transition-colors hover:text-persimmon">Oracle Setup</Link>
              <a href="#" className="flex w-fit items-center gap-2.5 transition-colors hover:text-persimmon">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                </span>
                Systems Operational
              </a>
            </div>
          </motion.div>
        </div>

        {/* Industrial Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-24 flex flex-col items-center justify-between gap-6 border-t border-black/10 pt-8 dark:border-white/10 sm:flex-row"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-[10px] tracking-[0.1em] text-neutral-400 dark:text-neutral-500 sm:justify-start">
          
          </div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            © {new Date().getFullYear()} SOLUX. ALL RIGHTS RESERVED.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}