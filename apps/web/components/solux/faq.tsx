"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";

const faq = [
  {
    q: "What is SOLUX?",
    a: "SOLUX is an autonomous bounty protocol that bridges GitHub and Solana. <br/> It uses AI to audit pull requests and automates payouts via Solana Blinks directly in the GitHub UI.",
  },
  {
    q: "How do I claim a bounty?",
    a: "Once your PR is merged, our bot (Blinky) posts a 'Blink' in the comments. <br/> You can claim your USDC reward with a single click using any Solana-compatible wallet.",
  },
  {
    q: "What is the Guardian Protocol?",
    a: "The Guardian is our identity layer. It cryptographically links your GitHub handle <br/> to your Solana wallet to ensure payouts are secure and impersonation-proof.",
  },
  {
    q: "Do I need to leave GitHub to get paid?",
    a: "After a one-time setup on the SOLUX dashboard to link your identity, <br/> the entire workflow—from code merge to payout—happens entirely within GitHub.",
  },
  {
    q: "How does the AI audit work?",
    a: "Blinky analyzes the complexity and impact of your code changes. <br/> It suggests a fair bounty amount based on the contribution tier set by the repository maintainer.",
  },
  {
    q: "Which tokens are supported for payouts?",
    a: "SOLUX currently supports instant payouts in USDC on the Solana network <br/> to ensure stable rewards and near-zero transaction fees for developers.",
  },
];

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const createMarkup = (html: string) => {
    return { __html: html.replace(/<br\/>/g, '<br />') };
  };

  // Variants for the staggered list entrance
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-white py-20 transition-colors duration-500 dark:bg-black sm:py-32">
      
      {/* Floating Logos Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute left-[5%] top-[15%] filter blur-[1px] dark:blur-none"
          animate={{ y: [0, -15, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image src="/logos/github.png" alt="GitHub" width={45} height={45} className="opacity-40 dark:opacity-20" />
        </motion.div>

        <motion.div 
          className="absolute right-[8%] top-[40%]"
          animate={{ y: [0, 20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Image src="/logos/solana.svg" alt="Solana" width={55} height={55} className="opacity-30 dark:opacity-20" />
        </motion.div>

        <motion.div 
          className="absolute bottom-[15%] left-[15%]"
          animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Image src="/logos/gemini.svg" alt="Gemini" width={50} height={50} className="opacity-30 dark:opacity-20" />
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4">
        {/* FAQ Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="font-nocturn text-3xl font-semibold text-black transition-colors dark:text-white sm:text-4xl">
            Common Queries
          </h2>
          <div className="mx-auto mt-4 h-1 w-12 bg-persimmon rounded-full" />
        </motion.div>

        <motion.div 
          variants={containerVars}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-4"
        >
          {faq.map((item, index) => (
            <motion.div 
              key={index}
              variants={itemVars}
              className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                activeIndex === index 
                ? "border-persimmon/50 bg-neutral-50 dark:border-persimmon/40 dark:bg-white/5" 
                : "border-neutral-200 bg-white dark:border-white/10 dark:bg-black/40"
              } backdrop-blur-sm shadow-sm`}
            >
              <button
                className="flex w-full items-center justify-between p-5 text-left transition-colors focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <h2 className={`font-nocturn text-base font-medium transition-colors sm:text-lg ${
                  activeIndex === index ? "text-persimmon" : "text-black dark:text-white"
                }`}>
                  {item.q}
                </h2>
                
                <motion.div
                  animate={{ 
                    rotate: activeIndex === index ? 180 : 0,
                    color: activeIndex === index ? "#FC4C02" : "#737373"
                  }}
                  transition={{ duration: 0.3, ease: "circOut" }}
                >
                  <svg
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: 'auto',
                      opacity: 1,
                      transition: {
                        height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.3, delay: 0.1 }
                      }
                    }}
                    exit={{ 
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: { duration: 0.3 },
                        opacity: { duration: 0.2 }
                      }
                    }}
                  >
                    <div className="p-5 pt-0">
                      <div 
                        className="text-sm leading-relaxed text-neutral-600 transition-colors dark:text-neutral-400 sm:text-base"
                        dangerouslySetInnerHTML={createMarkup(item.a)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}