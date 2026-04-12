"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ImageLightboxModal } from "@/components/ui/ImageLightboxModal";
import { FLYERS, type Flyer } from "@/lib/flyers";

const categories: { id: Flyer["category"] | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "featured", label: "Featured" },
  { id: "nightlife", label: "Nightlife" },
  { id: "seasonal", label: "Seasonal" },
  { id: "community", label: "Community" },
];

export function SpecialsGrid() {
  const [cat, setCat] = useState<(typeof categories)[number]["id"]>("all");
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const list = useMemo(
    () => (cat === "all" ? FLYERS : FLYERS.filter((f) => f.category === cat)),
    [cat],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
              cat === c.id
                ? "bg-cyan-500 text-slate-950"
                : "border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/30"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-600">Click a flyer image to view it larger.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((f) => (
          <div
            key={f.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 transition hover:border-cyan-500/25"
          >
            <button
              type="button"
              onClick={() => setLightbox({ src: f.image, alt: f.alt })}
              className="relative block h-72 w-full cursor-zoom-in overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              aria-label={`Enlarge flyer: ${f.title}`}
            >
              <Image src={f.image} alt={f.alt} fill className="object-cover transition hover:scale-105" sizes="(max-width:1024px) 100vw, 33vw" />
            </button>
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">{f.category}</p>
              <p className="font-[family-name:var(--font-display)] text-xl text-white">{f.title}</p>
            </div>
          </div>
        ))}
      </div>
      <ImageLightboxModal
        open={lightbox !== null}
        src={lightbox?.src ?? null}
        alt={lightbox?.alt ?? ""}
        onClose={() => setLightbox(null)}
      />
    </div>
  );
}
