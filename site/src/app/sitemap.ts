import type { MetadataRoute } from "next";
import { PATH } from "@/lib/paths";
import { SITE_URL } from "@/lib/site-url";

const PRIORITY: Partial<Record<string, number>> = {
  [PATH.home]: 1,
  [PATH.book]: 0.9,
  [PATH.rentLane]: 0.95,
  [PATH.giftCards]: 0.85,
  [PATH.bowling]: 0.9,
  [PATH.parties]: 0.9,
  [PATH.partiesKids]: 0.9,
  [PATH.specialsEvents]: 0.8,
  [PATH.bowlingLeagues]: 0.8,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [...new Set(Object.values(PATH))].map((p) => ({
    url: `${SITE_URL}${p === "/" ? "" : p}`,
    lastModified,
    changeFrequency: p === PATH.specialsEvents ? "weekly" : "monthly",
    priority: PRIORITY[p] ?? 0.6,
  }));
}
