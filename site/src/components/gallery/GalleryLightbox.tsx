"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageLightboxModal } from "@/components/ui/ImageLightboxModal";

const IMAGES: { src: string; alt: string }[] = [
  { src: "/images/boardwalk/Boardwalk-Bowling-Front-View-Twilight-1536x1097.jpg", alt: "Boardwalk Bowl exterior" },
  { src: "/images/boardwalk/Boardwalk-Bowling-Bowling-Lanes-3-Jennifer-Halpern.jpg", alt: "Bowling lanes" },
  { src: "/images/boardwalk/Boardwalk-Bowling-Rental-Desk-Jennifer-Halpern-1.png", alt: "Guest services desk" },
  { src: "/images/boardwalk/UTA5487_WSM_4910-1.png", alt: "Bowling experience" },
  {
    src: "/images/boardwalk/wp-mirror/sites/2/2025/06/Boardwalk-Bowling-Brooklyn-South-Billards-Jennifer-Halpern.jpg",
    alt: "Billiards and lounge",
  },
  { src: "/images/boardwalk/Brooklyn-Food-Pic-1-300x226-1.jpg", alt: "Brooklyn South food" },
];

export function GalleryLightbox() {
  const [active, setActive] = useState<(typeof IMAGES)[number] | null>(null);

  return (
    <div>
      <p className="mb-4 text-xs text-slate-500">Click a photo to view it full size.</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {IMAGES.map((img) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setActive(img)}
            className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-xl border border-white/10 bg-slate-900 transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:border-cyan-400/45 hover:shadow-[0_16px_36px_-8px_rgba(34,211,238,0.28)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label={`Enlarge: ${img.alt}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover transition duration-500 group-hover:scale-110"
              sizes="(max-width:1024px) 100vw, 33vw"
            />
          </button>
        ))}
      </div>
      <ImageLightboxModal
        open={active !== null}
        src={active?.src ?? null}
        alt={active?.alt ?? ""}
        onClose={() => setActive(null)}
      />
    </div>
  );
}
