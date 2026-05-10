"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, Wrench, Users, Bot, Copy, CheckCircle2,
  TerminalSquare, AlertTriangle, Info, ChevronRight,
  ExternalLink, Search, Menu, Sun, Moon, Activity,
  Mail, X as CloseIcon, Compass
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Sections for Sidebar
const SECTIONS = [
  { id: "overview", label: "Overview", icon: Globe },
  { id: "maintainer", label: "For Maintainers", icon: Wrench },
  { id: "contributor", label: "For Contributors", icon: Users },
  { id: "navigation", label: "Platform UX", icon: Compass },
  { id: "bot", label: "GitHub Bot", icon: Bot },
];

// Index for the Search Functionality
const searchIndex = [
  { id: "overview", title: "Overview & Smart Contract", desc: "Introduction to SOLUX and Devnet details." },
  { id: "maintainer", title: "Initialize Vaults", desc: "How maintainers can create an on-chain repository vault." },
  { id: "maintainer", title: "Recharge Treasury", desc: "How to fund your vault with Devnet USDC." },
  { id: "contributor", title: "Connect Identity", desc: "Binding your GitHub account to your Solana Wallet." },
  { id: "contributor", title: "Claim Bounties", desc: "How to claim your USDC payout from a merged PR." },
  { id: "navigation", title: "Dashboard Navigation", desc: "Understanding the Repositories, Recharge, and Claims tabs." },
  { id: "bot", title: "Blinky GitHub Bot", desc: "Permissions, security, and how to install the AI bot." },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const contractAddress = "JBnTbnqcvXTmw7nZ6TuLbGcY7U5b8Du7YPpK5G8nByyi";

  // Handle Dark Mode Toggle globally
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle Ctrl+K shortcut for Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll spy to highlight active sidebar item
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = SECTIONS.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 120; // Offset for navbar

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery("");
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth"
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter search results
  const filteredSearch = searchIndex.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-[#1a1a1a] dark:text-gray-100 font-sans selection:bg-orange-500/20 selection:text-orange-900 transition-colors duration-300">
      
      {/* BACKGROUND GRID */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="w-full h-full bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-80" />
      </div>

      {/* 1. TOP NAVBAR */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10 z-50 flex items-center justify-between px-4 md:px-8 transition-colors duration-300">
        <div className="flex items-center gap-6">
          <button className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu size={20} />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-orange.svg" alt="Solux" width={24} height={24} className="shrink-0" />
            <span className="font-black text-xl tracking-tight hidden sm:block dark:text-white">SOLUX</span>
            <span className="bg-orange-50 dark:bg-orange-500/10 text-orange-600 text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 border border-orange-200 dark:border-orange-500/20">DOCS</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Button */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center justify-between gap-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-full px-4 py-1.5 text-sm text-gray-400 dark:text-gray-500 w-64 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search size={14} />
              <span>Search docs...</span>
            </div>
            <span className="text-[10px] border border-gray-200 dark:border-white/10 rounded px-1.5 py-0.5">⌘K</span>
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link href="/dashboard" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hidden sm:block">
            Dashboard
          </Link>
          <Link href="https://github.com/apps/blinky-solux" target="_blank" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-1.5 rounded-full transition-all shadow-[0_4px_10px_rgba(252,76,2,0.2)]">
            Install Bot
          </Link>
        </div>
      </header>

      {/* SEARCH MODAL */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsSearchOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-xl bg-white dark:bg-[#161616] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden mx-4"
            >
              <div className="flex items-center border-b border-gray-100 dark:border-white/10 px-4 py-3">
                <Search size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search documentation..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none px-3 text-gray-900 dark:text-white placeholder-gray-400"
                />
                <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"><CloseIcon size={18}/></button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filteredSearch.length > 0 ? (
                  filteredSearch.map((item, idx) => (
                    <button 
                      key={idx}
                      onClick={() => scrollToSection(item.id)}
                      className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors mb-1"
                    >
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">No results found for "{searchQuery}"</div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex max-w-[1600px] mx-auto pt-16 relative z-10">
        
        {/* 2. LEFT SIDEBAR */}
        <aside className={`fixed md:sticky top-16 left-0 h-[calc(100vh-64px)] w-64 bg-[#fafafa] dark:bg-[#0a0a0a] md:bg-transparent dark:md:bg-transparent border-r border-gray-100 dark:border-white/10 z-40 transform transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} overflow-y-auto`}>
          <div className="p-6">
            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Getting Started</h5>
            <nav className="space-y-1">
              {SECTIONS.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                      isActive 
                        ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold" 
                        : "text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <section.icon size={16} className={isActive ? "text-orange-500" : "text-gray-400"} />
                    {section.label}
                  </button>
                );
              })}
            </nav>

            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-10 mb-4">Ecosystem</h5>
            <nav className="space-y-2">
              <Link 
                href="https://explorer.solana.com/address/JBnTbnqcvXTmw7nZ6TuLbGcY7U5b8Du7YPpK5G8nByyi?cluster=devnet" 
                target="_blank" 
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
              >
                <div className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                <span>Devnet Explorer</span>
                <ExternalLink size={12} className="ml-auto opacity-50" />
              </Link>
            </nav>

            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-10 mb-4">Support & Contact</h5>
            <nav className="space-y-1">
              <Link href="mailto:solux.website@gmail.com" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                <Mail size={16} className="text-gray-400" />
                <span>solux.website@gmail.com</span>
              </Link>
              <Link href="https://x.com/SOLUXdev" target="_blank" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                <CloseIcon size={16} className="text-gray-400" />
                <span>@SOLUXdev</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        )}

        {/* 3. MAIN CONTENT AREA (Stretched to max-w-6xl) */}
        <main className="flex-1 w-full min-w-0 px-4 sm:px-8 py-12 md:px-12 lg:px-16 max-w-6xl mx-auto">
          
          {/* OVERVIEW SECTION */}
          <section id="overview" className="scroll-mt-32 mb-32">
            
            {/* Custom Overview Header */}
            <div className="bg-[#fafafa] dark:bg-[#161616] rounded-[2rem] border border-gray-100 dark:border-white/10 p-6 md:p-12 mb-12 overflow-hidden relative shadow-lg shadow-black/5 dark:shadow-black/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[60px] pointer-events-none rounded-full" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                    <div className="bg-white dark:bg-white/10 p-2.5 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
                      <Image src="/logo-orange.svg" alt="Solux Logo" width={36} height={36} />
                    </div>
                    <span className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">SOLUX</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
                    The Autonomous Bounty Protocol for GitHub & Solana.
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed max-w-xl">
                    We use Agentic AI (Llama 3) to evaluate Pull Requests and execute instant USDC settlements to contributors via Smart Contracts on Solana Devnet.
                  </p>
                </div>
                <div className="w-56 h-56 lg:w-72 lg:h-72 shrink-0 relative rounded-full overflow-hidden border-8 border-white dark:border-[#222] shadow-2xl rotate-[-2deg] transition-transform hover:rotate-0 duration-500">
                  <img 
                    src="https://cdn.prod.website-files.com/684d582f1c52bdf38cbb5c8d/68e8f2972828a2d4a51d274d_Portrait%20of%20a%20Thoughtful%20Young%20Man%20(2).avif" 
                    alt="Developer" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="max-w-4xl">
              <h3 className="text-xl font-bold flex items-center gap-2 border-b border-gray-100 dark:border-white/10 pb-3 mb-5 text-gray-900 dark:text-white">
                <TerminalSquare size={20} className="text-orange-500" /> Devnet Smart Contract
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">All SOLUX transactions are currently verifiable on the Solana Devnet via the official master contract address below.</p>
              <div className="bg-[#1a1a1a] dark:bg-black p-4 rounded-xl flex items-center justify-between gap-4 shadow-inner mb-8 border border-gray-800">
                <code className="text-emerald-400 font-mono text-sm md:text-base break-all">{contractAddress}</code>
                <button 
                  onClick={handleCopy}
                  className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-lg transition-colors shrink-0"
                >
                  {copied ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </section>

          {/* MAINTAINER SECTION */}
          <section id="maintainer" className="scroll-mt-32 mb-32 max-w-5xl">
            <div className="flex items-center gap-3 mb-10 border-b border-gray-100 dark:border-white/10 pb-4">
              <Wrench className="text-blue-500" size={32} />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">For Maintainers</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-[#161616] p-8 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-sm">
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Initialize a Repository Vault</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">To automate payouts for a repository, you must first create its on-chain vault.</p>
                <ol className="space-y-4">
                  {[
                    "Install the Blinky-Solux GitHub Bot on your repository.",
                    "Navigate to the Repositories tab in your SOLUX dashboard.",
                    "Select your target repository from the list.",
                    "Click Initialize Vault. This generates a unique PDA for that repo."
                  ].map((step, i) => (
                    <li key={i} className="flex gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                      <span className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-white dark:bg-[#161616] p-8 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-sm">
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Recharge Your Vault</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Your vault needs USDC to automatically pay your contributors.</p>
                <ol className="space-y-4">
                  {[
                    "Navigate to the Recharge tab in the dashboard.",
                    "Find the repository vault you want to fund.",
                    "Enter the amount of Devnet USDC to deposit.",
                    "Click submit and approve the transaction in your wallet."
                  ].map((step, i) => (
                    <li key={i} className="flex gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                      <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* CONTRIBUTOR SECTION */}
          <section id="contributor" className="scroll-mt-32 mb-32 max-w-5xl">
            <div className="flex items-center gap-3 mb-10 border-b border-gray-100 dark:border-white/10 pb-4">
              <Users className="text-purple-500" size={32} />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">For Contributors</h2>
            </div>

            <div className="bg-white dark:bg-[#161616] p-8 md:p-12 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-sm mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Connect Your Identity</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Before you can get paid, the Smart Contract needs to securely bind your GitHub account to your Solana Wallet.</p>
                  
                  <ul className="space-y-4 bg-purple-50 dark:bg-purple-500/10 p-6 rounded-2xl border border-purple-100 dark:border-purple-500/20">
                    <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"><ChevronRight size={18} className="text-purple-500 mt-0.5 shrink-0" /> Click the "Claim Bounty" link posted by Blinky in your merged PR.</li>
                    <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"><ChevronRight size={18} className="text-purple-500 mt-0.5 shrink-0" /> <strong>Step 1:</strong> Authorize your GitHub account.</li>
                    <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"><ChevronRight size={18} className="text-purple-500 mt-0.5 shrink-0" /> <strong>Step 2:</strong> Connect your Solana Wallet.</li>
                    <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"><ChevronRight size={18} className="text-purple-500 mt-0.5 shrink-0" /> Click <strong>Finalize Connection</strong> to anchor your identity.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Claim Your Payout</h3>
                  <ol className="space-y-4 mb-6">
                    <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300"><CheckCircle2 size={20} className="text-emerald-500" /> Wait for Blinky AI to approve the PR audit.</li>
                    <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300"><CheckCircle2 size={20} className="text-emerald-500" /> Click the settlement link in the comments.</li>
                    <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300"><CheckCircle2 size={20} className="text-emerald-500" /> Click the <strong>Proceed to Settlement</strong> button.</li>
                    <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300"><CheckCircle2 size={20} className="text-emerald-500" /> Approve transaction. USDC transfers instantly.</li>
                  </ol>
                  <div className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10">
                    <Info size={20} className="text-gray-400 shrink-0 mt-0.5" />
                    <p>You can update your payout wallet at any time by revisiting the link page and selecting a new wallet.</p>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Common Troubleshooting</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-500/10 p-6 rounded-2xl">
                <h4 className="font-bold text-red-900 dark:text-red-400 mb-3 flex items-center gap-2"><AlertTriangle size={18} /> Transaction Failed</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">Even though you are receiving USDC, the Solana network requires a fraction of a cent in SOL to process the receipt. Make sure you have at least <strong>0.01 Devnet SOL</strong> in your wallet.</p>
              </div>
              <div className="border border-amber-100 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-500/10 p-6 rounded-2xl">
                <h4 className="font-bold text-amber-900 dark:text-amber-400 mb-3 flex items-center gap-2"><AlertTriangle size={18} /> The Vault is Empty</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">If a transaction fails with "insufficient funds", the Maintainer's vault has run out of USDC. Contact the maintainer directly to recharge their vault.</p>
              </div>
            </div>
          </section>

          {/* PLATFORM NAVIGATION SECTION */}
          <section id="navigation" className="scroll-mt-32 mb-32 max-w-5xl">
            <div className="flex items-center gap-3 mb-10 border-b border-gray-100 dark:border-white/10 pb-4">
              <Compass className="text-indigo-500" size={32} />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Navigating the Platform</h2>
            </div>
            
            <div className="bg-white dark:bg-[#161616] rounded-[2.5rem] border border-gray-100 dark:border-white/10 p-8 shadow-sm">
              <p className="text-gray-500 dark:text-gray-400 mb-8">The SOLUX dashboard provides real-time oversight of your open-source treasury. Here is a breakdown of the primary tabs.</p>
              
              <div className="space-y-6">
                <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">1. Overview Dashboard</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">View high-level metrics including Total USDC Distributed, the number of Active Vaults anchored to your account, and any Pending Claims awaiting withdrawal.</p>
                </div>
                <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">2. Repositories Tab</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Manage all connected GitHub repositories. This is where you deploy the AI Guardian and generate unique Smart Contract PDAs for each repo.</p>
                </div>
                <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">3. Recharge Tab</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Fund your repository smart contracts. Remember: You cannot add USDC directly from a faucet to the PDA. You must fund the vault using Devnet USDC held within your connected wallet.</p>
                </div>
              </div>
            </div>
          </section>

          {/* GITHUB BOT SECTION */}
          <section id="bot" className="scroll-mt-32 mb-24 max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 border-b border-gray-100 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Bot className="text-orange-500" size={32} />
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">GitHub Bot</h2>
              </div>
              <Link 
                href="https://github.com/apps/blinky-solux" 
                target="_blank"
                className="inline-flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-black text-white px-6 py-3 rounded-full font-bold text-sm transition-colors shadow-lg shadow-black/10"
              >
                Install Blinky App <ExternalLink size={16} />
              </Link>
            </div>

            <div className="bg-[#1a1a1a] dark:bg-[#111] text-white border border-gray-800 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[80px] pointer-events-none rounded-full" />
              
              <div className="relative z-10">
                <p className="text-gray-300 mb-10 text-lg">To make the magic happen, Maintainers must install our GitHub application (<code className="bg-white/10 px-2 py-1 rounded text-sm text-gray-100">blinky-solux</code>) to bridge their repository with the smart contract.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                  <div>
                    <h4 className="font-bold text-white text-xl mb-3">Is it free to use?</h4>
                    <p className="text-base text-gray-400 leading-relaxed">Yes! While SOLUX is operating on the Solana Devnet, the platform and bot are completely free to use.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xl mb-3">Will it take over my repo?</h4>
                    <p className="text-base text-gray-400 leading-relaxed">No. The bot operates strictly on a principle of least privilege. It cannot merge code, delete repositories, or modify branch settings. It functions solely as an auditor and a messenger.</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h4 className="font-bold text-white text-xl mb-6">Required Permissions</h4>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                      <CheckCircle2 size={24} className="text-emerald-400 mt-1 shrink-0" />
                      <div>
                        <strong className="text-white text-base block mb-1">Read access (Code, PRs, Issues)</strong>
                        <span className="text-base text-gray-400">So the Llama 3 AI can read the code diffs and requirements to perform the automated agentic audit.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <CheckCircle2 size={24} className="text-emerald-400 mt-1 shrink-0" />
                      <div>
                        <strong className="text-white text-base block mb-1">Write access (Issues, PR Comments)</strong>
                        <span className="text-base text-gray-400">So the bot can post the audit results and drop the encrypted settlement links directly in the PR thread for your contributors.</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}