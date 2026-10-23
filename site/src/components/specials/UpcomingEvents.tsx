import Image from "next/image";
import { UPCOMING_EVENTS } from "@/lib/site-data";

/** Dated events as real text (readable by Google and screen readers), each with its flyer. */
export function UpcomingEvents() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {UPCOMING_EVENTS.map((e) => (
        <article id={e.id} key={e.id} className="glass-panel grid scroll-mt-28 overflow-hidden rounded-2xl sm:grid-cols-[160px_1fr]">
          <div className="relative h-56 sm:h-full">
            <Image src={e.image} alt={`${e.name} flyer`} fill className="object-cover" sizes="(max-width:640px) 100vw, 160px" />
          </div>
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">{e.when}</p>
            <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">{e.name}</h3>
            <p className="mt-2 text-sm text-slate-300">{e.detail}</p>
            {e.free && <p className="mt-2 inline-block rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">Free to attend</p>}
          </div>
        </article>
      ))}
    </div>
  );
}
