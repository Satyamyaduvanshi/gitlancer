"use client";

import { cn } from "@/lib/utils";

export type DocNavItem = {
  id: string;
  label: string;
};

type DocsSidebarProps = {
  items: DocNavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
};

export default function DocsSidebar({
  items,
  activeId,
  onNavigate,
}: DocsSidebarProps) {
  return (
    <aside className="rounded-[26px] border border-black/10 bg-[#f9f9f9] p-4 dark:border-white/10 dark:bg-steel/55">
      <p className="px-3 pb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
        Getting started
      </p>
      <nav className="space-y-1.5">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors",
              activeId === item.id
                ? "bg-persimmon/10 text-persimmon"
                : "text-neutral-600 hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/5",
            )}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.14em]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
