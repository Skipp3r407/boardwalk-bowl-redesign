import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SectionReveal } from "@/components/SectionReveal";
import { FaqAccordion } from "@/components/FaqAccordion";
import { CtaRibbon } from "@/components/home/CtaRibbon";
import { BOWLING_RATES, BUSINESS, LANE_RECURRING_NOTES } from "@/lib/site-data";
import { PATH } from "@/lib/paths";
import { scrapedHero } from "@/lib/boardwalk-page-images";
import { ScrapedOnPageGallery } from "@/components/scraped/ScrapedOnPageGallery";
import { ExpandableImage } from "@/components/ui/ExpandableImage";

export const metadata: Metadata = {
  title: "Bowling",
  description:
    "Open play and hourly bowling rates at Boardwalk Bowl in Orlando — 80 lanes, Brunswick Sync interactive games, cosmic bowling, and shoe rental pricing.",
};

const faq = [
  {
    q: "What is Brunswick Sync?",
    a: "Sync is Boardwalk Bowl’s scoring and entertainment system—traditional games plus interactive options like Angry Birds Bowling, Creature Feature, and HORSE.",
  },
  {
    q: "Do you offer bumpers?",
    a: "Yes—bumper lanes help younger guests keep balls on the lane and smiles high.",
  },
  {
    q: "When are lanes limited?",
    a: "League nights and tournaments can reduce availability. Tuesday evenings typically see limited lanes; Thursday league windows may remove lanes entirely—call ahead to confirm tonight’s status.",
  },
];

export default function BowlingPage() {
  return (
    <>
      <PageHero
        eyebrow="Open play · leagues · cosmic nights"
        title="Bowling built for every crew"
        subtitle="Eighty lanes. Brunswick Sync scoring. Interactive games layered on classic 10‑pin—Orlando’s largest bowling floor, dialed for families, date nights, and serious league nights alike."
        imageSrc={scrapedHero(
          "bowling",
          "/images/boardwalk/Boardwalk-Bowling-Bowling-Lanes-3-Jennifer-Halpern.jpg",
        )}
        imageAlt="Bowling lanes at Boardwalk Bowl"
      />

      <SectionReveal className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="glass-panel rounded-2xl p-8">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Per guest · per game</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {BOWLING_RATES.perGame.map((r) => (
                <li key={r.label} className="flex justify-between gap-4 border-b border-white/5 py-2">
                  <span>{r.label}</span>
                  <span className="font-semibold text-cyan-200">{r.price}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-500">Shoe rental: {BOWLING_RATES.shoes}</p>
          </div>
          <div className="glass-panel rounded-2xl p-8">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Per hour · per lane</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {BOWLING_RATES.perHour.map((r) => (
                <li key={r.label} className="flex justify-between gap-4 border-b border-white/5 py-2">
                  <span>{r.label}</span>
                  <span className="font-semibold text-orange-200">{r.price}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-500">Shoe rental: {BOWLING_RATES.shoes}</p>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal variant="left" className="border-y border-white/10 bg-slate-950/50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Modern scoring · interactive games</h2>
              <p className="mt-3 text-slate-400">
                Sync keeps casual nights fresh—theme your game, track stats, and switch into skill challenges between frames.
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-300">
                <li>HORSE — basketball energy on the lanes</li>
                <li>Angry Birds Bowling — approachable for kids and groups</li>
                <li>Creature Feature — playful, photo‑worthy moments</li>
              </ul>
            </div>
            <ExpandableImage
              src="/images/boardwalk/UTA5487_WSM_4910-1.png"
              alt="Bowling experience at Boardwalk Bowl"
              sizes="(max-width:1024px) 100vw, 50vw"
              wrapperClassName="relative h-64 cursor-zoom-in overflow-hidden rounded-2xl border border-cyan-500/20 sm:h-72"
            />
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Cosmic nights</h2>
        <p className="mt-3 max-w-3xl text-slate-400">
          Lights down, music up, effects on—cosmic turns a casual roll into a night‑out vibe. Pair with arcade time and Brooklyn South for a full evening.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {["Family outing", "Date night", "Friends & leagues"].map((t) => (
            <div key={t} className="glass-panel rounded-xl p-5 text-sm text-slate-300">
              <p className="font-[family-name:var(--font-display)] text-xl text-white">{t}</p>
              <p className="mt-2 text-slate-500">Lanes, games, food, and bar—one stop.</p>
            </div>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal variant="right" className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Lane availability heads‑up</h2>
        <p className="mt-2 text-sm text-slate-500">
          Recurring patterns from the live site—tournament weekends vary; call {BUSINESS.phone} before you roll in for big events.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-slate-300">
          {LANE_RECURRING_NOTES.map((n) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              {n}
            </li>
          ))}
        </ul>
      </SectionReveal>

      <ScrapedOnPageGallery pageKey="bowling" />

      <SectionReveal className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Bowling FAQ</h2>
        <div className="mt-6 max-w-3xl">
          <FaqAccordion items={faq} />
        </div>
      </SectionReveal>

      <CtaRibbon
        headline="Lock lane time or plan something bigger."
        primary={{ label: "Call the house", href: BUSINESS.phoneTel }}
        secondary={{ label: "Host an event", href: PATH.parties }}
      />
    </>
  );
}
