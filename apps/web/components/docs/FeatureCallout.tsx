"use client";

import { AlertTriangle, Info } from "lucide-react";
import { ReactNode } from "react";

type FeatureCalloutProps = {
  variant?: "info" | "warning";
  title: string;
  children: ReactNode;
};

export default function FeatureCallout({
  variant = "info",
  title,
  children,
}: FeatureCalloutProps) {
  const isWarning = variant === "warning";
  const Icon = isWarning ? AlertTriangle : Info;

  return (
    <div className="rounded-[24px] border border-black/10 bg-[#f9f9f9] p-4 dark:border-white/10 dark:bg-steel/55">
      <div className="flex items-center gap-2">
        <Icon className={isWarning ? "size-4 text-amber-500" : "size-4 text-persimmon"} />
        <p className="font-semibold text-neutral-800 dark:text-neutral-100">{title}</p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{children}</p>
    </div>
  );
}
