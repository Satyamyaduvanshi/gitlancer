"use client";

import CodeBlock from "@/components/docs/CodeBlock";
import DocLayout from "@/components/docs/DocLayout";
import DocsSidebar, { type DocNavItem } from "@/components/docs/DocsSidebar";
import FeatureCallout from "@/components/docs/FeatureCallout";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const navItems: DocNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "integration", label: "NestJS + Anchor Integration" },
  { id: "workflow", label: "Settlement Workflow" },
  { id: "security", label: "Security Model" },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Doc() {
  const [activeId, setActiveId] = useState(navItems[0].id);
  const signInUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3001/link";

  const observerIds = useMemo(() => navItems.map((item) => item.id), []);

  useEffect(() => {
    const sections = observerIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0.2, 0.5, 0.9] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [observerIds]);

  return (
    <>
      <header className="fixed top-0 z-100 flex h-16 w-full items-center justify-between border-b border-black/10 bg-white/85 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-carbon/80 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo-orange.svg" alt="SOLUX" width={24} height={24} />
          <span className="font-nocturn text-lg font-bold text-neutral-900 dark:text-white">
            SOLUX{" "}
            <span className="ml-1 text-[10px] uppercase tracking-widest text-persimmon">
              Docs
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={signInUrl}
            className="inline-flex items-center gap-1 rounded-md border border-persimmon/45 bg-persimmon px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white"
          >
            Sign In
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </header>

      <DocLayout
        sidebar={
          <DocsSidebar
            items={navItems}
            activeId={activeId}
            onNavigate={(id) => {
              setActiveId(id);
              scrollToId(id);
            }}
          />
        }
        toc={navItems}
        activeId={activeId}
        onNavigate={(id) => {
          setActiveId(id);
          scrollToId(id);
        }}
      >
        <div className="space-y-10">
          <motion.section
            id="overview"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[28px] border border-black/10 bg-[#f9f9f9] p-6 dark:border-white/10 dark:bg-steel/45 sm:p-8"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-persimmon">
              Getting started
            </p>
            <h1 className="mt-3 font-nocturn text-[clamp(2rem,5vw,3.3rem)] tracking-tight text-neutral-900 dark:text-white">
              SOLUX Protocol Documentation
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base">
              SOLUX links GitHub contributions to Solana-native bounty settlement
              with Guardian identity attestations, Blinky AI audits, and instant Blink
              claims.
            </p>
          </motion.section>

          <motion.section
            id="integration"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="font-nocturn text-3xl tracking-tight text-neutral-900 dark:text-white">
              NestJS + Anchor Integration
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              The API layer consumes GitHub webhooks in NestJS and delegates payout
              settlement to an Anchor client bound to your vault program.
            </p>
            <CodeBlock
              language="ts"
              code={`@Injectable()
export class SettlementService {
  async onPullRequestMerged(event: PullRequestEvent) {
    const identity = await this.guardian.verify(event.githubUserId);
    const audit = await this.blinky.score(event.diff);
    if (!audit.eligible) return;

    await this.anchorVault.settle({
      repo: event.repoId,
      contributor: identity.wallet,
      amount: audit.rewardUsdc,
    });
  }
}`}
            />
            <FeatureCallout title="Integration Note">
              Keep webhook verification and Anchor signer management in separate
              providers to avoid exposing signer context in your API controllers.
            </FeatureCallout>
          </motion.section>

          <motion.section
            id="workflow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[28px] border border-black/10 bg-[#f9f9f9] p-6 dark:border-white/10 dark:bg-steel/45 sm:p-8"
          >
            <h2 className="font-nocturn text-3xl tracking-tight text-neutral-900 dark:text-white">
              Settlement Workflow
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                "1. Guardian maps GitHub handle to wallet",
                "2. Blinky verifies merged diff quality",
                "3. Blink claim settles from on-chain vault",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 rounded-2xl border border-black/10 bg-white p-4 text-sm text-neutral-700 dark:border-white/10 dark:bg-carbon/80 dark:text-neutral-200"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-persimmon" />
                  {item}
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            id="security"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-nocturn text-3xl tracking-tight text-neutral-900 dark:text-white">
              Security Model
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              Payout execution checks both merge authorship and wallet signature against
              Guardian attestations. This prevents impersonation and replay claims.
            </p>
            <div className="mt-4">
              <FeatureCallout variant="warning" title="Operational Warning">
                Rotate settlement signer keys and monitor webhook delivery integrity
                to prevent delayed payout processing.
              </FeatureCallout>
            </div>
          </motion.section>
        </div>
      </DocLayout>
    </>
  );
}