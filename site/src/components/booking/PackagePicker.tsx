"use client";

import Link from "next/link";
import { useState } from "react";
import { PARTY_PACKAGES, PARTY_TERMS } from "@/lib/site-data";
import { money, partyEstimate } from "@/lib/booking";
import { PATH } from "@/lib/paths";

/** Side-by-side birthday packages with a live estimate (package x kids + gratuity + admin fee). */
export function PackagePicker({
  value,
  kids: kidsProp,
  onChange,
  compact = false,
}: {
  value?: string;
  kids?: number;
  onChange?: (packageId: string, kids: number) => void;
  compact?: boolean;
}) {
  const [own, setOwn] = useState<string>(PARTY_PACKAGES[1].id);
  const [ownKids, setOwnKids] = useState(12);
  const selected = value ?? own;
  const kids = kidsProp ?? ownKids;
  const est = partyEstimate(selected, kids);

  const pick = (id: string, n = kids) => {
    setOwn(id);
    setOwnKids(n);
    onChange?.(id, n);
  };

  return (
    <div className="glass-panel glass-panel-static rounded-2xl p-6 sm:p-8">
      {!compact && (
        <>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Birthday packages</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-white sm:text-4xl">Pick a package, see the total</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">{PARTY_TERMS.allPackages}</p>
        </>
      )}
      <div className={`grid gap-4 md:grid-cols-2 ${compact ? "" : "mt-6"}`} role="radiogroup" aria-label="Birthday package">
        {PARTY_PACKAGES.map((p) => {
          const on = p.id === selected;
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => pick(p.id)}
              className={`rounded-2xl border p-5 text-left transition ${
                on
                  ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_-8px_rgba(34,211,238,0.6)]"
                  : "border-white/10 bg-white/5 hover:border-cyan-400/40"
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">{p.name}</span>
                <span className="text-lg font-bold text-orange-200">
                  {money(p.pricePerChild)}
                  <span className="text-xs font-semibold text-slate-400"> / child</span>
                </span>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-slate-300">
                {p.includes.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-cyan-300" aria-hidden>
                      ✓
                    </span>
                    {i}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-5 rounded-2xl border border-white/10 bg-slate-950/50 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Kids at the party</p>
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              aria-label="Fewer kids"
              onClick={() => pick(selected, Math.max(1, kids - 1))}
              className="h-11 w-11 rounded-full border border-white/15 text-xl text-white hover:border-cyan-400/60"
            >
              −
            </button>
            <output className="w-10 text-center font-[family-name:var(--font-display)] text-3xl text-white" aria-live="polite">
              {kids}
            </output>
            <button
              type="button"
              aria-label="More kids"
              onClick={() => pick(selected, Math.min(60, kids + 1))}
              className="h-11 w-11 rounded-full border border-white/15 text-xl text-white hover:border-cyan-400/60"
            >
              +
            </button>
          </div>
          {kids < PARTY_TERMS.minGuests && (
            <p className="mt-2 text-xs text-amber-300">Minimum headcount is {PARTY_TERMS.minGuests}; priced for {PARTY_TERMS.minGuests}.</p>
          )}
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-300 sm:justify-self-end">
          <dt>
            {est.pkg.name} × {est.billed}
          </dt>
          <dd className="text-right">{money(est.base)}</dd>
          <dt>Gratuity (18%)</dt>
          <dd className="text-right">{money(est.gratuity)}</dd>
          <dt>Admin fee (3%)</dt>
          <dd className="text-right">{money(est.admin)}</dd>
          <dt className="border-t border-white/10 pt-2 font-bold text-white">Estimate before tax</dt>
          <dd className="border-t border-white/10 pt-2 text-right text-xl font-bold text-cyan-200">{money(est.total)}</dd>
        </dl>
      </div>
      <p className="mt-3 text-xs text-slate-500">{PARTY_TERMS.availability} Prices from the current Boardwalk Bowl birthday flyer; final quote from the party coordinator.</p>
      {!compact && (
        <Link
          href={`${PATH.book}?type=birthday`}
          className="mt-5 inline-block rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-xl shadow-orange-500/30 transition hover:brightness-110"
        >
          Request this party date
        </Link>
      )}
    </div>
  );
}
