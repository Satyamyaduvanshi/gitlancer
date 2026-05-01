"use client";

import { motion, Variants } from "framer-motion";

export default function SoluxPayoutShowcase() {
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15, 
        delayChildren: 0.5 
      }
    }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section id="app" className="bg-carbon py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-10 max-w-3xl"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-persimmon">
            The Blink section
          </p>
          <h2 className="mt-3 font-nocturn text-[clamp(1.9rem,6vw,3rem)] font-semibold tracking-tight text-white">
            Settlement in one action
          </h2>
          <p className="mt-3 text-[clamp(0.95rem,2.6vw,1.125rem)] text-neutral-300">
            A Solana Blink-style card routes merged pull requests into immediate on-chain
            bounty claims.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-steel/85 shadow-[0_0_0_1px_rgba(252,76,2,0.08)]"
        >
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-4 py-4 font-mono text-[11px] text-neutral-300 sm:gap-3 sm:px-5 sm:text-xs">
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-emerald-300"
            >
              <span className="size-2 animate-pulse rounded-full bg-emerald-400" /> Verified
            </motion.span>
            <span className="font-bold text-white">#142</span>
            <span>·</span>
            <span className="truncate">feat: add contributor vault signer flow</span>
          </div>

          <motion.div
            variants={containerVars}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10"
          >
            <motion.div variants={itemVars} className="rounded-2xl border border-white/10 bg-carbon/70 p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-400">
                Pull request signal
              </p>
              <h3 className="mt-3 font-nocturn text-2xl tracking-tight text-white">
                Guardian Protocol matched contributor identity.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-neutral-300">
                Blinky Audit Bot validated diff quality and confidence thresholds.
                Multi-tenant vault policy approves instant payout.
              </p>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(252, 76, 2, 0.35)" }}
                whileTap={{ scale: 0.98 }}
                className="mt-7 inline-flex items-center gap-2 rounded-md bg-persimmon px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white"
              >
                Claim Bounty
              </motion.button>
            </motion.div>

            <motion.div variants={itemVars} className="rounded-2xl border border-white/10 bg-carbon/80 p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-400">
                Anchor snippet
              </p>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-[#07080b] p-4 text-xs leading-relaxed text-neutral-200">
{`const tx = await program.methods
  .vaultInitialize()
  .accounts({
    repo: repoPda,
    maintainer,
    contributor,
  })
  .rpc();`}
              </pre>
              <p className="mt-4 text-xs text-neutral-400">
                On merge, vault instructions are queued and settled against protocol policy.
              </p>
            </motion.div>
          </motion.div>

          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-persimmon/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-10 size-56 rounded-full bg-persimmon/10 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}