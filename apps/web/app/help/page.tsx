'use client';
import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Search, 
  LifeBuoy, 
  BookOpen, 
  Wallet, 
  Terminal, 
  MessageCircle, 
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

// 📚 Mock FAQ Data tailored for SOLUX Maintainers
const faqs = [
  { 
    id: 1, 
    question: "How do I fund my repository vault?", 
    answer: "Navigate to the Treasury Management (Recharge) page. Connect your Solana wallet, enter the desired USDC amount next to your repository's PDA address, and confirm the transaction. Make sure you are using Devnet USDC." 
  },
  { 
    id: 2, 
    question: "Why isn't the SOLUX bot commenting on my PRs?", 
    answer: "Ensure the SOLUX GitHub App is fully installed in your GitHub organization settings and that the specific repository is whitelisted. Also, verify that your Web3 identity is bound in the Settings page." 
  },
  { 
    id: 3, 
    question: "What happens if an AI audit fails?", 
    answer: "If the AI determines the PR does not meet the bounty's acceptance criteria, the PR will receive an automated comment detailing the missing requirements. The USDC will remain securely locked in the repository vault until a valid PR is merged." 
  },
  { 
    id: 4, 
    question: "Can I use mainnet USDC to fund vaults?", 
    answer: "Currently, the SOLUX beta is running exclusively on the Solana Devnet to ensure maximum security during the auditing phase. Mainnet support will be rolling out in the upcoming V2 release." 
  },
  { 
    id: 5, 
    question: "How do contributors claim their funds?", 
    answer: "Once a PR is merged and the AI audit passes, the bot provides a unique claim link in the PR comments. The contributor simply clicks the link, connects their wallet, and signs the transaction to pull the funds from the vault." 
  },
  { 
    id: 6, 
    question: "How do I change my connected Solana wallet?", 
    answer: "Go to Settings > Profile & Identity. Under the Web3 Identity section, click 'Change Wallet'. This will redirect you to the Identity Bridge where you can overwrite your previously linked wallet." 
  }
];

const categories = [
  { title: "Getting Started", icon: BookOpen, desc: "Platform basics and onboarding." },
  { title: "Treasury & USDC", icon: Wallet, desc: "Funding vaults and wallet issues." },
  { title: "GitHub Bot", icon: Terminal, desc: "Webhooks, audits, and PR tracking." },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // 🔍 Real-time Search Filter
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const lowerQuery = searchQuery.toLowerCase();
    return faqs.filter(
      faq => faq.question.toLowerCase().includes(lowerQuery) || faq.answer.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <DashboardLayout>
      
      {/* 🚀 Sleek Header Section */}
      <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700 ease-out text-center max-w-3xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-persimmon/10 rounded-2xl border border-persimmon/20">
            <LifeBuoy className="text-persimmon" size={32} />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground tracking-tight mb-4">
          How can we help you?
        </h1>
        
        {/* Massive Search Bar */}
        <div className="relative w-full max-w-2xl mx-auto group mt-6">
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-persimmon transition-colors duration-300" />
          <input 
            type="text" 
            placeholder="Search for articles, guides, or troubleshooting steps..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-full pl-14 pr-6 py-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-persimmon/30 focus:border-persimmon transition-all shadow-lg placeholder:text-foreground/30 font-sans"
          />
        </div>
      </div>

      {/* 🗂️ Quick Categories Grid (Only show if not actively searching) */}
      {!searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="bg-[#111111] border border-white/5 p-6 rounded-[2rem] shadow-lg flex flex-col items-center text-center hover:border-persimmon/30 hover:shadow-[0_10px_30px_rgba(252,76,2,0.1)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <div className="p-4 bg-white/5 rounded-2xl text-white mb-4 group-hover:scale-110 group-hover:bg-persimmon/10 group-hover:text-persimmon transition-all duration-300">
                <cat.icon size={24} />
              </div>
              <h3 className="font-bold text-white mb-2">{cat.title}</h3>
              <p className="text-xs text-white/50">{cat.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* ❓ FAQ Section */}
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          {searchQuery ? `Search Results (${filteredFaqs.length})` : 'Frequently Asked Questions'}
        </h2>

        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-black/20 rounded-[2rem] border border-white/5">
            <p className="text-white/40 mb-2">No results found for "{searchQuery}"</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="text-persimmon hover:text-orange-400 text-sm font-bold transition-colors"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className={`border border-white/5 rounded-2xl overflow-hidden transition-colors duration-300 ${isOpen ? 'bg-[#111111] border-white/10' : 'bg-black/20 hover:bg-[#111111]/50'}`}
                >
                  <button 
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  >
                    <span className="font-medium text-white/90 pr-4">{faq.question}</span>
                    <ChevronDown 
                      size={18} 
                      className={`text-white/40 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-persimmon' : ''}`} 
                    />
                  </button>
                  
                  {/* Smooth Accordion Animation using CSS Grid */}
                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-5 pt-0 text-sm text-white/50 leading-relaxed border-t border-white/5 mt-2">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 💬 Community Support Banner */}
      <div className="max-w-3xl mx-auto mt-12 mb-8">
        <div className="bg-gradient-to-r from-[#111111] to-[#1a1a1a] border border-white/5 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-persimmon/10 rounded-full blur-3xl pointer-events-none group-hover:bg-persimmon/20 transition-all duration-700" />
          
          <div className="relative z-10 flex items-center gap-5">
            <div className="p-4 bg-white/5 rounded-2xl text-white">
              <MessageCircle size={28} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white mb-1">Still need help?</h3>
              <p className="text-sm text-white/50">Join our developer community or open a support ticket.</p>
            </div>
          </div>

          <Link href="#" className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition-all shadow-lg active:scale-95 whitespace-nowrap">
            Join Discord <ArrowRight size={16} />
          </Link>
        </div>
      </div>

    </DashboardLayout>
  );
}