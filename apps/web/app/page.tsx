import Faq from "@/components/solux/faq";
import SoluxDocsAnchor from "@/components/solux/SoluxDocsAnchor";
import SoluxFooter from "@/components/solux/SoluxFooter";
import SoluxHero from "@/components/solux/SoluxHero";
import SoluxMaintainersStrip from "@/components/solux/SoluxMaintainersStrip";
import SoluxNav from "@/components/solux/SoluxNav";
import SoluxStoryFlow from "@/components/solux/SoluxStoryFlow";

export default function Home() {
  return (
    <>
      <SoluxNav />
      <main>
        <SoluxHero />
        <SoluxStoryFlow />
        <SoluxMaintainersStrip />
        <SoluxDocsAnchor />
        <Faq/>
      </main>
      <SoluxFooter />
    </>
  );
}