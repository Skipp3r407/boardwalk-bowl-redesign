import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/json-ld";
import { PackagePicker } from "@/components/booking/PackagePicker";
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
  return pageMeta({
    title: `${cfg.title} in Orlando`,
    description: cfg.description.length > 158 ? `${cfg.description.slice(0, 155).replace(/\s+\S*$/, "")}…` : cfg.description,
    path: `/parties-and-event/${slug}`,
    image: scrapedHero(EVENT_SLUG_TO_SCRAPE_KEY[slug], "/images/boardwalk/2026/Book-Holiday-image.jpg"),
    imageAlt: `${cfg.title} at Boardwalk Bowl`,
  });
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
      <JsonLd
        data={[
          faqJsonLd(cfg.faq),
          breadcrumbJsonLd([
            { name: "Parties & Events", path: PATH.parties },
            { name: cfg.title, path: `/parties-and-event/${slug}` },
          ]),
        ]}
      />
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <Image src={heroBg} alt={`${cfg.title} at Boardwalk Bowl in Orlando`} fill className="object-cover" priority sizes="100vw" />
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
            <Link
              href={`${PATH.book}?type=${slug === "kids-birthday-parties" ? "birthday" : "event"}`}
              className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-orange-500/30"
            >
              Request a date online
            </Link>
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

      {slug === "kids-birthday-parties" && (
        <SectionReveal className="mx-auto max-w-7xl px-4 pb-4">
          <PackagePicker />
        </SectionReveal>
      )}

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
              Prefer the full planner? <Link className="font-semibold text-cyan-300" href={PATH.book}>Request a date, time and package online</Link> — the events team confirms by phone or email.
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
