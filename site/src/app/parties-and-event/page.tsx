import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SectionReveal } from "@/components/SectionReveal";
import { DemoForm } from "@/components/forms/DemoForm";
import { BUSINESS, EVENT_OFFICE_HOURS } from "@/lib/site-data";
import { PATH } from "@/lib/paths";
import { EVENT_PAGES, eventPath, type EventPageSlug } from "@/lib/event-pages";
import { scrapedHero } from "@/lib/boardwalk-page-images";
import { ScrapedOnPageGallery } from "@/components/scraped/ScrapedOnPageGallery";
import { ExpandableImage } from "@/components/ui/ExpandableImage";

export const metadata: Metadata = {
  title: "Parties & Events",
  description:
    "Plan parties, corporate events, fundraisers, and celebrations at Boardwalk Bowl — The Bridge Event Center, catering, and attractions in one Orlando venue.",
};

const cards: { slug: EventPageSlug; blurb: string }[] = [
  { slug: "the-bridge-event-center", blurb: "Receptions, banquets, ceremonies" },
  { slug: "kids-birthday-parties", blurb: "Packages built for kids’ crews" },
  { slug: "teen-parties", blurb: "Bowling + arcade social nights" },
  { slug: "company-parties-team-building", blurb: "Agendas + playoffs" },
  { slug: "sweet-16-quinceanera-parties", blurb: "Milestone glam + fun" },
  { slug: "graduation-parties", blurb: "All-in-one class celebrations" },
  { slug: "fundraising", blurb: "Pick-a-day & bowl-a-thon formats" },
  { slug: "schools-daycares", blurb: "Field trips & camp days" },
  { slug: "youth-team-parties", blurb: "Roster celebrations" },
];

export default function PartiesHubPage() {
  return (
    <>
      <PageHero
        eyebrow="Book online · talk to humans"
        title="Parties & events that feel big-time"
        subtitle="Private Bridge dinners, lane takeovers, arcade add-ons, and catering scaled to your crowd—one campus, one planning team."
        imageSrc={scrapedHero(
          "parties",
          "/images/boardwalk/Boardwalk-Bowling-Bowling-Lanes-3-Jennifer-Halpern.jpg",
        )}
        imageAlt="Celebrate at Boardwalk Bowl"
      />

      <SectionReveal className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="glass-panel rounded-2xl p-6 lg:col-span-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Event office hours</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {EVENT_OFFICE_HOURS.map((h) => (
                <li key={h.day} className="flex justify-between gap-4 border-b border-white/5 py-1">
                  <span className="text-slate-500">{h.day}</span>
                  <span>{h.hours}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-500">Saturday office closes earlier — plan appointments accordingly.</p>
          </div>
          <div className="glass-panel rounded-2xl p-6 lg:col-span-2">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Downloads</h2>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <a
                className="font-semibold text-cyan-300 hover:text-cyan-200"
                href={BUSINESS.pdfEventGuide}
                target="_blank"
                rel="noreferrer"
              >
                Event Planning Guide (PDF)
              </a>
              <a
                className="font-semibold text-cyan-300 hover:text-cyan-200"
                href={BUSINESS.pdfPerfectGame}
                target="_blank"
                rel="noreferrer"
              >
                Perfect Game overview (PDF)
              </a>
              <a
                className="font-semibold text-cyan-300 hover:text-cyan-200"
                href={BUSINESS.pdfTeamBuilding}
                target="_blank"
                rel="noreferrer"
              >
                Team building packages (PDF)
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-600">
              Live site uses Tripleseat for bookings—swap iframe or links when production-ready.
            </p>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal variant="left" className="border-y border-white/10 bg-slate-950/50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center font-[family-name:var(--font-display)] text-3xl text-white">Pick your event style</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => {
              const cfg = EVENT_PAGES[c.slug];
              return (
                <Link
                  key={c.slug}
                  href={eventPath(c.slug)}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950 p-6 transition hover:-translate-y-1 hover:border-cyan-400/35"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-200">{cfg.shortTitle}</p>
                  <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-white">{cfg.title}</p>
                  <p className="mt-2 text-sm text-slate-500">{c.blurb}</p>
                  <span className="mt-4 inline-flex text-xs font-semibold text-slate-400 group-hover:text-white">
                    Details →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      <ScrapedOnPageGallery pageKey="parties" />

      <SectionReveal className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Tell us what you’re planning</h2>
            <p className="mt-2 text-sm text-slate-400">
              Demo inquiry form — replace with Tripleseat embed or CRM routing before launch.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li>Private spaces from Bridge receptions to full-lane takeovers</li>
              <li>Catering + bar packages with add-ons for dietary needs</li>
              <li>Attraction bundles — bowling, arcade, billiards</li>
            </ul>
            <ExpandableImage
              src={scrapedHero("parties", "/images/boardwalk/Boardwalk-Bowling-Bowling-Lanes-3-Jennifer-Halpern.jpg")}
              alt="Events at Boardwalk Bowl"
              sizes="(max-width:1024px) 100vw, 40vw"
              wrapperClassName="relative mt-8 h-48 w-full cursor-zoom-in overflow-hidden rounded-2xl border border-white/10"
            />
          </div>
          <DemoForm variant="event" />
        </div>
      </SectionReveal>

      <div className="border-t border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 py-12 text-center text-sm text-slate-500">
        Quick links:{" "}
        <Link className="font-semibold text-cyan-300" href={PATH.foodDrinks}>
          Catering
        </Link>{" "}
        ·{" "}
        <Link className="font-semibold text-cyan-300" href={PATH.contact}>
          Contact
        </Link>{" "}
        ·{" "}
        <a className="font-semibold text-cyan-300" href={BUSINESS.phoneTel}>
          {BUSINESS.phone}
        </a>
      </div>
    </>
  );
}
