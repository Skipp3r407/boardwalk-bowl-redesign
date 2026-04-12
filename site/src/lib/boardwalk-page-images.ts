import raw from "./boardwalk-page-images.json";

/** Keys match pages crawled on alomabowlingcenters.com/boardwalk/ */
export type ScrapePageKey = keyof typeof raw;

const AS_ANY = raw as Record<string, string[]>;

const EXCLUDE_SUBSTR = [
  "Airport-logo",
  "Aloma-logo",
  "/Logo.jpg",
  "Logo-1024",
  "Logo-300",
  "Logo-768",
  "brooklyn-south-logo",
  "Taco-Tango-Transparent",
];

export function scrapedUrlsFor(key: ScrapePageKey): string[] {
  const arr = AS_ANY[key as string];
  if (!Array.isArray(arr)) return [];
  return arr.filter((u) => !EXCLUDE_SUBSTR.some((s) => u.includes(s)));
}

/** Prefer originals (no -123x456 before extension). */
export function scrapedFullSizeUrls(key: ScrapePageKey): string[] {
  return scrapedUrlsFor(key).filter((u) => {
    const leaf = u.split("/").pop() || "";
    return !/-\d+x\d+\.(jpg|jpeg|png|webp)$/i.test(leaf);
  });
}

/** Pick a hero image that mirrors what the live site emphasizes per section. */
export function scrapedHero(key: ScrapePageKey, fallback: string): string {
  const full = scrapedFullSizeUrls(key);
  const patterns: RegExp[] = [
    /Front-View-Twilight\.(jpg|jpeg)$/i,
    /Boardwalk-Bowling-Bowling-Lanes-3/i,
    /Boardwalk-Bowling-Boardwalk-Arcade/i,
    /Arcade-Kids-Pic-scaled/i,
    /Brooklyn-South-Billards(?!.*-\d+x\d+)/i,
    /bigstock-Red-Felt-Billiard/i,
    /Boardwalk--scaled\.jpg$/i,
    /688755-Kids-Bowl-Free/i,
    /New-Kids-Bowl-Free-Participating-Center-Poster\.jpg$/i,
    /Boardwalk-Bowling-Floor-Bar\.jpg$/i,
    /Brooklyn-South-Menu.*-scaled\.jpg$/i,
    /fundraiser-pics\.jpg$/i,
    /teen-girl-pic\.jpg$/i,
    /BWB-teen-party\.jpg$/i,
    /kids-bday-pic\.jpg$/i,
    /BWB-Birthday_Page_1-scaled/i,
    /quinceanera\.jpg$/i,
    /sweet-16\.jpg$/i,
    /Graduation-headquarters-flyer\.jpeg$/i,
    /team-party--scaled/i,
    /corp-pic/i,
    /corporate-pic/i,
    /BWB-youth-team-party_Page_1\.jpg$/i,
    /BWB-Schools-Daycare-Camps-scaled/i,
    /PBandJStudios/i,
    /the-bridge-logo-transparent\.png$/i,
    /BS-blk-bridge-transparency/i,
    /League-photo\.jpg$/i,
    /AEC-Join-a-League-Benefits/i,
    /2026-Boardwalk-summer-schedule-1-scaled/i,
    /boardwalk-0740-Copy-1-scaled/i,
    /Boardwalk-Young_Professional2/i,
  ];
  for (const pat of patterns) {
    const hit = full.find((u) => pat.test(u));
    if (hit) return hit;
  }
  const anyPhoto = full.find((u) => /\.(jpg|jpeg|png|webp)$/i.test(u));
  return anyPhoto || scrapedUrlsFor(key)[0] || fallback;
}

export function scrapedGalleryUrls(key: ScrapePageKey, max = 14): string[] {
  const full = scrapedFullSizeUrls(key);
  const merged = full.length > 0 ? full : scrapedUrlsFor(key);
  const sized = merged.filter((u) => {
    const leaf = u.split("/").pop() || "";
    return !/-(150x150|200x200|200x300|232x300|233x300|300x200|300x212|300x214|300x225|300x231)\./i.test(leaf);
  });
  const list = sized.length > 0 ? sized : merged;
  return list.slice(0, max);
}

export const EVENT_SLUG_TO_SCRAPE_KEY: Record<string, ScrapePageKey> = {
  "the-bridge-event-center": "bridge",
  "kids-birthday-parties": "kidsParty",
  "teen-parties": "teen",
  "company-parties-team-building": "company",
  "sweet-16-quinceanera-parties": "sweet",
  "graduation-parties": "grad",
  fundraising: "fund",
  "schools-daycares": "schools",
  "youth-team-parties": "youth",
};
