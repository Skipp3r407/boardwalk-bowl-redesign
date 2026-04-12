"use client";

import Image from "next/image";
import { useState } from "react";
import { FLYERS } from "@/lib/flyers";
import { ImageLightboxModal } from "@/components/ui/ImageLightboxModal";

export function HomeFlyerTiles() {
  const [active, setActive] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FLYERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActive({ src: f.image, alt: f.alt })}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 text-left transition duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-cyan-400/45 hover:shadow-xl hover:shadow-cyan-500/15"
          >
            <div className="relative h-64 w-full">
              <Image
                src={f.image}
                alt={f.alt}
                fill
                className="object-cover transition duration-500 group-hover:scale-110"
                sizes="(max-width:1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-200">{f.category}</p>
                <p className="font-[family-name:var(--font-display)] text-xl text-white">{f.title}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <ImageLightboxModal
        open={active !== null}
        src={active?.src ?? null}
        alt={active?.alt ?? ""}
        onClose={() => setActive(null)}
      />
    </>
  );
}
