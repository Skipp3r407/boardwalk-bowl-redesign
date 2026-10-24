import Link from "next/link";
import { BOWLING_FUN_COPY, BUSINESS } from "@/lib/site-data";
import { PATH } from "@/lib/paths";

export function TopCtaBar() {
  return (
    <div className="border-b border-amber-500/20 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2 text-xs sm:text-sm">
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <span className="text-lg leading-none opacity-90" aria-hidden>
            🎳
          </span>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-amber-200/70 sm:block">
              {BOWLING_FUN_COPY.topBar}
            </span>
            <a
              href={BUSINESS.phoneTel}
              className="font-semibold tracking-wide text-cyan-300 transition duration-200 hover:scale-105 hover:text-orange-200"
            >
              {BUSINESS.phone}
            </a>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:gap-3">
          <Link
            href={PATH.parties}
            className="hidden shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-2.5 py-1 sm:inline-flex text-[11px] font-semibold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)] transition duration-200 hover:scale-105 hover:brightness-110 hover:shadow-[0_0_28px_rgba(34,211,238,0.5)] sm:px-4 sm:text-sm"
          >
            Plan an Event
          </Link>
          <Link
            href={PATH.rentLane}
            className="inline-flex shrink-0 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-100 transition duration-200 hover:scale-105 hover:border-cyan-400/50 hover:bg-cyan-500/15 hover:text-cyan-50 sm:text-sm"
          >
            Rent a Lane
          </Link>
          <Link
            href={PATH.specialsEvents}
            className="hidden shrink-0 rounded-full border border-orange-400/30 sm:inline-flex bg-orange-500/10 px-2.5 py-1 text-[11px] font-medium text-orange-100 transition duration-200 hover:scale-105 hover:border-orange-400/55 hover:bg-orange-500/25 hover:shadow-[0_0_20px_-4px_rgba(251,146,60,0.4)] sm:text-sm"
          >
            View Specials
          </Link>
        </div>
      </div>
    </div>
  );
}
