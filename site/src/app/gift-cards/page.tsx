import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Shop } from "@/components/shop/Shop";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/json-ld";

export const metadata: Metadata = pageMeta({
  title: "Gift Cards & Arcade Game Cards",
  description:
    "Buy Boardwalk Bowl gift cards (emailed instantly, good for lanes, parties, food and arcade) and load arcade game card credits online with bonus credits.",
  path: "/gift-cards",
  image: "/images/boardwalk/2026/Boardwalk-Bowling-Boardwalk-Arcade-Jennifer-Halpern.jpg",
  imageAlt: "The Boardwalk Bowl arcade",
});

export default function GiftCardsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Gift & game cards", path: "/gift-cards" }])} />
      <PageHero
        eyebrow="Gift cards · arcade credits"
        title="Gift cards & game cards"
        subtitle="Send a gift card by email in a minute, or load arcade credits before you come and skip the kiosk line."
        imageSrc="/images/boardwalk/2026/Boardwalk-Bowling-Boardwalk-Arcade-Jennifer-Halpern.jpg"
        imageAlt="Neon arcade games at Boardwalk Bowl"
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Shop />
      </div>
    </>
  );
}
