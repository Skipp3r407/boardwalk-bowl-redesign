import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SectionReveal } from "@/components/SectionReveal";
import { BILLIARDS_RATES, BUSINESS, HOURS_BILLIARDS } from "@/lib/site-data";
import { PATH } from "@/lib/paths";
import { scrapedHero } from "@/lib/boardwalk-page-images";
import { ScrapedOnPageGallery } from "@/components/scraped/ScrapedOnPageGallery";
import { ExpandableImage } from "@/components/ui/ExpandableImage";

export const metadata: Metadata = pageMeta({
  title: "Billiards in Orlando: $11/Hour Pool Tables",
  description:
    "Brooklyn South Billiards at Boardwalk Bowl: regulation pool tables at $11 per hour per table, open late on weekends, steps from the bar and lanes.",
  path: "/billiards",
  image: "/images/boardwalk/2026/Boardwalk-Bowling-Brooklyn-South-Billards-Jennifer-Halpern.jpg",
  imageAlt: "Pool tables in the Brooklyn South billiards room",
});

export default function BilliardsPage() {
  return (
    <>
      <PageHero
        eyebrow="Brooklyn South Billiards"
        title="Rack ’em in a lounge that glows"
        subtitle="Six regulation tables, big screens, patio air, and a full bar—post-bowling hangs with upscale‑casual energy."
        imageSrc={scrapedHero("billiards", "/images/boardwalk/Brooklyn-Food-Pic-1-300x226-1.jpg")}
        imageAlt="Billiards lounge atmosphere"
      />

      <SectionReveal className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">What you’ll find</h2>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>6 regulation‑size pool tables</li>
              <li>Patio seating</li>
              <li>Large flat‑screen TVs</li>
              <li>Full Brooklyn South bar + food menu</li>
            </ul>
            <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
              Rates: {BILLIARDS_RATES.table}
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Billiards hours</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {HOURS_BILLIARDS.map((h) => (
                <li key={h.day} className="flex justify-between gap-4 border-b border-white/5 py-1">
                  <span className="text-slate-500">{h.day}</span>
                  <span>{h.hours}</span>
                </li>
              ))}
            </ul>
            <Link href={PATH.foodDrinks} className="mt-4 inline-flex text-sm font-semibold text-cyan-300">
              Explore Brooklyn South menu →
            </Link>
          </div>
        </div>
      </SectionReveal>

      <ScrapedOnPageGallery pageKey="billiards" />

      <SectionReveal variant="left" className="border-t border-white/10 py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2 lg:items-center">
          <ExpandableImage
            src="/images/boardwalk/Brooklyn-Food-Pic-1-300x226-1.jpg"
            alt="Drinks and food at Brooklyn South"
            sizes="(max-width:1024px) 100vw, 50vw"
            wrapperClassName="relative h-64 cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 sm:h-80"
          />
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Nightlife polish · zero attitude</h2>
            <p className="mt-3 text-slate-400">
              Catch the game, split a pitcher, and let the night breathe—billiards here feels social, not stuffy. Questions?{" "}
              <a className="font-semibold text-cyan-300" href={BUSINESS.phoneTel}>
                {BUSINESS.phone}
              </a>
            </p>
          </div>
        </div>
      </SectionReveal>
    </>
  );
}
