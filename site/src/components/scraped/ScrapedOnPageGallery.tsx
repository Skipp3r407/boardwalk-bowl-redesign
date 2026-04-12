"use client";

import Image from "next/image";
import { useState } from "react";
import { SectionReveal } from "@/components/SectionReveal";
import { ImageLightboxModal } from "@/components/ui/ImageLightboxModal";
import { scrapedGalleryUrls, type ScrapePageKey } from "@/lib/boardwalk-page-images";

export function ScrapedOnPageGallery({
  pageKey,
  title = "On the lanes & floor",
  subtitle = "Imagery referenced on the live Boardwalk Bowl page (mirrored locally).",
  max = 12,
}: {
  pageKey: ScrapePageKey;
  title?: string;
  subtitle?: string;
  max?: number;
}) {
  const urls = scrapedGalleryUrls(pageKey, max);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  if (urls.length === 0) return null;

  return (
    <SectionReveal className="border-t border-white/10 bg-slate-950/40 py-14">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white md:text-3xl">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        <p className="mt-1 text-xs text-slate-600">Click any photo to enlarge.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {urls.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => setLightbox({ src, alt: "" })}
              className="group/g relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-xl border border-white/10 bg-slate-900 text-left transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:border-cyan-400/45 hover:shadow-[0_16px_40px_-10px_rgba(34,211,238,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="View image larger"
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover transition duration-500 group-hover/g:scale-110"
                sizes="(max-width:1024px) 100vw, 33vw"
              />
            </button>
          ))}
        </div>
      </div>
      <ImageLightboxModal
        open={lightbox !== null}
        src={lightbox?.src ?? null}
        alt={lightbox?.alt ?? "Gallery image"}
        onClose={() => setLightbox(null)}
      />
    </SectionReveal>
  );
}
