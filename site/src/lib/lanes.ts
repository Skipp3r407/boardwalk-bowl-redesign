import { dayOf, rateFor, slotsFor, SHOE_PRICE } from "./booking";

/**
 * Lane availability for the rent-a-lane flow.
 *
 * Concept demo: busy lanes are generated from a seed per date and half hour (so every visitor sees the same picture),
 * shaped by the real schedule from the live site: Tuesday and Thursday league nights, the dated tournament holds and
 * the Thanksgiving closure. In production this reads the lane management system (e.g. the Brunswick Sync / POS feed).
 */
export const TOTAL_LANES = 80;
export const MAX_PER_LANE = 6;

type Hold = { date: string; from: number; to: number; reason: string };

/** Dated holds from the live site footer (minutes after midnight; to may pass midnight). */
const HOLDS: Hold[] = [
  { date: "2026-10-25", from: 11 * 60, to: 15 * 60, reason: "Private event: no lanes 11am–3pm" },
  { date: "2026-10-27", from: 0, to: 26 * 60, reason: "HS State tournament: no lanes" },
  { date: "2026-10-28", from: 0, to: 26 * 60, reason: "HS State tournament: no lanes" },
  { date: "2026-10-29", from: 0, to: 19 * 60, reason: "HS State tournament: no lanes until 7pm" },
  { date: "2026-11-26", from: 0, to: 26 * 60, reason: "Closed for Thanksgiving" },
];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function rng(seed: number) {
  let a = seed || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function holdFor(date: string, min: number) {
  return HOLDS.find((h) => h.date === date && min >= h.from && min < h.to) ?? null;
}

/** How full the house is at a given half hour, 0–1, before league nights and holds. */
function demand(date: string, min: number) {
  const d = dayOf(date);
  const weekend = d === 0 || d === 6 || (d === 5 && min >= 17 * 60);
  const hour = min / 60;
  let base = hour < 12 ? 0.12 : hour < 17 ? 0.25 : hour < 21 ? 0.48 : 0.4;
  if (weekend) base += 0.2;
  if ((d === 5 || d === 6) && min >= 23 * 60) base += 0.1; // cosmic all-you-can-bowl
  return Math.min(0.8, base);
}

/** A per-day order in which lanes fill up (pairs that share a ball return fill together). */
function fillOrder(date: string) {
  const r = rng(hash(date));
  const pairs = Array.from({ length: TOTAL_LANES / 2 }, (_, i) => [2 * i + 1, 2 * i + 2]);
  for (let i = pairs.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pairs[i], pairs[j]] = [pairs[j], pairs[i]]; }
  return pairs.flat();
}

/** Lanes in use during one half hour (a set of lane numbers 1–80). */
export function busyLanesAt(date: string, min: number): Set<number> {
  const d = dayOf(date);
  if (holdFor(date, min)) return new Set(Array.from({ length: TOTAL_LANES }, (_, i) => i + 1));
  const league = min >= 18 * 60 + 30 && min < 21 * 60 + 30;
  const busy = new Set<number>();
  if (league && d === 4) for (let i = 1; i <= TOTAL_LANES; i++) busy.add(i); // Thursday league: no lanes
  if (league && d === 2) for (let i = 1; i <= 68; i++) busy.add(i); // Tuesday league: lanes 1–68
  // open play fills lanes in the day's order, so a longer booking sees the busiest half hour, not a pile-up
  const jitter = 0.9 + rng(hash(`${date}:${Math.floor(min / 60)}`))() * 0.2;
  const target = Math.round(TOTAL_LANES * demand(date, min) * jitter);
  for (const n of fillOrder(date)) {
    if (busy.size >= target) break;
    busy.add(n);
  }
  return busy;
}

/** Lanes busy at any point of a booking that starts at `start` and lasts `minutes`. */
export function busyLanes(date: string, start: number, minutes: number) {
  const all = new Set<number>();
  for (let t = start; t < start + minutes; t += 30) busyLanesAt(date, t).forEach((n) => all.add(n));
  return all;
}

export type Slot = { min: number; free: number; reason: string | null };

/** Start times for a day with the number of lanes free for the whole booking. */
export function slotsWithAvailability(date: string, minutes: number): Slot[] {
  const starts = slotsFor(date);
  const last = starts.length ? starts[starts.length - 1] + 90 : 0; // closing time
  return starts
    .filter((s) => s + minutes <= last)
    .map((s) => {
      const busy = busyLanes(date, s, minutes);
      let reason: string | null = null;
      for (let t = s; t < s + minutes && !reason; t += 30) reason = holdFor(date, t)?.reason ?? null;
      const d = dayOf(date);
      if (!reason && d === 4 && s < 21 * 60 + 30 && s + minutes > 18 * 60 + 30) reason = "Thursday league night: no open lanes 6:30–9:30pm";
      if (!reason && d === 2 && s < 21 * 60 + 30 && s + minutes > 18 * 60 + 30) reason = "Tuesday league night: limited lanes";
      return { min: s, free: TOTAL_LANES - busy.size, reason };
    });
}

/** Best neighbouring free lanes for a group (prefers a contiguous run, middle of the house). */
export function suggestLanes(busy: Set<number>, count: number): number[] {
  let best: number[] = [];
  let bestScore = -Infinity;
  for (let s = 1; s + count - 1 <= TOTAL_LANES; s++) {
    let ok = true;
    for (let k = 0; k < count; k++) if (busy.has(s + k)) ok = false;
    if (!ok) continue;
    const mid = s + (count - 1) / 2;
    const score = -Math.abs(mid - 40) + (s % 2 === 1 ? 2 : 0); // odd/even pairs share a ball return
    if (score > bestScore) { bestScore = score; best = Array.from({ length: count }, (_, k) => s + k); }
  }
  if (best.length) return best;
  const free = Array.from({ length: TOTAL_LANES }, (_, i) => i + 1).filter((n) => !busy.has(n));
  return free.slice(0, count);
}

export function laneQuote(date: string, start: number, hours: number, lanes: number, shoes: number, arcade: number) {
  const r = rateFor(date, start);
  const bowling = r.hour * hours * lanes;
  const shoeCost = SHOE_PRICE * shoes;
  const subtotal = bowling + shoeCost + arcade;
  const tax = subtotal * 0.065; // Orange County, FL sales tax
  return { rate: r, bowling, shoeCost, arcade, subtotal, tax, total: subtotal + tax };
}

export function bookingCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "BW-";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export type SavedBooking = { code: string; date: string; start: number; hours: number; lanes: number[]; guests: number; total: number; name: string };
const KEY = "bwb-bookings";

export function loadBookings(): SavedBooking[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveBooking(b: SavedBooking) {
  try {
    localStorage.setItem(KEY, JSON.stringify([b, ...loadBookings()].slice(0, 10)));
  } catch {
    /* private mode: the confirmation still shows */
  }
}
