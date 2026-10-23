"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PackagePicker } from "@/components/booking/PackagePicker";
import {
  BOWLERS_PER_LANE,
  SHOE_PRICE,
  type BookingType,
  formatTime,
  icsFile,
  money,
  noticesFor,
  partyEstimate,
  rateFor,
  requestId,
  slotsFor,
} from "@/lib/booking";
import { BUSINESS, FALL_LEAGUES, FUN_PACK, LEAGUE_CONTACT, PARTY_PACKAGES } from "@/lib/site-data";

const TYPES: { id: BookingType; title: string; blurb: string; icon: string }[] = [
  { id: "lanes", title: "Bowling lanes", blurb: "Pick your lanes on the live lane map and pay online", icon: "🎳" },
  { id: "birthday", title: "Kids’ birthday party", blurb: "Two packages, party host, 10+ kids", icon: "🎂" },
  { id: "event", title: "Group or company event", blurb: "Team building, Sweet 16, grads, The Bridge", icon: "🎉" },
  { id: "league", title: "Join a league", blurb: "15 fall leagues, beginners welcome", icon: "🏆" },
];

const EVENT_KINDS = [
  "Company party / team building",
  "Teen party",
  "Sweet 16 / Quinceañera",
  "Graduation party",
  "Youth or team party",
  "School / daycare outing",
  "Fundraiser / spirit night",
  "The Bridge Event Center (private venue)",
];

const EVENT_EXTRAS = ["Food & drink package", "Private bar", "Arcade cards for guests", "Billiards tables", "Private event space", "AV / microphone"];

const STEPS = ["Plan", "Date & time", "Details", "Contact", "Review"];

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const inputCls =
  "mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2.5 text-base text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none sm:text-sm";

export function BookingFlow() {
  const params = useSearchParams();
  const initial = (["lanes", "birthday", "event", "league"] as const).find((t) => t === params.get("type"));
  const [step, setStep] = useState(initial ? 1 : 0);
  const [type, setType] = useState<BookingType>(initial ?? "lanes");
  const [date, setDate] = useState("");
  const [start, setStart] = useState<number | null>(null);
  const [guests, setGuests] = useState(initial === "birthday" ? 12 : initial === "event" ? 25 : 6);
  const [hours, setHours] = useState(2);
  const [pkg, setPkg] = useState<string>(PARTY_PACKAGES[1].id);
  const [eventKind, setEventKind] = useState(EVENT_KINDS[0]);
  const [extras, setExtras] = useState<string[]>([]);
  const [league, setLeague] = useState<string>(FALL_LEAGUES[3].name);
  const [contact, setContact] = useState({ name: "", email: "", phone: "", notes: "", texts: true });
  const [done, setDone] = useState<{ id: string } | null>(null);

  const slots = useMemo(() => (date ? slotsFor(date) : []), [date]);
  const notices = date ? noticesFor(date, start, type) : [];
  const rate = date && start !== null ? rateFor(date, start) : null;
  const lanes = Math.max(1, Math.ceil(guests / BOWLERS_PER_LANE));
  const laneEstimate = rate ? rate.hour * hours * lanes + SHOE_PRICE * guests : 0;
  const party = partyEstimate(pkg, guests);
  const needsDate = type !== "league";

  const canNext =
    (step === 0) ||
    (step === 1 && (!needsDate || (date && start !== null))) ||
    step === 2 ||
    (step === 3 && contact.name.trim() && /\S+@\S+\.\S+/.test(contact.email) && contact.phone.replace(/\D/g, "").length >= 10);

  const title =
    type === "lanes" ? `Lane request · ${lanes} lane${lanes > 1 ? "s" : ""}` : type === "birthday" ? `Birthday party · ${party.pkg.name}` : type === "event" ? eventKind : `League: ${league}`;

  const summary = [
    ["Request", title],
    ...(needsDate && date && start !== null
      ? [["When", `${new Date(date + "T12:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at ${formatTime(start)}`]]
      : []),
    ...(type !== "league" ? [["Guests", String(guests)]] : []),
    ...(type === "lanes" && rate ? [["Estimate", `${money(laneEstimate)} (${lanes} lane × ${hours} h at ${money(rate.hour)}/h, ${rate.tier}, + ${guests} shoes)`]] : []),
    ...(type === "birthday" ? [["Estimate", `${money(party.total)} before tax (${party.pkg.name} × ${party.billed} + 18% gratuity + 3% admin)`]] : []),
    ...(type === "event" && extras.length ? [["Add-ons", extras.join(", ")]] : []),
    ["Contact", `${contact.name} · ${contact.phone} · ${contact.email}`],
  ];

  function downloadIcs() {
    if (!date || start === null || !done) return;
    const dur = type === "lanes" ? hours * 60 : type === "birthday" ? 120 : 180;
    const body = icsFile(`Boardwalk Bowl: ${title}`, date, start, dur, `Request ${done.id}. The Boardwalk Bowl team will confirm. ${BUSINESS.phone}`);
    const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `boardwalk-bowl-${done.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (done) {
    return (
      <div className="glass-panel glass-panel-static rounded-3xl p-6 sm:p-10" data-booking-done>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Request received</p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-white sm:text-5xl">You’re on the list</h2>
        <p className="mt-3 text-slate-300">
          Request number <span className="rounded-md bg-cyan-500/15 px-2 py-0.5 font-mono font-bold text-cyan-200">{done.id}</span>. The{" "}
          {type === "league" ? "league coordinators" : type === "lanes" ? "front desk" : "events team"} will confirm by {contact.texts ? "text, " : ""}phone or email.
        </p>
        <dl className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10 bg-slate-950/50">
          {summary.map(([k, v]) => (
            <div key={k} className="grid gap-1 px-5 py-3 sm:grid-cols-[140px_1fr]">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">{k}</dt>
              <dd className="text-sm text-slate-200">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          {needsDate && (
            <button type="button" onClick={downloadIcs} className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-950">
              Add to calendar
            </button>
          )}
          <a href={BUSINESS.phoneTel} className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white">
            Call {BUSINESS.phone}
          </a>
          <button
            type="button"
            onClick={() => {
              setDone(null);
              setStep(0);
            }}
            className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-slate-300"
          >
            Start another request
          </button>
        </div>
        <p className="mt-6 text-xs text-slate-500">Concept demo: this request isn’t sent anywhere. In production it goes to Tripleseat / the front desk inbox.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel glass-panel-static rounded-3xl p-5 sm:p-8">
      <ol className="flex flex-wrap gap-2" aria-label="Booking steps">
        {STEPS.map((s, i) => (
          <li
            key={s}
            aria-current={i === step ? "step" : undefined}
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
              i === step ? "bg-cyan-500 text-slate-950" : i < step ? "bg-cyan-500/15 text-cyan-200" : "bg-white/5 text-slate-500"
            }`}
          >
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <fieldset className="mt-6">
          <legend className="font-[family-name:var(--font-display)] text-3xl text-white">What are you planning?</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  if (t.id === "lanes") { window.location.href = "/rent-a-lane"; return; }
                  setType(t.id);
                  setGuests(t.id === "birthday" ? 12 : t.id === "event" ? 25 : 6);
                  setStep(1);
                }}
                className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition hover:border-cyan-400/60 hover:bg-cyan-500/5 ${
                  type === t.id ? "border-cyan-400/60" : "border-white/10"
                }`}
              >
                <span className="text-3xl" aria-hidden>
                  {t.icon}
                </span>
                <span>
                  <span className="block font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">{t.title}</span>
                  <span className="text-sm text-slate-400">{t.blurb}</span>
                </span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Just walking in? Open bowling is first come, first served. The {FUN_PACK.price} Friends & Family Fun Pack is walk-in only.
          </p>
        </fieldset>
      )}

      {step === 1 && type === "league" && (
        <fieldset className="mt-6">
          <legend className="font-[family-name:var(--font-display)] text-3xl text-white">Which league?</legend>
          <div className="mt-4 grid max-h-[460px] gap-2 overflow-y-auto pr-1">
            {FALL_LEAGUES.map((l) => (
              <label
                key={l.name}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
                  league === l.name ? "border-cyan-400 bg-cyan-500/10" : "border-white/10 bg-white/5"
                }`}
              >
                <span>
                  <input type="radio" name="league" className="sr-only" checked={league === l.name} onChange={() => setLeague(l.name)} />
                  <span className="font-semibold text-white">{l.name}</span>
                  <span className="block text-xs text-slate-400">
                    {l.day} {l.time} · {l.type}
                  </span>
                </span>
                <span className="text-right text-xs text-slate-300">
                  {l.cost}/week
                  <span className="block text-slate-500">{l.starts}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {step === 1 && type !== "league" && (
        <fieldset className="mt-6">
          <legend className="font-[family-name:var(--font-display)] text-3xl text-white">Pick a day and time</legend>
          <div className="mt-4 grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="space-y-4">
              <label className="block text-sm text-slate-300">
                Date
                <input
                  type="date"
                  min={todayIso()}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setStart(null);
                  }}
                  className={inputCls}
                />
              </label>
              <div>
                <p className="text-sm text-slate-300">{type === "birthday" ? "Kids" : "Guests"}</p>
                <div className="mt-1 flex items-center gap-3">
                  <button type="button" aria-label="Fewer guests" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="h-11 w-11 rounded-full border border-white/15 text-xl text-white">
                    −
                  </button>
                  <output className="w-12 text-center font-[family-name:var(--font-display)] text-3xl text-white">{guests}</output>
                  <button type="button" aria-label="More guests" onClick={() => setGuests((g) => Math.min(400, g + 1))} className="h-11 w-11 rounded-full border border-white/15 text-xl text-white">
                    +
                  </button>
                </div>
                {type === "lanes" && (
                  <p className="mt-1 text-xs text-slate-500">
                    About {lanes} lane{lanes > 1 ? "s" : ""} (up to {BOWLERS_PER_LANE} bowlers each)
                  </p>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-300">Start time</p>
              {!date && <p className="mt-2 rounded-xl border border-dashed border-white/10 p-6 text-sm text-slate-500">Choose a date to see start times.</p>}
              {date && (
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-6">
                  {slots.map((t) => {
                    const r = rateFor(date, t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setStart(t)}
                        className={`rounded-lg border px-2 py-2 text-sm transition ${
                          start === t ? "border-cyan-400 bg-cyan-500 text-slate-950" : "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/50"
                        }`}
                      >
                        {formatTime(t)}
                        {type === "lanes" && <span className={`block text-[10px] ${start === t ? "text-slate-800" : "text-slate-500"}`}>${r.hour}/h</span>}
                      </button>
                    );
                  })}
                </div>
              )}
              {notices.length > 0 && (
                <ul className="mt-3 space-y-1" aria-live="polite">
                  {notices.map((n) => (
                    <li key={n} className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                      {n}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <div className="mt-6">
          {type === "lanes" && (
            <fieldset>
              <legend className="font-[family-name:var(--font-display)] text-3xl text-white">How long?</legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {[1, 1.5, 2, 3].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHours(h)}
                    className={`rounded-full border px-5 py-2 text-sm font-semibold ${hours === h ? "border-cyan-400 bg-cyan-500 text-slate-950" : "border-white/10 text-slate-200"}`}
                  >
                    {h} hour{h > 1 ? "s" : ""}
                  </button>
                ))}
              </div>
              {rate && (
                <p className="mt-5 rounded-2xl border border-white/10 bg-slate-950/50 p-5 text-sm text-slate-300">
                  {lanes} lane{lanes > 1 ? "s" : ""} × {hours} h × {money(rate.hour)} ({rate.tier}) + {guests} shoe rentals × {money(SHOE_PRICE)} ={" "}
                  <span className="text-xl font-bold text-cyan-200">{money(laneEstimate)}</span> before tax
                </p>
              )}
            </fieldset>
          )}
          {type === "birthday" && <PackagePicker compact value={pkg} kids={guests} onChange={(id, n) => { setPkg(id); setGuests(n); }} />}
          {type === "event" && (
            <fieldset>
              <legend className="font-[family-name:var(--font-display)] text-3xl text-white">Tell us about the event</legend>
              <label className="mt-4 block text-sm text-slate-300">
                Type of event
                <select value={eventKind} onChange={(e) => setEventKind(e.target.value)} className={inputCls}>
                  {EVENT_KINDS.map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </label>
              <p className="mt-4 text-sm text-slate-300">Add-ons</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {EVENT_EXTRAS.map((x) => (
                  <label key={x} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-cyan-400"
                      checked={extras.includes(x)}
                      onChange={(e) => setExtras((v) => (e.target.checked ? [...v, x] : v.filter((y) => y !== x)))}
                    />
                    {x}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          {type === "league" && (
            <p className="rounded-2xl border border-white/10 bg-slate-950/50 p-5 text-sm text-slate-300">
              Joining solo, with a partner or as a full team all work. The coordinators ({LEAGUE_CONTACT}) will place you and confirm the first night.
            </p>
          )}
        </div>
      )}

      {step === 3 && (
        <fieldset className="mt-6">
          <legend className="font-[family-name:var(--font-display)] text-3xl text-white">Where should we confirm?</legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-slate-300 sm:col-span-2">
              Name
              <input className={inputCls} autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
            </label>
            <label className="block text-sm text-slate-300">
              Mobile phone
              <input className={inputCls} type="tel" inputMode="tel" autoComplete="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
            </label>
            <label className="block text-sm text-slate-300">
              Email
              <input className={inputCls} type="email" autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
            </label>
            <label className="block text-sm text-slate-300 sm:col-span-2">
              Anything else? (optional)
              <textarea className={`${inputCls} min-h-[90px]`} value={contact.notes} onChange={(e) => setContact({ ...contact, notes: e.target.value })} placeholder="Allergies, theme, bumpers, wheelchair access…" />
            </label>
            <label className="flex items-center gap-3 text-sm text-slate-300 sm:col-span-2">
              <input type="checkbox" className="h-4 w-4 accent-cyan-400" checked={contact.texts} onChange={(e) => setContact({ ...contact, texts: e.target.checked })} />
              Text me the confirmation and a reminder
            </label>
          </div>
        </fieldset>
      )}

      {step === 4 && (
        <div className="mt-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Check your request</h2>
          <dl className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 bg-slate-950/50">
            {summary.map(([k, v]) => (
              <div key={k} className="grid gap-1 px-5 py-3 sm:grid-cols-[140px_1fr]">
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">{k}</dt>
                <dd className="text-sm text-slate-200">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-slate-500">This is a request, not a confirmed booking. Prices are estimates from the current rate card.</p>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={`rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-200 ${step === 0 ? "invisible" : ""}`}
        >
          Back
        </button>
        {step > 0 && step < 4 && (
          <button
            type="button"
            disabled={!canNext}
            onClick={() => setStep((s) => s + 1)}
            className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 text-sm font-bold uppercase tracking-wide text-slate-950 shadow-lg shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        )}
        {step === 4 && (
          <button
            type="button"
            onClick={() => setDone({ id: requestId() })}
            className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-8 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-xl shadow-orange-500/30"
          >
            Send request
          </button>
        )}
      </div>
    </div>
  );
}
