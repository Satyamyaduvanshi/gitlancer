"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function SoluxMaintainersStrip() {
  return (
    <section id="social-proof" className="bg-white py-16 dark:bg-black sm:py-24">
     
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="group relative overflow-hidden rounded-3xl border border-black/10 bg-[#f9f9f9] p-8 dark:border-white/10 dark:bg-steel/50 sm:p-12"
        >
          <div className="absolute -right-20 -top-20 size-64 rounded-full bg-persimmon/10 blur-3xl transition-opacity group-hover:opacity-100" />

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center font-nocturn text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl"
            >
              Powering the next wave of open-source.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mx-auto mt-4 max-w-2xl text-center text-lg text-neutral-600 dark:text-neutral-300"
            >
              Trusted by teams building contributor-first protocols on Solana.
            </motion.p>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-5 dark:border-white/10 dark:bg-carbon/70"
              >
                <Image src="/logos/solana.svg" alt="Solana" width={94} height={22} className="h-6 w-auto" />
              </motion.div>
            
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="flex items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-5 dark:border-white/10 dark:bg-carbon/70"
              >
                <Image src="/logos/github.svg" alt="GitHub" width={90} height={22} className="h-6 w-auto dark:invert" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}