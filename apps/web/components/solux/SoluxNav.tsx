"use client";

import { Menu, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react"; // ⚡ Added for auth state
import NavItems, { type NavItemsType } from "./NavItems";

const navItems: NavItemsType[] = [
  { name: "Product", link: "#story" },
  { name: "Docs", link: "#docs" },
  { name: "FAQ", link: "#faq" },
];

export default function SoluxNav() {
  const { data: session, status } = useSession(); // 🔐 Get auth status
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
        className="fixed left-0 right-0 top-3 z-[100] px-3 sm:top-4 sm:px-4 md:px-6"
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-black/10 bg-white/40 px-4 py-2 backdrop-blur-xl dark:border-white/15 dark:bg-[#111111]/45 sm:px-5 shadow-2xl">
          <div className="flex items-center gap-6">
            <Link href="/" className="relative z-110 flex shrink-0 items-center gap-2.5">
              <Image
                src="/logo-orange.svg"
                alt="SOLUX Logo"
                width={22}
                height={22}
                className="object-contain"
                priority
              />
              <span className="text-base font-bold tracking-tighter text-neutral-900 dark:text-white uppercase">
                SOLUX<span className="text-persimmon">.</span>
              </span>
            </Link>
            <div className="hidden md:block">
              <NavItems
                items={navItems}
                className="gap-6"
                linkClassName="px-1 text-[13px] font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
              />
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center gap-6 md:flex">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="text-[13px] font-medium text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                >
                  Log in
                </Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/login"
                    className="rounded-full bg-persimmon px-5 py-2.5 text-[12px] font-bold text-white shadow-lg shadow-persimmon/20 uppercase tracking-widest"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/dashboard"
                  className="rounded-full bg-white text-black px-5 py-2.5 text-[12px] font-bold uppercase tracking-widest flex items-center gap-2"
                >
                  Dashboard <ArrowRight size={14} />
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="relative z-110 flex size-10 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-900 dark:border-white/20 dark:bg-zinc-900 dark:text-white"
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
            className="fixed inset-x-0 top-20 z-[95] mx-3 overflow-hidden rounded-3xl border border-white/10 bg-black/90 p-8 shadow-2xl backdrop-blur-2xl md:hidden"
          >
            <NavItems
              items={navItems}
              stack
              linkClassName="block border-b border-white/5 py-6 text-2xl font-bold text-white transition-colors hover:text-persimmon"
              onNavigate={() => setMobileOpen(false)}
            />
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="mt-8 block rounded-2xl bg-persimmon px-4 py-4 text-center text-sm font-bold uppercase tracking-widest text-white shadow-xl shadow-persimmon/20"
              onClick={() => setMobileOpen(false)}
            >
              {isLoggedIn ? "Go to Dashboard" : "Sign Up Now"}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}