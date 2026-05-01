"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { ReactNode } from "react";
import type { DocNavItem } from "./DocsSidebar";

type DocLayoutProps = {
  sidebar: ReactNode;
  toc: DocNavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  children: ReactNode;
};

export default function DocLayout({
  sidebar,
  toc,
  activeId,
  onNavigate,
  children,
}: DocLayoutProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 22 });

  return (
    <div className="relative min-h-screen bg-white dark:bg-carbon">
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 right-0 top-0 z-120 h-0.5 origin-left bg-persimmon"
      />
      <div className="mx-auto grid w-full max-w-[1480px] grid-cols-1 gap-6 px-4 pb-16 pt-20 lg:grid-cols-[260px_minmax(0,1fr)_220px] lg:px-6 xl:px-8">
        <div className="lg:sticky lg:top-20 lg:self-start">{sidebar}</div>
        <main>{children}</main>
        <aside className="hidden lg:sticky lg:top-20 lg:block lg:self-start">
          <div className="rounded-[24px] border border-black/10 bg-[#f9f9f9] p-4 dark:border-white/10 dark:bg-steel/45">
            <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
              On this page
            </p>
            <nav className="space-y-1">
              {toc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                    activeId === item.id
                      ? "text-persimmon"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
