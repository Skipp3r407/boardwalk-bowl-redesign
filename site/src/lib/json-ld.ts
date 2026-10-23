import { BUSINESS, HOURS_VENUE, UPCOMING_EVENTS } from "./site-data";
import { SITE_URL } from "./site-url";

const BUSINESS_ID = `${SITE_URL}/#business`;

const DAY_SCHEMA: Record<string, string> = {
  Monday: "https://schema.org/Monday",
  Tuesday: "https://schema.org/Tuesday",
  Wednesday: "https://schema.org/Wednesday",
  Thursday: "https://schema.org/Thursday",
  Friday: "https://schema.org/Friday",
  Saturday: "https://schema.org/Saturday",
  Sunday: "https://schema.org/Sunday",
};

/** "10am", "12am", "2am" -> "10:00", "00:00", "02:00" (closing times after midnight are allowed by schema.org). */
function to24h(t: string) {
  const m = t.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
  if (!m) return t;
  let h = Number(m[1]) % 12;
  if (m[3].toLowerCase() === "pm") h += 12;
  return `${String(h).padStart(2, "0")}:${m[2] ?? "00"}`;
}

const address = {
  "@type": "PostalAddress",
  streetAddress: BUSINESS.addressLine1,
  addressLocality: "Orlando",
  addressRegion: "FL",
  postalCode: "32817",
  addressCountry: "US",
};

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["BowlingAlley", "EntertainmentBusiness"],
    "@id": BUSINESS_ID,
    name: BUSINESS.name,
    alternateName: BUSINESS.legalName,
    description:
      "80-lane bowling and entertainment center in East Orlando with Brunswick Sync scoring, cosmic bowling, an arcade, billiards, Brooklyn South Bar & Grill, leagues, tournaments, birthday parties and The Bridge Event Center.",
    url: SITE_URL,
    image: [
      `${SITE_URL}/images/boardwalk/Boardwalk-Bowling-Front-View-Twilight-1536x1097.jpg`,
      `${SITE_URL}/images/boardwalk/Boardwalk-Bowling-Bowling-Lanes-3-Jennifer-Halpern.jpg`,
    ],
    logo: `${SITE_URL}/images/boardwalk/Logo.jpg`,
    telephone: "+1-407-384-0003",
    priceRange: "$",
    address,
    hasMap: BUSINESS.mapsUrl,
    areaServed: ["Orlando", "East Orlando", "Union Park", "UCF area", "Winter Park"],
    openingHoursSpecification: HOURS_VENUE.map((h) => {
      const [opens, closes] = h.hours.split("–").map((x) => to24h(x));
      return { "@type": "OpeningHoursSpecification", dayOfWeek: DAY_SCHEMA[h.day], opens, closes };
    }),
    amenityFeature: [
      "80 bowling lanes",
      "Brunswick Sync scoring",
      "Cosmic bowling",
      "Bumper lanes",
      "Arcade",
      "Billiards",
      "Bar & grill",
      "Private event center",
    ].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
    sameAs: [BUSINESS.social.facebook, BUSINESS.social.instagram, BUSINESS.social.twitter],
  };
}

export function eventsJsonLd() {
  return UPCOMING_EVENTS.map((e) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.name,
    description: e.detail,
    startDate: e.start,
    endDate: e.end,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [`${SITE_URL}${e.image}`],
    isAccessibleForFree: e.free,
    location: { "@type": "Place", name: BUSINESS.name, address },
    organizer: { "@type": "Organization", "@id": BUSINESS_ID, name: BUSINESS.name, url: SITE_URL },
    url: `${SITE_URL}/specials-events#${e.id}`,
  }));
}

export function faqJsonLd(items: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path === "/" ? "" : t.path}`,
    })),
  };
}
