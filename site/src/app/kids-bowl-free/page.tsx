import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SectionReveal } from "@/components/SectionReveal";
import { BUSINESS, KIDS_BOWL_FREE } from "@/lib/site-data";
import { scrapedHero } from "@/lib/boardwalk-page-images";
import { ScrapedOnPageGallery } from "@/components/scraped/ScrapedOnPageGallery";

export const metadata: Metadata = {
  title: "Kids Bowl Free",
  description:
    "Kids Bowl Free at Boardwalk Bowl — two free games per day for kids ages 2–15 during the published summer season; shoes not included.",
};

export default function KidsBowlFreePage() {
  return (
    <>
      <PageHero
        eyebrow="Summer tradition · parent-approved"
        title="Kids Bowl Free — more summer strikes"
        subtitle={`Ages ${KIDS_BOWL_FREE.ages}. ${KIDS_BOWL_FREE.offer}. Shoes ${KIDS_BOWL_FREE.shoes.toLowerCase()}. Season window: ${KIDS_BOWL_FREE.datesLabel}.`}
        align="center"
        imageSrc={scrapedHero(
          "kids",
          "/images/boardwalk/Boardwalk-Bowling-Bowling-Lanes-3-Jennifer-Halpern.jpg",
        )}
        imageAlt="Kids Bowl Free at Boardwalk Bowl"
      />

      <SectionReveal className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="glass-panel rounded-2xl p-8">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Why parents use it</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>Keep kids active away from screens</li>
              <li>Affordable rhythm for summer weeks</li>
              <li>Easy to pair with arcade time or food</li>
            </ul>
          </div>
          <div className="flex flex-col justify-center rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 p-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-200">Enroll on the official program site</p>
            <a
              href={BUSINESS.kidsBowlFreeUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950"
            >
              Sign up at KidsBowlFree.com
            </a>
            <p className="mt-3 text-xs text-slate-500">
              Link preserved from the live Boardwalk Bowl Kids Bowl Free page.
            </p>
          </div>
        </div>
      </SectionReveal>

      <ScrapedOnPageGallery pageKey="kids" />
    </>
  );
}
