"use client";

import { useSyncExternalStore } from "react";
import { DAILY_SPECIALS, HAPPY_HOUR } from "@/lib/site-data";

const subscribe = () => () => {};
const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** The whole week of specials with today's card lit up (today is read on the client, so the static page stays cacheable). */
export function TodaySpecial() {
  const today = useSyncExternalStore(subscribe, () => new Date().getDay(), () => -1);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {DAILY_SPECIALS.map((s) => {
          const on = s.day === today;
          return (
            <article
              key={s.day}
              className={`relative rounded-2xl border p-5 transition ${
                on ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_40px_-10px_rgba(34,211,238,0.7)] lg:col-span-2" : "border-white/10 bg-white/5"
              }`}
            >
              {on && (
                <span className="absolute right-4 top-4 rounded-full bg-cyan-400 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-950">
                  Today
                </span>
              )}
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">{DAY[s.day]}</p>
              <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">{s.name}</h3>
              <p className="text-sm font-semibold text-orange-200">{s.time}</p>
              <ul className="mt-3 space-y-1 text-sm text-slate-300">
                {s.deals.map((d) => (
                  <li key={d}>• {d}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
      <div className="mt-4 rounded-2xl border border-fuchsia-400/25 bg-fuchsia-500/10 p-5 text-sm text-slate-200">
        <span className="font-[family-name:var(--font-display)] text-xl tracking-wide text-white">Happy hour · {HAPPY_HOUR.when}</span>
        <span className="block text-slate-300">{HAPPY_HOUR.deals.join(" · ")}</span>
        <span className="mt-1 block text-xs text-slate-400">{HAPPY_HOUR.allDay}</span>
      </div>
    </div>
  );
}
