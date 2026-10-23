import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { SectionReveal } from "@/components/SectionReveal";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/json-ld";
import { FaqAccordion } from "@/components/FaqAccordion";
import { BUSINESS, FUN_PACK, PARTY_TERMS } from "@/lib/site-data";

export const metadata: Metadata = pageMeta({
  title: "Book Lanes or a Party Online",
  description:
    "Request bowling lanes, a kids’ birthday party, a company event or a league spot at Boardwalk Bowl in Orlando. Pick a date, time and guest count and see the price estimate.",
  path: "/book",
  image: "/images/boardwalk/2026/Kids-bday-pic-5-scaled.jpg",
  imageAlt: "Kids celebrating a birthday party at Boardwalk Bowl",
});

const faq = [
  {
    q: "Can I reserve lanes ahead of time?",
    a: `Yes. Send a lane request with your date, start time and group size and the front desk confirms it. Walk-in open bowling is first come, first served, and the ${FUN_PACK.price} Fun Pack is walk-in only.`,
  },
  {
    q: "How much is a birthday party?",
    a: `Fun + Pizza is $22.99 per child and Fun + Food + Arcade is $26.99 per child, plus 18% gratuity, 3% admin fee and tax, with a ${PARTY_TERMS.minGuests}-guest minimum. The planner shows the estimate as you change the headcount.`,
  },
  {
    q: "When are lanes limited?",
    a: "League nights (Tuesday 6:30–9:30 pm limited lanes, Thursday 6:30–9:30 pm no open lanes), high school tournaments and holidays. The planner flags these as you pick a time.",
  },
  {
    q: "Is my booking confirmed right away?",
    a: `It's a request. The team confirms by phone, text or email. Need it today? Call ${BUSINESS.phone}.`,
  },
];

export default function BookPage() {
  return (
    <>
      <JsonLd data={[faqJsonLd(faq), breadcrumbJsonLd([{ name: "Book online", path: "/book" }])]} />
      <PageHero
        eyebrow="Lanes · parties · events · leagues"
        title="Book Boardwalk Bowl online"
        subtitle="Pick what you're planning, choose a day and time, see the price, done. About a minute."
        imageSrc="/images/boardwalk/2026/100_0099-Jennifer-Halpern-scaled.jpg"
        imageAlt="Bowling lanes inside Boardwalk Bowl"
      />
      <SectionReveal className="mx-auto max-w-5xl px-4 py-12">
        <Suspense fallback={<div className="glass-panel h-96 animate-pulse rounded-3xl" />}>
          <BookingFlow />
        </Suspense>
      </SectionReveal>
      <SectionReveal className="mx-auto max-w-3xl px-4 pb-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Booking questions</h2>
        <div className="mt-6">
          <FaqAccordion items={faq} />
        </div>
      </SectionReveal>
    </>
  );
}
