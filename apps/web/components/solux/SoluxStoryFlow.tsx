"use client";

import { motion } from "framer-motion";
import { GitPullRequest, ShieldCheck, Zap, Bot, MailOpen } from "lucide-react";

const steps = [
  {
    icon: GitPullRequest,
    iconBg: "bg-[#3B82F6]",
    title: "Your Contributors are Your North Star",
    desc: "They’ll show you what’s working and what’s not. Every merged PR is a map to your product’s best version. Reward that effort instantly.",
  },
  {
    icon: ShieldCheck,
    iconBg: "bg-[#EF4444]",
    title: "Security is a Shared Journey",
    desc: "Vulnerabilities happen, but what matters is how quickly you fix them. Blinky AI ensures every line of code is audited before a single cent leaves the vault.",
  },
  {
    icon: Zap,
    iconBg: "bg-[#F59E0B]",
    title: "Innovation Doesn't Live in the Boardroom",
    desc: "Some of your most game-changing features will come straight from your community. Give them a voice, and they’ll help you iterate faster.",
  },
  {
    icon: Bot,
    iconBg: "bg-[#F3F4F6]",
    iconColor: "text-gray-900",
    title: "Success Feels Better Shared",
    desc: "When you nail the contribution experience, your ratings soar, your community grows, and your vision becomes a reality through decentralized labor.",
  }
];

export default function SoluxStoryFlow() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id="how-it-works" className="bg-[#fafafa] pt-24 pb-32">
      
      {/* 1. THE "OPEN LETTER" SECTION (From Screenshot_20260511_002411) */}
      <div className="max-w-6xl mx-auto px-6 mb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Left: Branding & Main Headline */}
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="lg:sticky lg:top-32"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="text-black p-2 rounded-lg">
                <MailOpen size={20} />
              </div>
              <span className="font-serif italic text-persimmon text-xl">Open Letter</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] leading-[1.1] tracking-tight">
              Hey Maintainer! <br/>
              Your Project's Success Lives in Your Community's Code.
            </h2>
          </motion.div>

          {/* Right: The Body Text (Scroll Reveal Paragraphs) */}
          <div className="space-y-12 text-lg md:text-xl text-gray-500 leading-relaxed font-medium">
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              As a maintainer, you've poured your heart into this. Every late night, every tough code review — it's all for your vision to come alive.
            </motion.p>
            
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              But let's face it: you're not building your project for yourself. You're building it for your users and the contributors who believe in you.
            </motion.p>
            
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              The truth is, you don't need to guess what they want. They're already telling you — through their PRs, ideas, and even their bug reports.
            </motion.p>

            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-[#1a1a1a] font-bold">
              All you have to do is reward them. That's where SOLUX comes in.
            </motion.p>
          </div>
        </div>
      </div>

      {/* 2. THE "WHY COLLECT INSIGHTS" GRID (From Screenshot_20260511_002357) */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="bg-[#1c1c1c] rounded-[3rem] md:rounded-[4.5rem] px-2 py-20 md:p-24 text-center overflow-hidden relative shadow-2xl">
          
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeIn}
          >
            <span className="font-serif italic text-gray-400 text-lg md:text-xl">Hear it out</span>
            <h3 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-6 tracking-tight">
              Why Automate Payouts?
            </h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-20 font-medium">
              Because understanding your contributors isn't optional — it's everything.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-left max-w-5xl mx-auto">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1, transition: { delay: idx * 0.1, duration: 0.5 } }
                }}
                className="bg-[#262626] rounded-[2.5rem] p-10 md:p-12 transition-all duration-300 hover:bg-[#2d2d2d] group border border-white/5"
              >
                <div className={`w-12 h-12 rounded-full ${step.iconBg} ${step.iconColor || "text-white"} flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform`}>
                  <step.icon size={22} strokeWidth={2.5} />
                </div>
                
                <h4 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">
                  {step.title}
                </h4>
                
                <p className="text-gray-400 leading-relaxed text-base md:text-lg font-medium">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}