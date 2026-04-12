import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SectionReveal } from "@/components/SectionReveal";
import { CtaRibbon } from "@/components/home/CtaRibbon";
import { PATH } from "@/lib/paths";
import { scrapedHero } from "@/lib/boardwalk-page-images";
import { ScrapedOnPageGallery } from "@/components/scraped/ScrapedOnPageGallery";
import { ExpandableImage } from "@/components/ui/ExpandableImage";

export const metadata: Metadata = {
  title: "Arcade",
  description:
    "Boardwalk Bowl arcade in Orlando — reloadable card system, digital tickets, prize redemption, and games for all ages.",
};

export default function ArcadePage() {
  return (
    <>
      <PageHero
        eyebrow="Reloadable cards · digital tickets"
        title="Arcade energy that hits different"
        subtitle="Fast games, big screens, and ticketless redemption—load a card, swipe, and keep the night moving between frames."
        imageSrc={scrapedHero(
          "arcade",
          "/images/boardwalk/Boardwalk-Bowling-Rental-Desk-Jennifer-Halpern-1.png",
        )}
        imageAlt="Arcade and guest services at Boardwalk Bowl"
      />

      <SectionReveal className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass-panel rounded-2xl p-8">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">How it works</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>Load credits onto an arcade card at kiosks—cash or card accepted (per live site)</li>
              <li>Swipe to play; games range from ~3–12 credits</li>
              <li>Tickets credit digitally—trade at redemption for prizes</li>
              <li>Cards are reusable—reload on the next visit</li>
            </ul>
          </div>
          <ExpandableImage
            src="/images/boardwalk/UTA5487_WSM_4910-1.png"
            alt="Arcade and entertainment at Boardwalk Bowl"
            sizes="(max-width:768px) 100vw, 50vw"
            wrapperClassName="relative h-64 cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 md:h-80"
          />
        </div>
      </SectionReveal>

      <ScrapedOnPageGallery pageKey="arcade" />

      <SectionReveal variant="right" className="border-y border-white/10 bg-slate-950/50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Featured games floor</h2>
          <p className="mt-2 max-w-3xl text-slate-400">
            Racing, skill, and redemption titles rotate in frequently—every visit can surface something new beside the classics.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {["Racing & drivers", "Ticket jackpots", "Kid-friendly skill games"].map((g) => (
              <div key={g} className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-6 text-sm text-slate-200">
                {g}
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      <CtaRibbon
        headline="Perfect after bowling—stay for the high scores."
        primary={{ label: "See bowling", href: PATH.bowling }}
        secondary={{ label: "Plan a party", href: PATH.parties }}
      />
    </>
  );
}
