import { HOURS_VENUE, LANE_DATED_NOTES, PARTY_PACKAGES, PARTY_TERMS } from "./site-data";

export type BookingType = "lanes" | "birthday" | "event" | "league";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Parse "10am", "12am", "2am" into minutes after the day's midnight (closing times past midnight roll over). */
function minutes(t: string, isClose = false) {
  const m = t.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
  if (!m) return 0;
  let h = Number(m[1]) % 12;
  if (m[3].toLowerCase() === "pm") h += 12;
  let v = h * 60 + Number(m[2] ?? 0);
  if (isClose && v <= 6 * 60) v += 24 * 60;
  return v;
}

export function dayOf(dateIso: string) {
  const [y, mo, d] = dateIso.split("-").map(Number);
  return new Date(y, mo - 1, d).getDay();
}

export function formatTime(min: number) {
  const m = min % (24 * 60);
  const h = Math.floor(m / 60);
  const ap = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m % 60).padStart(2, "0")} ${ap}`;
}

/** Start times every 30 minutes from opening until 90 minutes before closing. */
export function slotsFor(dateIso: string) {
  const name = DAY_NAMES[dayOf(dateIso)];
  const row = HOURS_VENUE.find((h) => h.day === name);
  if (!row) return [];
  const [open, close] = row.hours.split("–");
  const a = minutes(open), b = minutes(close, true) - 90;
  const out: number[] = [];
  for (let t = a; t <= b; t += 30) out.push(t);
  return out;
}

/** The live site's rate tiers: weekday daytime, weekend daytime, Sun–Thu evening, Fri–Sat evening. */
export function rateFor(dateIso: string, startMin: number) {
  const d = dayOf(dateIso);
  const evening = startMin >= 17 * 60;
  if (!evening) return d === 0 || d === 6 ? { hour: 35, game: 5.75, tier: "Sat & Sun · open–5pm" } : { hour: 24, game: 4.75, tier: "Mon–Fri · open–5pm" };
  return d === 5 || d === 6 ? { hour: 45, game: 7.5, tier: "Fri & Sat · 5pm–close" } : { hour: 35, game: 5.75, tier: "Sun–Thu · 5pm–close" };
}

export const SHOE_PRICE = 5;
export const BOWLERS_PER_LANE = 6;

/** Heads-ups for the chosen day and time: dated lane holds, league nights, party evening rules. */
export function noticesFor(dateIso: string, startMin: number | null, type: BookingType) {
  const out: string[] = [];
  const d = dayOf(dateIso);
  for (const n of LANE_DATED_NOTES) {
    if (n.date === dateIso || (n.date === "2026-10-28" && dateIso === "2026-10-27")) out.push(`${n.label}: ${n.note}`);
  }
  const evening = startMin !== null && startMin >= 18 * 60 + 30 && startMin < 21 * 60 + 30;
  if (d === 2 && evening) out.push("Tuesday 6:30–9:30 pm is league night: limited lanes.");
  if (d === 4 && evening) out.push("Thursday 6:30–9:30 pm is league night: no open lanes.");
  if (type === "birthday" && startMin !== null && startMin >= 17 * 60 && (d === 0 || d >= 5))
    out.push("Weekend parties after 5pm depend on availability and carry an evening up-charge.");
  return out;
}

export function partyEstimate(packageId: string, kids: number) {
  const pkg = PARTY_PACKAGES.find((p) => p.id === packageId) ?? PARTY_PACKAGES[0];
  const n = Math.max(kids, PARTY_TERMS.minGuests);
  const base = pkg.pricePerChild * n;
  const gratuity = base * PARTY_TERMS.gratuity;
  const admin = base * PARTY_TERMS.adminFee;
  return { pkg, billed: n, base, gratuity, admin, total: base + gratuity + admin };
}

export const money = (v: number) => v.toLocaleString("en-US", { style: "currency", currency: "USD" });

export function requestId() {
  const n = Math.floor(Math.random() * 90000) + 10000;
  return `BWB-${n}`;
}

/** A small .ics file so the guest can hold the time on their calendar while the team confirms. */
export function icsFile(title: string, dateIso: string, startMin: number, durationMin: number, details: string) {
  const [y, mo, d] = dateIso.split("-").map(Number);
  const start = new Date(y, mo - 1, d, 0, startMin);
  const end = new Date(start.getTime() + durationMin * 60000);
  const f = (x: Date) =>
    `${x.getFullYear()}${String(x.getMonth() + 1).padStart(2, "0")}${String(x.getDate()).padStart(2, "0")}T${String(x.getHours()).padStart(2, "0")}${String(x.getMinutes()).padStart(2, "0")}00`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Boardwalk Bowl concept//EN",
    "BEGIN:VEVENT",
    `UID:${f(start)}-${Math.random().toString(36).slice(2)}@boardwalk-bowl`,
    `DTSTAMP:${f(new Date())}`,
    `DTSTART;TZID=America/New_York:${f(start)}`,
    `DTEND;TZID=America/New_York:${f(end)}`,
    `SUMMARY:${title} (request, not yet confirmed)`,
    "LOCATION:Boardwalk Bowl\\, 10749 East Colonial Drive\\, Orlando\\, FL 32817",
    `DESCRIPTION:${details.replace(/\n/g, "\\n")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
