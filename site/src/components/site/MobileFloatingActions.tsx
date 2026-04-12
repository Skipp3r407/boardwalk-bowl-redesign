"use client";

import Link from "next/link";
import { BUSINESS } from "@/lib/site-data";
import { PATH } from "@/lib/paths";

export function MobileFloatingActions() {
  return (
    <div className="pointer-events-none fixed bottom-4 left-0 right-0 z-[70] flex justify-center px-3 lg:hidden">
      <div className="pointer-events-auto flex max-w-md flex-1 items-center justify-between gap-2 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-cyan-500/10 backdrop-blur-md">
        <a
          href={BUSINESS.phoneTel}
          className="flex flex-1 flex-col items-center rounded-xl bg-cyan-500/15 px-2 py-2 text-center text-[11px] font-bold text-cyan-100 transition duration-200 hover:scale-105 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_-4px_rgba(34,211,238,0.45)]"
        >
          <span className="text-lg">📞</span>
          Call now
        </a>
        <a
          href={BUSINESS.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 flex-col items-center rounded-xl bg-white/5 px-2 py-2 text-center text-[11px] font-semibold text-slate-100 transition duration-200 hover:scale-105 hover:bg-white/10 hover:text-cyan-100"
        >
          <span className="text-lg">📍</span>
          Directions
        </a>
        <Link
          href={PATH.parties}
          className="flex flex-1 flex-col items-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 px-2 py-2 text-center text-[11px] font-bold text-white transition duration-200 hover:scale-105 hover:shadow-[0_0_24px_-4px_rgba(251,146,60,0.55)]"
        >
          <span className="text-lg">🎉</span>
          Book event
        </Link>
      </div>
    </div>
  );
}
