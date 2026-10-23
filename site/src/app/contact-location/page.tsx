import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SectionReveal } from "@/components/SectionReveal";
import { DemoForm } from "@/components/forms/DemoForm";
import { TodaysHours } from "@/components/TodaysHours";
import { BUSINESS, HOURS_VENUE } from "@/lib/site-data";
import { PATH } from "@/lib/paths";
import { scrapedHero } from "@/lib/boardwalk-page-images";
import { ScrapedOnPageGallery } from "@/components/scraped/ScrapedOnPageGallery";

export const metadata: Metadata = pageMeta({
  title: "Directions, Hours & Contact: 10749 E Colonial Dr",
  description:
    "Find Boardwalk Bowl at 10749 East Colonial Drive, Orlando, FL 32817. Hours for every day, lane holds, holiday hours, phone 407-384-0003 and a contact form.",
  path: "/contact-location",
  image: "/images/boardwalk/2026/Boardwalk-Bowling-Front-View-Twilight-Jennifer-Halpern.jpg",
  imageAlt: "Front of Boardwalk Bowl at twilight",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="East Orlando · Colonial Drive"
        title="Let’s connect"
        subtitle="Parties, leagues, tournaments, or a quick question—reach the right team and we’ll point you forward."
        imageSrc={scrapedHero(
          "contact",
          "/images/boardwalk/Boardwalk-Bowling-Front-View-Twilight-1536x1097.jpg",
        )}
        imageAlt="Boardwalk Bowl exterior"
      />

      <SectionReveal className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-white">Visit</h2>
              <p className="mt-2 text-sm text-slate-300">{BUSINESS.fullAddress}</p>
              <p className="mt-2 text-xs text-slate-500">
                Easily accessible from SR-50 and the 417 with on-site parking (per live site).
              </p>
              <a
                href={BUSINESS.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-full bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950"
              >
                Open in Google Maps
              </a>
            </div>
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Phone</h3>
              <a className="mt-2 block text-2xl font-semibold text-cyan-300" href={BUSINESS.phoneTel}>
                {BUSINESS.phone}
              </a>
              <p className="mt-4 text-xs text-slate-500">
                Event-specific questions? Start on{" "}
                <Link className="font-semibold text-cyan-300" href={PATH.parties}>
                  Parties & Events
                </Link>
                .
              </p>
            </div>
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Today</h3>
              <div className="mt-2">
                <TodaysHours />
              </div>
              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-slate-400">Weekly hours</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-400">
                {HOURS_VENUE.map((h) => (
                  <li key={h.day} className="flex justify-between gap-4">
                    <span className="text-slate-500">{h.day}</span>
                    <span className="text-slate-200">{h.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-6">
            <DemoForm variant="contact" />
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <iframe
                title="Google Map - Boardwalk Bowl"
                className="h-80 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=10749%20East%20Colonial%20Drive%20Orlando%20FL%2032817&output=embed"
              />
            </div>
          </div>
        </div>
      </SectionReveal>

      <ScrapedOnPageGallery pageKey="contact" />
    </>
  );
}
