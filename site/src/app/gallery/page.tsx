import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { scrapedHero } from "@/lib/boardwalk-page-images";
import { ScrapedOnPageGallery } from "@/components/scraped/ScrapedOnPageGallery";

export const metadata: Metadata = pageMeta({
  title: "Photo Gallery: Lanes, Arcade, Bar & Events",
  description:
    "Photos of Boardwalk Bowl in Orlando: 80 lanes, the arcade, billiards room, Brooklyn South bar, The Bridge Event Center and parties.",
  path: "/gallery",
  image: "/images/boardwalk/2026/100_0099-Jennifer-Halpern-scaled.jpg",
  imageAlt: "Inside Boardwalk Bowl",
});

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Lanes · lights · bites"
        title="Gallery"
        subtitle="A quick visual pass across the property—swap in professional shoots or user-generated content anytime."
        align="center"
        imageSrc={scrapedHero(
          "home",
          "/images/boardwalk/Boardwalk-Bowling-Front-View-Twilight-1536x1097.jpg",
        )}
        imageAlt="Boardwalk Bowl"
      />
      <div className="mx-auto max-w-7xl px-4 py-14">
        <GalleryLightbox />
      </div>

      <ScrapedOnPageGallery
        pageKey="home"
        title="More from the live homepage"
        subtitle="Additional images mirrored from alomabowlingcenters.com/boardwalk/."
      />
    </>
  );
}
