import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { FaqAccordion } from "@/components/FaqAccordion";
import { BUSINESS } from "@/lib/site-data";
import { PATH } from "@/lib/paths";
import { scrapedHero } from "@/lib/boardwalk-page-images";
import { ScrapedOnPageGallery } from "@/components/scraped/ScrapedOnPageGallery";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Boardwalk Bowl in Orlando — bowling, parties, hours, and policies.",
};

const items = [
  {
    q: "How do I book a party or corporate event?",
    a: "Start on the Parties & Events hub—each category links to details. For white-glove planning, call the events line or submit an inquiry form.",
  },
  {
    q: "What’s the difference between per-game and per-lane hourly pricing?",
    a: "Per-game rates are priced per guest per game; hourly rates are priced per lane per hour—pick whichever matches how your group bowls.",
  },
  {
    q: "Are shoes required?",
    a: "Rental shoes are available—pricing is listed on the Bowling page alongside open play rates.",
  },
  {
    q: "Can we bring outside food?",
    a: "Outside food and beverages are not permitted, including personal drink containers—Brooklyn South supports lane-side dining and event catering.",
  },
  {
    q: "How do I reach a human fast?",
    a: `Call ${BUSINESS.phone} for lane availability, same-day questions, or event desk routing.`,
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Answers · shortcuts · next steps"
        title="FAQ"
        subtitle="Straight talk on how Boardwalk Bowl fits your night out, your league season, or your big event."
        align="center"
        imageSrc={scrapedHero(
          "contact",
          "/images/boardwalk/Boardwalk-Bowling-Front-View-Twilight-1536x1097.jpg",
        )}
        imageAlt="Boardwalk Bowl"
      />
      <div className="mx-auto max-w-3xl px-4 py-14">
        <FaqAccordion items={items} />
        <p className="mt-8 text-center text-sm text-slate-500">
          Still stuck?{" "}
          <Link className="font-semibold text-cyan-300" href={PATH.contact}>
            Contact the house
          </Link>
          .
        </p>
      </div>

      <ScrapedOnPageGallery pageKey="contact" title="Venue photos" />
    </>
  );
}
