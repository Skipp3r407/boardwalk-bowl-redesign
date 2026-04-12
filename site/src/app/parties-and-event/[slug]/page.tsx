import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionReveal } from "@/components/SectionReveal";
import { DemoForm } from "@/components/forms/DemoForm";
import { FaqAccordion } from "@/components/FaqAccordion";
import { CtaRibbon } from "@/components/home/CtaRibbon";
import { BUSINESS } from "@/lib/site-data";
import { PATH } from "@/lib/paths";
import {
  EVENT_PAGES,
  EVENT_SLUGS,
  type EventPageSlug,
  type EventTheme,
} from "@/lib/event-pages";
import { EVENT_SLUG_TO_SCRAPE_KEY, scrapedHero } from "@/lib/boardwalk-page-images";
import { ScrapedOnPageGallery } from "@/components/scraped/ScrapedOnPageGallery";

const themeHero: Record<EventTheme, string> = {
  elegant: "from-violet-950/80 via-slate-950/90 to-slate-950",
  playful: "from-amber-600/25 via-slate-950 to-slate-950",
  neon: "from-fuchsia-600/30 via-slate-950 to-slate-950",
  corporate: "from-slate-800/90 via-slate-950 to-slate-950",
  celebration: "from-rose-600/25 via-slate-950 to-slate-950",
  bright: "from-sky-500/20 via-slate-950 to-slate-950",
};

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return EVENT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cfg = EVENT_PAGES[slug as EventPageSlug];
  if (!cfg) return {};
  return {
    title: cfg.title,
    description: cfg.description,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!EVENT_SLUGS.includes(slug as EventPageSlug)) notFound();
  const cfg = EVENT_PAGES[slug as EventPageSlug];
  const formVariant = slug === "kids-birthday-parties" ? "birthday" : "event";
  const scrapeKey = EVENT_SLUG_TO_SCRAPE_KEY[slug];
  const heroBg = scrapedHero(
    scrapeKey,
    "/images/boardwalk/Boardwalk-Bowling-Bowling-Lanes-3-Jennifer-Halpern.jpg",
  );

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <Image src={heroBg} alt="" fill className="object-cover" priority sizes="100vw" />
        </div>
        <div className={`absolute inset-0 bg-gradient-to-br ${themeHero[cfg.theme]}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.12),transparent_45%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/90">{cfg.eyebrow}</p>
          <h1 className="mt-3 max-w-4xl font-[family-name:var(--font-display)] text-4xl tracking-[0.04em] text-white sm:text-5xl md:text-6xl">
            {cfg.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200 sm:text-xl">{cfg.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={BUSINESS.phoneTel} className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-950">
              Call {BUSINESS.phone}
            </a>
            <Link href={PATH.parties} className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white">
              All event types
            </Link>
          </div>
        </div>
      </section>

      <SectionReveal className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-6 lg:grid-cols-3">
          {cfg.bullets.map((b) => (
            <div key={b} className="glass-panel rounded-2xl p-5 text-sm text-slate-300">
              {b}
            </div>
          ))}
        </div>
      </SectionReveal>

      <ScrapedOnPageGallery
        pageKey={scrapeKey}
        title="Gallery"
        subtitle="Imagery from the matching page on the live Boardwalk Bowl site (mirrored locally)."
        max={12}
      />

      <SectionReveal className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">{cfg.cta}</h2>
            <p className="mt-2 text-sm text-slate-400">
              Production recommendation: embed Tripleseat or connect forms to your CRM — this is a styled demo form.
            </p>
          </div>
          <DemoForm variant={formVariant} />
        </div>
      </SectionReveal>

      <SectionReveal className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">FAQ</h2>
        <div className="mt-6 max-w-3xl">
          <FaqAccordion items={cfg.faq} />
        </div>
      </SectionReveal>

      <CtaRibbon
        headline={cfg.title}
        body="Ready for dates and headcounts? Call the events desk or submit the inquiry form above."
        primary={{ label: "Events hub", href: PATH.parties }}
        secondary={{ label: "Directions", href: PATH.contact }}
      />
    </>
  );
}
