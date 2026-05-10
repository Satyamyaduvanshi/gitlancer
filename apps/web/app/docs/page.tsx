"use client";

import { motion } from "framer-motion";
import { 
  Globe, 
  Wrench, 
  Users, 
  HelpCircle, 
  Bot, 
  Copy, 
  CheckCircle2,
  TerminalSquare,
  AlertTriangle,
  Info
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function DocsPage() {
  const [copied, setCopied] = useState(false);
  const contractAddress = "JBnTbnqcvXTmw7nZ6TuLbGcY7U5b8Du7YPpK5G8nByyi";

  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-24 px-6 text-[#1a1a1a] font-sans selection:bg-orange-500/30 selection:text-orange-900">
      
      {/* Header */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <span className="font-serif italic text-gray-400 text-xl tracking-wide mb-4 block">Developer Hub</span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#1a1a1a] mb-6">
          SOLUX Platform Docs
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-light">
          Everything you need to know about setting up autonomous bounties, AI audits, and Solana settlements.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
        
        {/* 1. OVERVIEW */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-gray-100"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Globe size={24} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Overview</h2>
          </div>
          <p className="text-gray-500 text-lg leading-relaxed mb-8">
            <strong className="text-gray-900">SOLUX (GitLancer)</strong> is an autonomous bridge between GitHub and the Solana blockchain. We use Agentic AI (Llama 3) to evaluate Pull Requests and execute instant USDC settlements to contributors via Smart Contracts on Solana Devnet.
          </p>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Smart Contract (Devnet)</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
              <code className="text-sm md:text-base font-mono text-gray-800 break-all">{contractAddress}</code>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors shrink-0"
              >
                {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </motion.section>

        {/* 2. FOR MAINTAINERS */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-gray-100"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <Wrench size={24} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">For Maintainers</h2>
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TerminalSquare size={20} className="text-gray-400" />
                How to Initialize a Repository Vault
              </h3>
              <p className="text-gray-500 mb-6">To automate payouts for a repository, you must first create its on-chain vault.</p>
              <ol className="space-y-4 text-gray-600 font-medium">
                <li className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">1</span>
                  Install the Blinky-Solux GitHub Bot on your repository.
                </li>
                <li className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">2</span>
                  Navigate to the Repositories tab in your SOLUX dashboard.
                </li>
                <li className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">3</span>
                  Select your target repository from the list.
                </li>
                <li className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">4</span>
                  Click <strong className="text-gray-900">Initialize Vault</strong>. This will prompt your connected Solana wallet to sign a transaction, generating a unique Smart Contract PDA (Program Derived Address) specifically for that repo.
                </li>
              </ol>
            </div>

            <div className="w-full h-px bg-gray-100" />

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TerminalSquare size={20} className="text-gray-400" />
                How to Recharge Your Vault
              </h3>
              <p className="text-gray-500 mb-6">Your vault needs USDC to pay contributors.</p>
              <ol className="space-y-4 text-gray-600 font-medium">
                <li className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">1</span>
                  Navigate to the Recharge tab.
                </li>
                <li className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">2</span>
                  Find the repository you want to fund.
                </li>
                <li className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">3</span>
                  Enter the amount of Devnet USDC.
                </li>
                <li className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">4</span>
                  Click the submit button and approve the transaction in your wallet.
                </li>
              </ol>
            </div>
          </div>
        </motion.section>

        {/* 3. FOR CONTRIBUTORS */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-gray-100"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center">
              <Users size={24} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">For Contributors</h2>
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TerminalSquare size={20} className="text-gray-400" />
                How to Connect Your Identity
              </h3>
              <p className="text-gray-500 mb-6">Before you can get paid, the Smart Contract needs to know who you are (Wallet + GitHub).</p>
              <ol className="space-y-4 text-gray-600 font-medium mb-6">
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-purple-500" /> Click the "Claim Bounty" link posted by the SOLUX bot inside your merged GitHub PR.</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-purple-500" /> You will be taken to the Identity Bridge.</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-purple-500" /> <strong className="text-gray-900">Step 1:</strong> Authorize your GitHub account.</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-purple-500" /> <strong className="text-gray-900">Step 2:</strong> Connect your Solana Wallet.</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-purple-500" /> Click <strong>Finalize Connection</strong> to anchor your identity on-chain.</li>
              </ol>
              <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl flex items-start gap-3">
                <Info size={20} className="text-purple-500 shrink-0 mt-0.5" />
                <p className="text-sm text-purple-900"><strong>Note:</strong> You can update your payout wallet at any time by revisiting the link page and selecting a new wallet.</p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100" />

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TerminalSquare size={20} className="text-gray-400" />
                How to Claim Your Money
              </h3>
              <ol className="space-y-4 text-gray-600 font-medium">
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-emerald-500" /> Once your PR is merged and the AI approves the audit, click the settlement link.</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-emerald-500" /> Ensure your linked wallet is connected.</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-emerald-500" /> Click the <strong>Proceed to Settlement</strong> (or Claim) button.</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-emerald-500" /> Approve the transaction in your wallet. The USDC will be instantly transferred!</li>
              </ol>
            </div>

            <div className="w-full h-px bg-gray-100" />

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Common Contributor Concerns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-500" /> Transaction Failed</h4>
                  <p className="text-sm text-gray-600">Even though you are receiving USDC, the Solana network requires a tiny fraction of a cent in SOL to process the transaction. Make sure you have at least <strong>0.01 Devnet SOL</strong> in your wallet.</p>
                </div>
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-500" /> The Vault is Empty</h4>
                  <p className="text-sm text-gray-600">If a transaction fails with "insufficient funds", the Maintainer's vault has run out of USDC. Contact the maintainer to recharge their vault.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 4. TROUBLESHOOTING & SUPPORT */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-gray-100"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <HelpCircle size={24} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Troubleshooting & Support</h2>
          </div>

          <div className="space-y-8">
            <div className="border border-gray-100 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">"I cannot initialize my repo!"</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2"><strong>Check 1:</strong> Do you have enough Devnet SOL in your wallet to cover gas fees?</li>
                <li className="flex items-start gap-2"><strong>Check 2:</strong> Is your wallet set to "Devnet" and not "Mainnet"?</li>
                <li className="flex items-start gap-2"><strong>Check 3:</strong> Have you installed the GitHub bot on that specific repository?</li>
              </ul>
            </div>

            <div className="border border-gray-100 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">"I cannot recharge my vault!"</h3>
              <p className="text-gray-600">You cannot send USDC directly from a faucet to the PDA. You must have Devnet USDC in your connected wallet first, and use the SOLUX dashboard to transfer it to the vault.</p>
            </div>

            <div className="border border-gray-100 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">How does the AI evaluate PRs?</h3>
              <p className="text-gray-600">SOLUX uses a custom Llama 3 Agentic workflow. When a PR is linked to a bounty issue, the AI reads the diff, compares it to the issue requirements, and approves or rejects the PR. If approved, it instructs the Smart Contract to unlock the funds.</p>
            </div>
          </div>
        </motion.section>

        {/* 5. ABOUT THE BOT */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
          className="bg-[#1a1a1a] text-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[60px] pointer-events-none rounded-full" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                <Bot size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">About the GitHub Bot</h2>
            </div>
            <p className="text-gray-400 mb-10 text-lg">To make the magic happen, Maintainers must install our GitHub application (<code className="bg-white/10 px-2 py-1 rounded text-sm text-gray-200">blinky-solux</code>).</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-2">Is it free to use?</h3>
                <p className="text-gray-400">Yes! While SOLUX is operating on the Solana Devnet, the platform and bot are completely free to use.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Will it take over my repo?</h3>
                <p className="text-gray-400">No. The bot operates strictly on a principle of least privilege. It cannot merge code, delete repositories, or modify your branch settings. It functions strictly as an auditor and a messenger.</p>
              </div>
            </div>

            <div className="mt-8 bg-white/5 border border-white/10 p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4">What permissions does it require?</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3">
                  <div className="mt-1"><CheckCircle2 size={16} className="text-emerald-400" /></div>
                  <div>
                    <strong className="text-gray-200 block">Read access</strong> 
                    to code, pull requests, and issues (so the Llama 3 AI can read the code diffs and requirements).
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1"><CheckCircle2 size={16} className="text-emerald-400" /></div>
                  <div>
                    <strong className="text-gray-200 block">Write access</strong> 
                    to issues and PR comments (so the bot can post the audit results and the encrypted claim links for contributors).
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}