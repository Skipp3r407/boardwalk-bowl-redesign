import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SectionReveal } from "@/components/SectionReveal";
import { BUSINESS } from "@/lib/site-data";
import { PATH } from "@/lib/paths";
import { scrapedHero } from "@/lib/boardwalk-page-images";
import { ScrapedOnPageGallery } from "@/components/scraped/ScrapedOnPageGallery";

export const metadata: Metadata = {
  title: "Food & Drinks",
  description:
    "Brooklyn South Bar & Grill inside Boardwalk Bowl — pizzas, burgers, appetizers, full bar, Happy Hour specials, takeout, Uber Eats, and Grubhub.",
};

export default function FoodDrinksPage() {
  return (
    <>
      <PageHero
        eyebrow="Brooklyn South Bar & Grill"
        title="Eat like you mean it"
        subtitle="Lane-side, bar-top, or takeout—Brooklyn South keeps the kitchen moving while you keep bowling."
        imageSrc={scrapedHero("food", "/images/boardwalk/Brooklyn-Food-Pic-1-300x226-1.jpg")}
        imageAlt="Food from Brooklyn South Bar & Grill"
      />

      <SectionReveal className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4 text-sm text-slate-300">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Menu highlights</h2>
            <p>Shareables, hand‑tossed pizzas with Brooklyn dough, burgers, sandwiches, salads, and snacks.</p>
            <p>
              Full bar with domestic, import, and craft beer; liquor selection; seasonal cocktails (per live site overview).
            </p>
            <div className="glass-panel rounded-xl p-4 text-xs text-slate-400">
              Policy: outside food and beverages are not permitted, including personal cups or containers—plan on Brooklyn South
              or approved catering for events.
            </div>
          </div>
          <div className="space-y-4">
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-200">Happy hour</h3>
              <p className="mt-2 text-sm text-slate-300">Monday–Friday · 3pm–6pm</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-400">
                <li>$4 domestic pints & well drinks</li>
                <li>$2 off select appetizers</li>
              </ul>
            </div>
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-200">Order online</h3>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <a className="font-semibold text-cyan-300 hover:text-cyan-200" href={BUSINESS.tacoTangoUrl} target="_blank" rel="noreferrer">
                  Taco Tango (pickup / delivery)
                </a>
                <a className="font-semibold text-cyan-300 hover:text-cyan-200" href={BUSINESS.uberEatsUrl} target="_blank" rel="noreferrer">
                  Uber Eats — Boardwalk Bowl
                </a>
                <a className="font-semibold text-cyan-300 hover:text-cyan-200" href={BUSINESS.grubhubUrl} target="_blank" rel="noreferrer">
                  Grubhub — Brooklyn South Bar & Grill
                </a>
              </div>
              <p className="mt-3 text-xs text-slate-500">Takeout available daily open to close — call {BUSINESS.phone}.</p>
            </div>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal variant="right" className="border-t border-white/10 py-14">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 lg:grid-cols-2">
          <div className="relative h-40 w-full max-w-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/boardwalk/brooklyn-south-logo@2x-1.webp"
              alt="Brooklyn South Bar & Grill"
              className="h-full w-auto object-contain"
            />
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Eat · bowl · play</h2>
            <p className="mt-3 text-slate-400">
              Stack a party with lane-side service, or anchor a corporate event with buffet options—start at{" "}
              <Link className="font-semibold text-cyan-300" href={PATH.parties}>
                Parties & Events
              </Link>
              .
            </p>
          </div>
        </div>
      </SectionReveal>

      <ScrapedOnPageGallery pageKey="food" title="Brooklyn South & menu imagery" />
    </>
  );
}
