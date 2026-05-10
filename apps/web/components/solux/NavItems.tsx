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
              // Kept your base layout and typography styling
              "px-2 text-xs font-medium uppercase tracking-[0.18em]",
              // Updated to the smooth glow transition
              "transition-all duration-300 text-persimmon hover:text-black/90",
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