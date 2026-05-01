"use client";

import { motion } from "framer-motion";

export default function SoluxDocsAnchor() {
  return (
    <section id="docs" className="scroll-mt-20 bg-white py-16 dark:bg-black sm:py-20">
      
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-persimmon">
            Reference
          </p>
          <h2 className="mt-4 font-nocturn text-[clamp(1.9rem,6vw,2.8rem)] tracking-tight text-neutral-900 dark:text-white">
            Protocol docs
          </h2>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <a
              href="/docs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open protocol documentation"
              className="group relative mt-8 inline-flex items-center gap-3 overflow-hidden rounded-md border border-persimmon/50 bg-[#f9f9f9] px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-neutral-700 transition-all hover:border-persimmon hover:text-neutral-900 dark:bg-steel dark:text-neutral-200 dark:hover:text-white sm:mt-10 sm:text-[11px]"
            >
              <span className="relative z-10">Read documentation</span>
              <motion.span 
                className="relative z-10 inline-block"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
              {/* Subtle hover background fill */}
              <div className="absolute inset-0 z-0 translate-y-full bg-persimmon/15 transition-transform duration-300 group-hover:translate-y-0" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}