import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SpecialsGrid } from "@/components/specials/SpecialsGrid";
import { PATH } from "@/lib/paths";
import { scrapedHero } from "@/lib/boardwalk-page-images";
import { ScrapedOnPageGallery } from "@/components/scraped/ScrapedOnPageGallery";

export const metadata: Metadata = pageMeta({
  title: "Deals & Promotions: Fun Pack, Winter Pass, Gift Cards",
  description:
    "Current Boardwalk Bowl deals: Friends & Family Fun Pack $59.99 a lane, Winter Pass $14, Black Friday and holiday gift card bonuses.",
  path: "/promotions",
  image: "/images/boardwalk/2026/FFFP-new-scaled.jpg",
  imageAlt: "Friends and Family Fun Pack flyer",
});

export default function PromotionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Deals · nights · limited runs"
        title="Promotions"
        subtitle="A landing page you can point paid media toward—same library as Specials & Events with CTA clarity."
        align="center"
        imageSrc={scrapedHero(
          "specials",
          "/images/boardwalk/Boardwalk-Bowling-Bowling-Lanes-3-Jennifer-Halpern.jpg",
        )}
        imageAlt="Boardwalk Bowl promotions"
      />
      <div className="mx-auto max-w-7xl px-4 py-14">
        <p className="text-sm text-slate-400">
          Looking for league or party promos? Jump to{" "}
          <Link className="font-semibold text-cyan-300" href={PATH.bowlingLeagues}>
            Leagues
          </Link>{" "}
          or{" "}
          <Link className="font-semibold text-cyan-300" href={PATH.parties}>
            Parties
          </Link>
          .
        </p>
        <div className="mt-8">
          <SpecialsGrid />
        </div>
      </div>

      <ScrapedOnPageGallery pageKey="specials" title="Promotion graphics (live site mirror)" />
    </>
  );
}
