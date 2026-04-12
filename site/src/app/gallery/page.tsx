import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { scrapedHero } from "@/lib/boardwalk-page-images";
import { ScrapedOnPageGallery } from "@/components/scraped/ScrapedOnPageGallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photo gallery of Boardwalk Bowl — exterior, lanes, food, and experiences in Orlando.",
};

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
