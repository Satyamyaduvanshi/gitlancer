"use client";

import { Menu, X, ChevronRight, Home, TerminalSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react"; 
import NavItems, { type NavItemsType } from "./NavItems";

const navItems: NavItemsType[] = [
  { name: "Features", link: "#story" },
  { name: "Pricing", link: "#pricing" },
  { name: "Faq", link: "#faq" },
  { name: "About", link: "#social-proof" },
];

export default function SoluxNav() {
  const { data: session, status } = useSession(); 
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY.current || currentScrollY < 10) {
        setIsNavbarVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsNavbarVisible(false);
        setMobileOpen(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLoggedIn = status === "authenticated";

  return (
    <>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: isNavbarVisible ? 0 : -100, opacity: isNavbarVisible ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-0 right-0 top-0 z-[100] px-4 pt-6 md:px-8"
      >
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between">
          
          {/* 1. Left: Brand Identity */}
          <div className="flex items-center gap-3 flex-1">
            <Link href="/" className="relative flex items-center gap-3 group">
              <Image
                src="/logo-orange.svg"
                alt="SOLUX Logo"
                width={24}
                height={24}
                className="object-contain transition-transform group-hover:scale-110"
                priority
              />
              {/* Using mono font and wide tracking to match the "WINTERFELL" pixel vibe */}
              <span className="text-lg font-mono font-bold tracking-[0.25em] text-white uppercase hidden sm:block">
                SOLUX
              </span>
            </Link>
          </div>

          {/* 2. Center: The Link Pill (Matches screenshot perfectly) */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center gap-8 rounded-2xl border border-white/10 bg-[#0e0e0e]/90 backdrop-blur-xl px-8 py-1.5 shadow-2xl">
              <NavItems
                items={navItems}
                className="gap-8"
                linkClassName="text-[13px] font-medium text-white/60 hover:text-white transition-colors"
              />
            </div>
          </div>

          {/* 3. Right: Quick Actions & CTA */}
          <div className="hidden md:flex items-center justify-end gap-6 flex-1">
            
            {/* Quick Icons */}
            <div className="flex items-center gap-4 text-white/40">
              <Link href="/" className="hover:text-white transition-colors">
                <Home size={18} />
              </Link>
              <Link href="/docs" className="hover:text-white transition-colors">
                <TerminalSquare size={18} />
              </Link>
            </div>

            {/* High Contrast CTA Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={isLoggedIn ? "/dashboard" : "/login"}
                className="group flex items-center gap-1 rounded-xl bg-persimmon px-5 py-1.5 text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(252,76,2,0.2)] hover:shadow-[0_0_30px_rgba(252,76,2,0.4)] transition-all"
              >
                {isLoggedIn ? "Dashboard" : "Sign in"} 
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="relative z-[110] flex size-10 items-center justify-center rounded-xl border border-white/10 bg-[#0e0e0e] text-white"
              onClick={() => setMobileOpen((o) => !o)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-24 z-[95] mx-4 overflow-hidden rounded-3xl border border-white/10 bg-[#0e0e0e]/95 p-8 shadow-2xl backdrop-blur-3xl md:hidden"
          >
            <NavItems
              items={navItems}
              stack
              linkClassName="block border-b border-white/5 py-5 text-xl font-medium text-white/70 transition-colors hover:text-white"
              onNavigate={() => setMobileOpen(false)}
            />
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="mt-8 flex justify-center items-center gap-2 rounded-xl bg-persimmon px-4 py-4 text-center text-sm font-semibold text-white shadow-xl shadow-persimmon/20"
              onClick={() => setMobileOpen(false)}
            >
              {isLoggedIn ? "Go to Dashboard" : "Sign in"}
              <ChevronRight size={16} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}