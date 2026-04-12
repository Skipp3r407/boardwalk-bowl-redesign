"use client";

import { useId } from "react";

export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const baseId = useId();
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <details
          key={item.q}
          className="group rounded-xl border border-white/10 bg-slate-900/50 transition duration-200 open:border-cyan-500/25 open:bg-slate-900/80 hover:-translate-y-0.5 hover:border-cyan-400/35 hover:shadow-[0_8px_24px_-8px_rgba(34,211,238,0.15)]"
        >
          <summary className="cursor-pointer list-none px-4 py-4 text-sm font-semibold text-slate-100 transition duration-200 group-open:text-cyan-200 hover:text-cyan-100">
            <span className="flex items-center justify-between gap-3">
              {item.q}
              <span className="text-cyan-400/80 transition group-open:rotate-45">＋</span>
            </span>
          </summary>
          <div id={`${baseId}-${i}`} className="border-t border-white/5 px-4 pb-4 pt-2 text-sm leading-relaxed text-slate-400">
            {item.a}
          </div>
        </details>
      ))}
    </div>
  );
}
