import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SectionReveal } from "@/components/SectionReveal";
import { DemoForm } from "@/components/forms/DemoForm";
import { BUSINESS } from "@/lib/site-data";
import { PATH } from "@/lib/paths";
import { scrapedHero } from "@/lib/boardwalk-page-images";
import { ScrapedOnPageGallery } from "@/components/scraped/ScrapedOnPageGallery";

export const metadata: Metadata = pageMeta({
  title: "Bowling Tournaments in Orlando: Host or Compete",
  description:
    "Bowling tournaments at Boardwalk Bowl, the largest bowling center in the Southeast with 80 lanes. Upcoming hosted events and how to book your tournament.",
  path: "/tournaments",
  image: "/images/boardwalk/2026/100_0400-Jennifer-Halpern-scaled.jpg",
  imageAlt: "Tournament bowlers at Boardwalk Bowl",
});

const hosted = [
  "PBA National and Regional Tour Stops",
  "PWBA National and Regional Tournaments",
  "FHSAA High School State Finals",
  "TNBA Summer Tournaments",
  "USBC Local and State Championships",
];

export default function TournamentsPage() {
  return (
    <>
      <PageHero
        eyebrow="Elite play · organizer-friendly"
        title="Tournament venue built for crowds"
        subtitle="Eighty Brunswick lanes split 48/32 for flexible formats, a concourse built for spectators, and the amenities organizers need backstage."
        imageSrc={scrapedHero(
          "tournaments",
          "/images/boardwalk/Boardwalk-Bowling-Bowling-Lanes-3-Jennifer-Halpern.jpg",
        )}
        imageAlt="Tournament-ready bowling lanes"
        align="center"
      />

      <SectionReveal className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-3">
          {[
            {
              title: "Lane field",
              body: "Two distinct sections—scale up for nationals or down for specialty formats without losing energy.",
            },
            {
              title: "Spectator flow",
              body: "Expansive concourse—bleacher options for crowds without squeezing player movement.",
            },
            {
              title: "Ops & hospitality",
              body: "Food and beverage service, meeting rooms, tournament offices, and storage for gear (per live site).",
            },
          ].map((c) => (
            <div key={c.title} className="glass-panel rounded-2xl p-6">
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-white">{c.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{c.body}</p>
            </div>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal variant="left" className="border-y border-white/10 bg-slate-950/60 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Trusted for major events</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {hosted.map((h) => (
              <li key={h} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                {h}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-slate-500">
            Check the live Boardwalk Bowl site and social channels for upcoming registration windows.
          </p>
        </div>
      </SectionReveal>

      <ScrapedOnPageGallery pageKey="tournaments" />

      <SectionReveal className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Host your tournament</h2>
            <p className="mt-3 text-slate-400">
              Share dates, format, and spectator expectations—we’ll follow up with availability and production notes.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={BUSINESS.phoneTel} className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-950">
                Call {BUSINESS.phone}
              </a>
              <Link href={PATH.contact} className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white">
                Venue questions
              </Link>
            </div>
            <p className="mt-6 text-xs text-slate-600">
              Downloadable tournament packet can plug in here—placeholder for pitch.
            </p>
          </div>
          <DemoForm variant="event" />
        </div>
      </SectionReveal>
    </>
  );
}
