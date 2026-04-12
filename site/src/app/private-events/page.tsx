import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SectionReveal } from "@/components/SectionReveal";
import { BUSINESS } from "@/lib/site-data";
import { PATH } from "@/lib/paths";
import { scrapedHero } from "@/lib/boardwalk-page-images";
import { ScrapedOnPageGallery } from "@/components/scraped/ScrapedOnPageGallery";

export const metadata: Metadata = {
  title: "Private Events",
  description:
    "Private events at Boardwalk Bowl and The Bridge Event Center — receptions, banquets, corporate programs, and hybrid celebrations with bowling and arcade add-ons.",
};

export default function PrivateEventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Bridge venue · full campus buyouts"
        title="Private events with production polish"
        subtitle="Scale from intimate receptions to full-venue energy—catering, bar, A/V, and attractions in one walkable campus."
        imageSrc={scrapedHero("bridge", "/images/boardwalk/Boardwalk-Bowling-Bowling-Lanes-3-Jennifer-Halpern.jpg")}
        imageAlt="Private event style imagery"
      />
      <SectionReveal className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {["Weddings & receptions", "Corporate galas", "School & nonprofit nights"].map((t) => (
            <div key={t} className="glass-panel rounded-2xl p-6 text-sm text-slate-300">
              <p className="font-[family-name:var(--font-display)] text-2xl text-white">{t}</p>
              <p className="mt-2 text-slate-500">Layouts, timelines, and add-ons tailored to your crowd.</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href={PATH.partiesBridge}
            className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-slate-950"
          >
            The Bridge Event Center
          </Link>
          <a href={BUSINESS.phoneTel} className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white">
            Call {BUSINESS.phone}
          </a>
        </div>
      </SectionReveal>

      <ScrapedOnPageGallery pageKey="bridge" title="Private events & Bridge venue" />
    </>
  );
}
