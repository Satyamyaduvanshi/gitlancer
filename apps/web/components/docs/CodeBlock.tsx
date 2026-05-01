"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

type CodeBlockProps = {
  code: string;
  language?: string;
};

export default function CodeBlock({ code, language = "ts" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-black/10 bg-[#f9f9f9] dark:border-white/10 dark:bg-steel/55">
      <div className="flex items-center justify-between border-b border-black/10 px-4 py-3 dark:border-white/10">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-md border border-black/10 bg-white px-2.5 py-1 text-xs text-neutral-600 transition hover:border-persimmon hover:text-persimmon dark:border-white/10 dark:bg-carbon/80 dark:text-neutral-300"
          aria-label="Copy code block"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto bg-white p-4 font-mono text-[13px] leading-relaxed text-neutral-800 dark:bg-[#0a0d12] dark:text-neutral-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}
