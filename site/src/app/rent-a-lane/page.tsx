import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { LaneRental } from "@/components/lanes/LaneRental";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/json-ld";
import { BUSINESS } from "@/lib/site-data";
import { PATH } from "@/lib/paths";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = pageMeta({
  title: "Rent a Bowling Lane Online in Orlando",
  description:
    "Reserve a lane at Boardwalk Bowl in under a minute: pick a day, group size and start time, see which of the 80 lanes are open, choose your lanes and pay online.",
  path: "/rent-a-lane",
  image: "/images/boardwalk/Boardwalk-Bowling-Bowling-Lanes-3-Jennifer-Halpern.jpg",
  imageAlt: "Open bowling lanes at Boardwalk Bowl",
});

const faq = [
  {
    q: "How many people fit on one lane?",
    a: "Up to 6 bowlers per lane. The booking picks the number of lanes for your group, and you can add more.",
  },
  {
    q: "How much does a lane cost?",
    a: "Lanes are $24 an hour Monday–Friday before 5pm, $35 on weekends before 5pm and Sunday–Thursday evenings, and $45 Friday and Saturday after 5pm. Shoes are $5.",
  },
  {
    q: "Why can't I book Thursday evening?",
    a: "Thursday 6:30–9:30pm is league night with no open lanes, and Tuesday league night has limited lanes. Tournament days and holidays are blocked too.",
  },
  {
    q: "What if we're running late?",
    a: `Lanes are held for 15 minutes past your start time. Call ${BUSINESS.phone} if you need more time.`,
  },
];

const offerJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Bowling lane rental",
  serviceType: "Bowling lane reservation",
  provider: { "@id": `${SITE_URL}/#business` },
  areaServed: "Orlando, FL",
  offers: [
    { "@type": "Offer", name: "Lane per hour, Mon–Fri open–5pm", price: "24.00", priceCurrency: "USD" },
    { "@type": "Offer", name: "Lane per hour, weekends open–5pm and Sun–Thu evenings", price: "35.00", priceCurrency: "USD" },
    { "@type": "Offer", name: "Lane per hour, Fri & Sat after 5pm", price: "45.00", priceCurrency: "USD" },
  ],
  potentialAction: { "@type": "ReserveAction", target: `${SITE_URL}/rent-a-lane` },
};

export default function RentALanePage() {
  return (
    <>
      <JsonLd data={[offerJsonLd, faqJsonLd(faq), breadcrumbJsonLd([{ name: "Rent a lane", path: "/rent-a-lane" }])]} />
      <PageHero
        eyebrow="80 lanes · live availability"
        title="Rent a lane"
        subtitle="Pick a day and time, see which lanes are open right now, tap your lanes, done. Parties and big groups: use the party planner."
        imageSrc="/images/boardwalk/Boardwalk-Bowling-Bowling-Lanes-3-Jennifer-Halpern.jpg"
        imageAlt="Rows of bowling lanes at Boardwalk Bowl"
      />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <LaneRental />
        <p className="mt-2 text-center text-sm text-slate-500">
          Birthday, company or group event?{" "}
          <Link className="font-semibold text-cyan-300" href={`${PATH.book}?type=birthday`}>
            Plan a party instead
          </Link>
          .
        </p>
        <h2 className="mt-14 font-[family-name:var(--font-display)] text-3xl text-white">Lane rental questions</h2>
        <div className="mt-6">
          <FaqAccordion items={faq} />
        </div>
      </div>
    </>
  );
}
