import { DashboardPreview } from "@/components/solux/DashboardPreview";
import Faq from "@/components/solux/faq";
import SoluxFooter from "@/components/solux/SoluxFooter";
import SoluxHero from "@/components/solux/SoluxHero";
import SoluxNav from "@/components/solux/SoluxNav";
import SoluxStoryFlow from "@/components/solux/SoluxStoryFlow";

export default function Home() {
  return (
    <div className="bg-[#fafafa] min-h-screen text-[#1a1a1a] font-sans selection:bg-orange-500/30 selection:text-orange-900">
      <SoluxNav />
      <main className="overflow-hidden">
        <SoluxHero />
        <SoluxStoryFlow />
        <DashboardPreview />
        <Faq />
      </main>
      <SoluxFooter />
    </div>
  );
}