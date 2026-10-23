import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { FaqAccordion } from "@/components/FaqAccordion";
import { BUSINESS, PARTY_TERMS } from "@/lib/site-data";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/json-ld";
import { PATH } from "@/lib/paths";
import { scrapedHero } from "@/lib/boardwalk-page-images";
import { ScrapedOnPageGallery } from "@/components/scraped/ScrapedOnPageGallery";

export const metadata: Metadata = pageMeta({
  title: "Bowling FAQ: Prices, Parties, Leagues & Lanes",
  description:
    "Answers about Boardwalk Bowl prices, shoe rental, reservations, birthday party packages, leagues, lane holds, cosmic bowling and Kids Bowl Free.",
  path: "/faq",
});

const items = [
  {
    q: "How do I book a party or corporate event?",
    a: "Use the online planner on the Book page: pick the event type, date, start time and headcount, and the events team confirms. Or call 407-384-0003, prompt 1.",
  },
  {
    q: "How much does bowling cost?",
    a: "Games are $4.75 (Mon–Fri open–5pm), $5.75 (weekends before 5pm and Sun–Thu evenings) or $7.50 (Fri & Sat after 5pm) per person. Lanes by the hour run $24, $35 or $45. Shoes are $5.",
  },
  {
    q: "How much is a kids’ birthday party?",
    a: `Fun + Pizza is $22.99 per child; Fun + Food + Arcade is $26.99 per child (adds a $5 arcade card and 500 tickets for the birthday child). Add 18% gratuity, 3% admin fee and tax; ${PARTY_TERMS.minGuests}-guest minimum.`,
  },
  {
    q: "When are lanes limited?",
    a: "Tuesday 6:30–9:30 pm (league, limited lanes), Thursday 6:30–9:30 pm (league, no open lanes), plus tournament and holiday dates listed on the Contact page.",
  },
  {
    q: "What are the daily specials?",
    a: "Monday 50% off hourly after 6pm, Twice on Tuesdays ($3 games, $2 shoes), Wine Down Wednesdays, Thursday College Knights ($3 games, shoes and drafts after 9:30pm), Cosmic Friday & Saturday ($15 all-you-can-bowl after 11pm), Sunday Fun Day.",
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
      <JsonLd data={[faqJsonLd(items), breadcrumbJsonLd([{ name: "FAQ", path: "/faq" }])]} />
      <PageHero
        eyebrow="Answers · shortcuts · next steps"
        title="Boardwalk Bowl FAQ"
        subtitle="Straight talk on how Boardwalk Bowl fits your night out, your league season, or your big event."
        align="center"
        imageSrc={scrapedHero(
          "contact",
          "/images/boardwalk/Boardwalk-Bowling-Front-View-Twilight-1536x1097.jpg",
        )}
        imageAlt="Boardwalk Bowl building on East Colonial Drive"
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
