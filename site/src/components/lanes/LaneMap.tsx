"use client";

import { TOTAL_LANES } from "@/lib/lanes";

/** Ten pins in the usual triangle, drawn from the bowler's view (head pin at the bottom). */
function Pins({ lit }: { lit: boolean }) {
  const rows = [[0], [-1, 1], [-2, 0, 2], [-3, -1, 1, 3]];
  return (
    <svg viewBox="-4 -1 8 5" className="h-6 w-full" aria-hidden>
      {rows.map((r, y) =>
        r.map((x) => (
          <circle
            key={`${x}${y}`}
            cx={x}
            cy={3.4 - y}
            r={0.62}
            fill={lit ? "#ffffff" : "#64748b"}
            stroke={lit ? "#f43f5e" : "none"}
            strokeWidth={0.18}
          />
        )),
      )}
    </svg>
  );
}

/**
 * The 80 lanes as a horizontal strip of real-looking lanes: pin deck, wood with target arrows, gutters, lane number on
 * the ball return. Busy lanes are dimmed; picked lanes light up with pins standing.
 */
export function LaneMap({
  busy,
  selected,
  onToggle,
}: {
  busy: Set<number>;
  selected: number[];
  onToggle: (lane: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#070b16] p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-400">
        <span className="font-semibold uppercase tracking-[0.2em] text-slate-300">Lanes 1–{TOTAL_LANES} · tap to pick</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <i className="inline-block h-3 w-3 rounded-sm bg-gradient-to-b from-amber-200 to-amber-500" /> Open
          </span>
          <span className="flex items-center gap-1">
            <i className="inline-block h-3 w-3 rounded-sm bg-slate-700" /> In use
          </span>
          <span className="flex items-center gap-1">
            <i className="inline-block h-3 w-3 rounded-sm bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" /> Yours
          </span>
        </span>
      </div>
      <div className="lane-scroll flex gap-[3px] overflow-x-auto pb-2" role="group" aria-label="Lane map">
        {Array.from({ length: TOTAL_LANES }, (_, i) => i + 1).map((n) => {
          const isBusy = busy.has(n);
          const mine = selected.includes(n);
          return (
            <button
              key={n}
              type="button"
              disabled={isBusy}
              onClick={() => onToggle(n)}
              aria-pressed={mine}
              aria-label={`Lane ${n}${isBusy ? ", in use" : mine ? ", selected" : ", open"}`}
              data-lane={n}
              className={`group relative flex w-9 shrink-0 flex-col items-stretch rounded-md border-x-[3px] border-[#1b2233] transition ${
                isBusy ? "cursor-not-allowed opacity-45" : "cursor-pointer hover:-translate-y-0.5"
              } ${mine ? "shadow-[0_0_18px_rgba(34,211,238,0.85)] ring-2 ring-cyan-300" : ""}`}
            >
              <span className={`rounded-t-sm px-0.5 pt-1 ${mine ? "bg-slate-900" : "bg-[#0d1322]"}`}>
                <Pins lit={mine || !isBusy} />
              </span>
              <span
                className={`relative h-40 sm:h-48 ${
                  isBusy ? "bg-slate-700" : ""
                }`}
                style={{
                  backgroundImage: isBusy
                    ? undefined
                    : `repeating-linear-gradient(90deg, rgba(120,53,15,.18) 0 2px, transparent 2px 6px), linear-gradient(to bottom, ${mine ? "#a5f3fc, #fde68a, #fbbf24" : "#fef3c7, #fcd34d, #f59e0b"})`,
                }}
              >
                {/* target arrows */}
                <span className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-[3px]">
                  {[0, 1, 2].map((k) => (
                    <i key={k} className={`block h-0 w-0 border-x-[3px] border-b-[6px] border-x-transparent ${isBusy ? "border-b-slate-500" : "border-b-amber-800/70"}`} />
                  ))}
                </span>
                {isBusy && <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[8px] font-bold leading-tight text-slate-400">IN<br />USE</span>}
              </span>
              <span
                className={`rounded-b-sm py-1 text-center text-[11px] font-bold ${
                  mine ? "bg-cyan-400 text-slate-950" : "bg-slate-900 text-slate-300"
                }`}
              >
                {n}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
