"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { LaneMap } from "@/components/lanes/LaneMap";
import { formatTime, icsFile, money } from "@/lib/booking";
import {
  MAX_PER_LANE,
  TOTAL_LANES,
  bookingCode,
  busyLanes,
  laneQuote,
  loadBookings,
  saveBooking,
  slotsWithAvailability,
  suggestLanes,
  type SavedBooking,
} from "@/lib/lanes";
import { BUSINESS } from "@/lib/site-data";
import { PATH } from "@/lib/paths";

const subscribe = () => () => {};
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const inputCls =
  "mt-1 w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2.5 text-base text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none sm:text-sm";

function StepTitle({ n, title, done }: { n: number; title: string; done?: boolean }) {
  return (
    <h2 className="flex items-center gap-3 font-[family-name:var(--font-display)] text-2xl tracking-wide text-white sm:text-3xl">
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-base ${
          done ? "bg-cyan-400 text-slate-950" : "border border-white/20 text-slate-300"
        }`}
      >
        {done ? "✓" : n}
      </span>
      {title}
    </h2>
  );
}

export function LaneRental() {
  const today = useSyncExternalStore(subscribe, () => iso(new Date()), () => "");
  const days = useMemo(() => {
    if (!today) return [];
    const [y, m, d] = today.split("-").map(Number);
    return Array.from({ length: 14 }, (_, i) => new Date(y, m - 1, d + i));
  }, [today]);

  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(4);
  const [hours, setHours] = useState(1.5);
  const [start, setStart] = useState<number | null>(null);
  const [laneCount, setLaneCount] = useState<number | null>(null);
  const [picked, setPicked] = useState<number[] | null>(null);
  const [shoes, setShoes] = useState<number | null>(null);
  const [bumpers, setBumpers] = useState(false);
  const [arcade, setArcade] = useState(0);
  const [names, setNames] = useState<string[]>([]);
  const [contact, setContact] = useState({ name: "", phone: "", email: "", texts: true });
  const [pay, setPay] = useState<"now" | "desk">("now");
  const [done, setDone] = useState<SavedBooking | null>(null);
  const upcoming = useSyncExternalStore(
    subscribe,
    () => JSON.stringify(loadBookings().filter((b) => b.date >= iso(new Date())).slice(0, 3)),
    () => "[]",
  );
  const myBookings: SavedBooking[] = done ? [] : JSON.parse(upcoming);

  const minutes = hours * 60;
  const lanesNeeded = laneCount ?? Math.max(1, Math.ceil(guests / MAX_PER_LANE));
  const slots = useMemo(() => (date ? slotsWithAvailability(date, minutes) : []), [date, minutes]);
  const busy = useMemo(() => (date && start !== null ? busyLanes(date, start, minutes) : new Set<number>()), [date, start, minutes]);
  const suggestion = useMemo(() => suggestLanes(busy, lanesNeeded), [busy, lanesNeeded]);
  const lanes = picked ?? suggestion;
  const shoeCount = shoes ?? guests;
  const quote = date && start !== null ? laneQuote(date, start, hours, lanes.length, shoeCount, arcade) : null;
  const ready = !!(date && start !== null && lanes.length > 0);
  const contactOk = contact.name.trim().length > 1 && /\S+@\S+\.\S+/.test(contact.email) && contact.phone.replace(/\D/g, "").length >= 10;
  const whenLabel =
    date && start !== null
      ? `${new Date(date + "T12:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })} · ${formatTime(start)}–${formatTime(start + minutes)}`
      : "";

  const resetTime = () => {
    setStart(null);
    setPicked(null);
  };

  function toggleLane(n: number) {
    const cur = lanes;
    setPicked(cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n].sort((a, b) => a - b));
  }

  function reserve() {
    if (!ready || !quote) return;
    const b: SavedBooking = { code: bookingCode(), date, start: start!, hours, lanes, guests, total: quote.total, name: contact.name };
    saveBooking(b);
    setDone(b);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function downloadIcs(b: SavedBooking) {
    const body = icsFile(
      `Bowling at Boardwalk Bowl · lane${b.lanes.length > 1 ? "s" : ""} ${b.lanes.join(", ")}`,
      b.date,
      b.start,
      b.hours * 60,
      `Booking ${b.code}. Show this code at the front desk. ${BUSINESS.phone}`,
    ).replace(" (request, not yet confirmed)", "");
    const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `boardwalk-bowl-${b.code}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (done) {
    return (
      <div data-lane-confirmed className="mx-auto max-w-2xl">
        <div className="relative overflow-hidden rounded-3xl border-2 border-cyan-400/70 bg-gradient-to-b from-slate-900 to-slate-950 shadow-[0_0_60px_-10px_rgba(34,211,238,0.6)]">
          <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-fuchsia-600 px-6 py-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/90">Lanes reserved</p>
            <p className="font-[family-name:var(--font-display)] text-4xl tracking-wide text-white">You’re on lane{done.lanes.length > 1 ? "s" : ""} {done.lanes.join(" & ")}</p>
          </div>
          <div className="grid gap-5 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <dl className="space-y-2 text-sm">
              <div className="flex gap-3"><dt className="w-24 text-slate-500">When</dt><dd className="font-semibold text-white">{whenLabel}</dd></div>
              <div className="flex gap-3"><dt className="w-24 text-slate-500">Bowlers</dt><dd className="text-slate-200">{done.guests} · {shoeCount} shoe rentals{bumpers ? " · bumpers up" : ""}</dd></div>
              <div className="flex gap-3"><dt className="w-24 text-slate-500">Total</dt><dd className="text-slate-200">{money(done.total)} {pay === "now" ? "paid" : "due at the front desk"}</dd></div>
              <div className="flex gap-3"><dt className="w-24 text-slate-500">Name</dt><dd className="text-slate-200">{done.name}</dd></div>
            </dl>
            <div className="rounded-2xl border border-dashed border-white/25 px-5 py-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Show at the desk</p>
              <p className="mt-1 font-mono text-3xl font-black tracking-widest text-cyan-200">{done.code}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 border-t border-white/10 p-6">
            <button type="button" onClick={() => downloadIcs(done)} className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-950">
              Add to calendar
            </button>
            <a href={BUSINESS.mapsUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white">
              Directions
            </a>
            <Link href={PATH.foodDrinks} className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white">
              Food &amp; drinks menu
            </Link>
            <button type="button" onClick={() => { setDone(null); resetTime(); }} className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-slate-300">
              Book another lane
            </button>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">
          {contact.texts ? "We’ll text a reminder 2 hours before. " : ""}Bowler names go up on the Brunswick Sync screens. Concept demo: no payment is taken and no lane is held.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-28">
      {myBookings.length > 0 && (
        <div className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-4 text-sm text-cyan-50">
          <p className="font-semibold">Your upcoming lanes</p>
          <ul className="mt-1 space-y-1 text-cyan-100/90">
            {myBookings.map((b) => (
              <li key={b.code}>
                <span className="font-mono">{b.code}</span> · {new Date(b.date + "T12:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })} {formatTime(b.start)} · lane{b.lanes.length > 1 ? "s" : ""} {b.lanes.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 1. day, group, how long */}
      <section className="glass-panel glass-panel-static rounded-3xl p-5 sm:p-7">
        <StepTitle n={1} title="When are you bowling?" done={!!date} />
        <div className="lane-scroll mt-4 flex gap-2 overflow-x-auto pb-1">
          {days.map((d) => {
            const v = iso(d);
            const on = v === date;
            return (
              <button
                key={v}
                type="button"
                onClick={() => { setDate(v); resetTime(); }}
                className={`flex w-16 shrink-0 flex-col items-center rounded-2xl border py-2 transition ${
                  on ? "border-cyan-300 bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.6)]" : "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/50"
                }`}
              >
                <span className="text-[11px] font-bold uppercase">{v === today ? "Today" : DAYS[d.getDay()]}</span>
                <span className="font-[family-name:var(--font-display)] text-2xl leading-none">{d.getDate()}</span>
                <span className="text-[10px] uppercase opacity-70">{d.toLocaleDateString("en-US", { month: "short" })}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-300">Bowlers</p>
            <div className="mt-1 flex items-center gap-3">
              <button type="button" aria-label="Fewer bowlers" onClick={() => { setGuests((g) => Math.max(1, g - 1)); setLaneCount(null); setPicked(null); }} className="h-11 w-11 rounded-full border border-white/15 text-xl text-white">−</button>
              <output className="w-12 text-center font-[family-name:var(--font-display)] text-4xl text-white">{guests}</output>
              <button type="button" aria-label="More bowlers" onClick={() => { setGuests((g) => Math.min(60, g + 1)); setLaneCount(null); setPicked(null); }} className="h-11 w-11 rounded-full border border-white/15 text-xl text-white">+</button>
              <span className="text-xs text-slate-500">up to {MAX_PER_LANE} per lane</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-300">How long?</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {[1, 1.5, 2, 3].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => { setHours(h); resetTime(); }}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold ${hours === h ? "border-cyan-300 bg-cyan-400 text-slate-950" : "border-white/10 text-slate-200"}`}
                >
                  {h} hr{h > 1 ? "s" : ""}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. start time with live lanes left */}
      <section className={`glass-panel glass-panel-static rounded-3xl p-5 sm:p-7 ${date ? "" : "pointer-events-none opacity-40"}`}>
        <StepTitle n={2} title="Pick a start time" done={start !== null} />
        {!date ? (
          <p className="mt-3 text-sm text-slate-500">Choose a day first.</p>
        ) : slots.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">No start times left for {hours} hours on this day. Try a shorter game or another day.</p>
        ) : (
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {slots.map((s) => {
              const full = s.free < lanesNeeded;
              const on = start === s.min;
              const rate = laneQuote(date, s.min, 1, 1, 0, 0).rate.hour;
              return (
                <button
                  key={s.min}
                  type="button"
                  disabled={full}
                  title={s.reason ?? undefined}
                  onClick={() => { setStart(s.min); setPicked(null); }}
                  className={`rounded-xl border px-2 py-2 text-left transition ${
                    on
                      ? "border-cyan-300 bg-cyan-400 text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.6)]"
                      : full
                        ? "cursor-not-allowed border-white/5 bg-white/[0.02] text-slate-600"
                        : "border-white/10 bg-white/5 text-slate-100 hover:border-cyan-400/50"
                  }`}
                >
                  <span className="block text-sm font-bold">{formatTime(s.min)}</span>
                  <span className={`block text-[11px] ${on ? "text-slate-800" : full ? "text-slate-600" : s.free < 10 ? "text-amber-300" : "text-emerald-300"}`}>
                    {full ? (s.free === 0 ? "No lanes" : "Not enough") : `${s.free} lanes left`}
                  </span>
                  <span className={`block text-[10px] ${on ? "text-slate-800" : "text-slate-500"}`}>${rate}/lane/hr</span>
                </button>
              );
            })}
          </div>
        )}
        {date && slots.some((s) => s.reason) && (
          <ul className="mt-3 space-y-1">
            {[...new Set(slots.map((s) => s.reason).filter(Boolean))].map((r) => (
              <li key={r} className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">{r}</li>
            ))}
          </ul>
        )}
      </section>

      {/* 3. lane map */}
      <section className={`glass-panel glass-panel-static rounded-3xl p-5 sm:p-7 ${start !== null ? "" : "pointer-events-none opacity-40"}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StepTitle n={3} title="Choose your lanes" done={ready} />
          <div className="flex items-center gap-2 text-sm text-slate-300">
            Lanes
            <button type="button" aria-label="Fewer lanes" onClick={() => { setLaneCount(Math.max(1, lanesNeeded - 1)); setPicked(null); }} className="h-9 w-9 rounded-full border border-white/15 text-white">−</button>
            <output className="w-6 text-center font-bold text-white">{lanesNeeded}</output>
            <button type="button" aria-label="More lanes" onClick={() => { setLaneCount(Math.min(10, lanesNeeded + 1)); setPicked(null); }} className="h-9 w-9 rounded-full border border-white/15 text-white">+</button>
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-400">
          {start === null
            ? "Pick a time to see which lanes are open."
            : `We picked ${lanes.length > 1 ? "neighbouring lanes" : "a lane"} in the middle of the house for you. Tap any open lane to change it. ${TOTAL_LANES - busy.size} of ${TOTAL_LANES} open.`}
        </p>
        <div className="mt-4">
          <LaneMap busy={busy} selected={lanes} onToggle={toggleLane} />
        </div>
      </section>

      {/* 4. extras + bowler names */}
      <section className={`glass-panel glass-panel-static rounded-3xl p-5 sm:p-7 ${ready ? "" : "pointer-events-none opacity-40"}`}>
        <StepTitle n={4} title="Shoes, bumpers & bowler names" />
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-200">👟 Shoe rentals <span className="text-slate-500">($5 each)</span></span>
              <span className="flex items-center gap-2">
                <button type="button" aria-label="Fewer shoes" onClick={() => setShoes(Math.max(0, shoeCount - 1))} className="h-8 w-8 rounded-full border border-white/15 text-white">−</button>
                <output className="w-6 text-center font-bold text-white">{shoeCount}</output>
                <button type="button" aria-label="More shoes" onClick={() => setShoes(Math.min(guests, shoeCount + 1))} className="h-8 w-8 rounded-full border border-white/15 text-white">+</button>
              </span>
            </div>
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              <span>🎳 Bumpers up <span className="text-slate-500">(free, great for kids)</span></span>
              <input type="checkbox" className="h-5 w-5 accent-cyan-400" checked={bumpers} onChange={(e) => setBumpers(e.target.checked)} />
            </label>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              🕹️ Arcade card for after
              <div className="mt-2 flex gap-2">
                {[0, 10, 20, 40].map((v) => (
                  <button key={v} type="button" onClick={() => setArcade(v)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${arcade === v ? "border-cyan-300 bg-cyan-400 text-slate-950" : "border-white/10 text-slate-200"}`}>
                    {v ? `$${v}` : "None"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-300">Bowler names <span className="text-slate-500">(optional, shown on the Sync scoring screens)</span></p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {Array.from({ length: Math.min(guests, 12) }, (_, i) => (
                <input
                  key={i}
                  className={inputCls}
                  placeholder={`Bowler ${i + 1}${lanes.length > 1 ? ` · lane ${lanes[Math.floor(i / Math.ceil(guests / lanes.length))] ?? lanes[0]}` : ""}`}
                  value={names[i] ?? ""}
                  onChange={(e) => setNames((v) => { const n = [...v]; n[i] = e.target.value; return n; })}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. checkout */}
      <section id="checkout" className={`scroll-mt-28 glass-panel glass-panel-static rounded-3xl p-5 sm:p-7 ${ready ? "" : "pointer-events-none opacity-40"}`}>
        <StepTitle n={5} title="Reserve & pay" />
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="grid gap-3">
            <label className="text-sm text-slate-300">Name<input className={inputCls} autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} /></label>
            <label className="text-sm text-slate-300">Mobile phone<input className={inputCls} type="tel" inputMode="tel" autoComplete="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} /></label>
            <label className="text-sm text-slate-300">Email<input className={inputCls} type="email" autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></label>
            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input type="checkbox" className="h-4 w-4 accent-cyan-400" checked={contact.texts} onChange={(e) => setContact({ ...contact, texts: e.target.checked })} />
              Text me the confirmation and a reminder
            </label>
            <div className="mt-1 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Payment">
              {(["now", "desk"] as const).map((p) => (
                <button key={p} type="button" role="radio" aria-checked={pay === p} onClick={() => setPay(p)} className={`rounded-xl border px-3 py-3 text-left text-sm ${pay === p ? "border-cyan-300 bg-cyan-500/15 text-white" : "border-white/10 text-slate-300"}`}>
                  <span className="block font-semibold">{p === "now" ? "Pay now" : "Pay at the desk"}</span>
                  <span className="text-xs text-slate-400">{p === "now" ? "Card, Apple Pay, Google Pay" : "Lanes held 15 min past start"}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            {quote ? (
              <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 text-sm text-slate-300">
                <dt>{whenLabel}</dt><dd />
                <dt>Lane{lanes.length > 1 ? "s" : ""} {lanes.join(", ")} · {lanes.length} × {hours} hr × {money(quote.rate.hour)}</dt><dd className="text-right">{money(quote.bowling)}</dd>
                <dt>Shoes × {shoeCount}</dt><dd className="text-right">{money(quote.shoeCost)}</dd>
                {arcade > 0 && (<><dt>Arcade card</dt><dd className="text-right">{money(arcade)}</dd></>)}
                <dt>Tax (6.5%)</dt><dd className="text-right">{money(quote.tax)}</dd>
                <dt className="border-t border-white/10 pt-2 font-bold text-white">Total</dt><dd className="border-t border-white/10 pt-2 text-right text-xl font-bold text-cyan-200">{money(quote.total)}</dd>
                <dt className="col-span-2 pt-1 text-xs text-slate-500">{quote.rate.tier} rate. Lanes are held for 15 minutes past your start time.</dt>
              </dl>
            ) : (
              <p className="text-sm text-slate-500">Your total shows here.</p>
            )}
            <button
              type="button"
              disabled={!ready || !contactOk}
              onClick={reserve}
              className="mt-5 w-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-xl shadow-orange-500/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {pay === "now" ? `Pay ${quote ? money(quote.total) : ""} & reserve` : "Reserve lanes"}
            </button>
            <p className="mt-2 text-center text-[11px] text-slate-500">Concept demo: no card is charged and no lane is held.</p>
          </div>
        </div>
      </section>

      {/* sticky summary on phones */}
      {ready && quote && (
        <div className="fixed inset-x-3 bottom-24 z-40 flex items-center justify-between gap-3 rounded-2xl border border-cyan-400/40 bg-slate-950/95 px-4 py-3 shadow-2xl backdrop-blur md:hidden">
          <span className="text-xs text-slate-300">
            <span className="block font-semibold text-white">Lane{lanes.length > 1 ? "s" : ""} {lanes.join(", ")} · {start !== null ? formatTime(start) : ""}</span>
            {money(quote.total)}
          </span>
          <a href="#checkout" onClick={(e) => { e.preventDefault(); document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" }); }} className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2 text-xs font-bold uppercase text-white">
            Checkout
          </a>
        </div>
      )}
    </div>
  );
}
