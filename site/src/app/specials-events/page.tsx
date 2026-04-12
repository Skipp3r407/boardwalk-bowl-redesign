import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SectionReveal } from "@/components/SectionReveal";
import { SpecialsGrid } from "@/components/specials/SpecialsGrid";
import { BUSINESS } from "@/lib/site-data";
import { scrapedHero } from "@/lib/boardwalk-page-images";
import { ScrapedOnPageGallery } from "@/components/scraped/ScrapedOnPageGallery";

export const metadata: Metadata = {
  title: "Specials & Events",
  description:
    "Weekly specials, themed nights, karaoke, Latin nights, and seasonal promotions at Boardwalk Bowl in Orlando.",
};

export default function SpecialsEventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Weekly energy · seasonal hits"
        title="Specials & happenings"
        subtitle="The Boardwalk calendar stays busy—filter flyers below and follow social for last‑minute drops."
        align="center"
        imageSrc={scrapedHero(
          "specials",
          "/images/boardwalk/Boardwalk-Bowling-Bowling-Lanes-3-Jennifer-Halpern.jpg",
        )}
        imageAlt="Specials and events at Boardwalk Bowl"
      />

      <SectionReveal className="mx-auto max-w-7xl px-4 py-14">
        <p className="text-sm text-slate-500">
          Graphics sourced from the live Specials & Events page. Tournament and league holds may still affect lane availability—call{" "}
          <a className="font-semibold text-cyan-300" href={BUSINESS.phoneTel}>
            {BUSINESS.phone}
          </a>{" "}
          before you head over.
        </p>
        <div className="mt-8">
          <SpecialsGrid />
        </div>
      </SectionReveal>

      <ScrapedOnPageGallery pageKey="specials" title="Graphics from the live specials page" />
    </>
  );
}
