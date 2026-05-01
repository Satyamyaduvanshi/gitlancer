"use client";

import { cn } from "@/lib/utils";

export type NavItemsType = {
  name: string;
  link: string;
};

type Props = {
  items: NavItemsType[];
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
  /** Vertical list (e.g. mobile sheet) */
  stack?: boolean;
};

export default function NavItems({
  items,
  className,
  linkClassName,
  onNavigate,
  stack,
}: Props) {
  return (
    
    <ul
      className={cn(
        "flex gap-6",
        stack
          ? "flex-col items-stretch"
          : "flex-row items-center justify-center md:gap-8",
        className,
      )}
    >
      {items.map((item) => (
        <li key={item.link}>
          <a
            href={item.link}
            onClick={onNavigate}
            className={cn(
              "px-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-700 transition-colors duration-200 ease-in-out hover:text-[#FC4C02] dark:text-neutral-200",
              linkClassName
            )}
            
          >
            {item.name}
          </a>
        </li>
      ))}
    </ul>
  );
}
