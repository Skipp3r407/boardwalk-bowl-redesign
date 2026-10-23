import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { SectionReveal } from "@/components/SectionReveal";
import { SpecialsGrid } from "@/components/specials/SpecialsGrid";
import { BUSINESS, HOLIDAY_HOURS } from "@/lib/site-data";
import { TodaySpecial } from "@/components/specials/TodaySpecial";
import { UpcomingEvents } from "@/components/specials/UpcomingEvents";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, eventsJsonLd } from "@/lib/json-ld";
import { scrapedHero } from "@/lib/boardwalk-page-images";

export const metadata: Metadata = pageMeta({
  title: "Daily Specials & Upcoming Events in Orlando",
  description:
    "Today's bowling special, the full weekly lineup (Twice on Tuesdays, College Knights, Cosmic Fridays), happy hour, Latin Nights and upcoming events at Boardwalk Bowl.",
  path: "/specials-events",
  image: "/images/boardwalk/2026/October-2026-Latin-Night-Flyer.jpg",
  imageAlt: "Latin Nights Fridays flyer",
});

export default function SpecialsEventsPage() {
  return (
    <>
      <JsonLd data={[...eventsJsonLd(), breadcrumbJsonLd([{ name: "Specials & Events", path: "/specials-events" }])]} />
      <PageHero
        eyebrow="Weekly energy · seasonal hits"
        title="Daily specials & upcoming events"
        subtitle="Today’s deal, the whole week, and what’s coming up — typed out so you can read it on your phone without zooming into a flyer."
        align="center"
        imageSrc={scrapedHero(
          "specials",
          "/images/boardwalk/Boardwalk-Bowling-Bowling-Lanes-3-Jennifer-Halpern.jpg",
        )}
        imageAlt="Cosmic lights over the lanes at Boardwalk Bowl"
      />

      <SectionReveal className="mx-auto max-w-7xl px-4 pt-14">
        <h2 className="font-[family-name:var(--font-display)] text-4xl text-white">This week’s specials</h2>
        <div className="mt-6">
          <TodaySpecial />
        </div>
      </SectionReveal>

      <SectionReveal className="mx-auto max-w-7xl px-4 pt-14">
        <h2 className="font-[family-name:var(--font-display)] text-4xl text-white">Coming up</h2>
        <div className="mt-6">
          <UpcomingEvents />
        </div>
      </SectionReveal>

      <SectionReveal className="mx-auto max-w-7xl px-4 pt-14">
        <h2 className="font-[family-name:var(--font-display)] text-4xl text-white">Holiday hours</h2>
        <dl className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {HOLIDAY_HOURS.map((h) => (
            <div key={h.date} className="flex justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <dt className="text-slate-300">{h.date}</dt>
              <dd className="font-semibold text-cyan-200">{h.hours}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-xs text-slate-500">Extended holiday hours Dec 21 – Jan 4: weekdays open 10 AM, weekends open 9 AM.</p>
      </SectionReveal>

      <SectionReveal className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-[family-name:var(--font-display)] text-4xl text-white">All flyers</h2>
        <p className="mt-2 text-sm text-slate-500">
          Graphics sourced from the live Specials & Events page. Tournament and league holds may still affect lane availability—call{" "}
          <a className="font-semibold text-cyan-300" href={BUSINESS.phoneTel}>
            {BUSINESS.phone}
          </a>{" "}
          before you head over.
        </p>
        <div className="mt-8">
          <SpecialsGrid />
        </div>
      </SectionReveal>

    </>
  );
}
