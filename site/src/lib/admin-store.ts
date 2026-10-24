"use client";

import { useSyncExternalStore } from "react";
import { DAILY_SPECIALS, HOURS_VENUE, PARTY_PACKAGES } from "./site-data";

/**
 * Owner / staff data for the concept admin panel at /admin.
 *
 * Concept demo: everything lives in this browser's localStorage, so changes made in /admin show up on /rent-a-lane in
 * the same browser (prices, closed lanes, holds, cancelled orders). In production this is a database behind staff
 * logins, synced with the lane management system and the payment processor (refunds go back through Square/Stripe).
 */

export type Tier = { id: string; label: string; hour: number; game: number };
export type LaneOverride = { extra: number; label: string };
export type Closure = { reason: string; until?: string };
export type Hold = { id: string; date: string; from: number; to: number; first: number; last: number; reason: string };
export type OrderStatus = "pending" | "confirmed" | "checked-in" | "completed" | "cancelled" | "refunded";
export type Order = {
  code: string;
  status: OrderStatus;
  date: string;
  start: number;
  hours: number;
  lanes: number[];
  guests: number;
  shoes: number;
  name: string;
  phone: string;
  email: string;
  total: number;
  paid: number;
  refunded: number;
  payAt: "online" | "desk";
  source: "online" | "phone" | "walk-in";
  createdAt: string;
  notes: string;
  sample?: boolean;
};
export type PartyRequest = {
  id: string;
  kind: string;
  date: string;
  start: number;
  guests: number;
  packageId: string;
  name: string;
  phone: string;
  status: "new" | "approved" | "declined" | "deposit-paid";
  estimate: number;
  sample?: boolean;
};
export type LogEntry = { at: string; who: string; text: string };
export type GiftCard = { code: string; initial: number; balance: number; buyer: string; recipient: string; message: string; createdAt: string; active: boolean; sample?: boolean };
export type Discount = { code: string; kind: "percent" | "amount"; value: number; appliesTo: "lanes" | "everything"; active: boolean; uses: number; maxUses: number; expires: string; note: string };
export type ArcadePack = { id: string; price: number; credits: number; bonus: number; label: string; active: boolean };
export type ArcadeSale = { id: string; card: string; packId: string; price: number; credits: number; buyer: string; email: string; reload: boolean; createdAt: string; sample?: boolean };

export type AdminData = {
  version: 1;
  tiers: Tier[];
  shoes: number;
  taxRate: number;
  maxPerLane: number;
  holdMinutes: number;
  bookingWindowDays: number;
  onlineBooking: boolean;
  requireDeposit: boolean;
  depositPct: number;
  laneOverrides: Record<string, LaneOverride>;
  closedLanes: Record<string, Closure>;
  holds: Hold[];
  hours: { day: string; open: string; close: string }[];
  specials: { day: number; name: string; active: boolean }[];
  packages: { id: string; name: string; pricePerChild: number }[];
  orders: Order[];
  parties: PartyRequest[];
  giftCards: GiftCard[];
  giftBonus: { active: boolean; buy: number; get: number; label: string };
  discounts: Discount[];
  arcadePacks: ArcadePack[];
  arcadeSales: ArcadeSale[];
  log: LogEntry[];
};

const KEY = "bwb-admin-v1";

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const todayIso = () => iso(new Date());
export const addDays = (date: string, n: number) => {
  const [y, m, d] = date.split("-").map(Number);
  return iso(new Date(y, m - 1, d + n));
};

/** Sample orders and party requests around today so the panel isn't empty (clearly marked "Sample"). */
function seed(): Pick<AdminData, "orders" | "parties" | "giftCards" | "arcadeSales"> {
  const t = todayIso();
  const people = [
    ["Maria Gonzalez", "407-555-0141"], ["Jason Lee", "321-555-0177"], ["Tasha Brown", "407-555-0102"],
    ["Kevin Nguyen", "689-555-0133"], ["Amanda Ruiz", "407-555-0190"], ["Derek Williams", "321-555-0118"],
    ["Priya Patel", "407-555-0164"], ["Carlos Rivera", "407-555-0155"], ["Emily Carter", "321-555-0126"],
    ["Marcus Johnson", "407-555-0109"],
  ];
  const plan: [number, number, number, number[], number, OrderStatus, "online" | "desk", "online" | "phone" | "walk-in"][] = [
    [0, 11 * 60, 1, [12], 4, "completed", "online", "online"],
    [0, 15 * 60, 1.5, [21, 22], 9, "checked-in", "online", "online"],
    [0, 17 * 60, 2, [33], 5, "confirmed", "desk", "phone"],
    [0, 18 * 60, 1.5, [45, 46], 11, "pending", "desk", "online"],
    [0, 19 * 60 + 30, 1, [7], 3, "confirmed", "online", "online"],
    [0, 20 * 60, 2, [61, 62, 63], 16, "confirmed", "online", "online"],
    [1, 13 * 60, 1, [18], 4, "pending", "desk", "online"],
    [1, 19 * 60, 2, [50, 51], 10, "confirmed", "online", "online"],
    [2, 16 * 60, 1.5, [29], 6, "cancelled", "online", "online"],
    [-1, 20 * 60, 2, [70, 71], 12, "refunded", "online", "online"],
  ];
  const orders: Order[] = plan.map(([dd, start, hours, lanes, guests, status, payAt, source], i) => {
    const total = Math.round((lanes.length * hours * 35 + guests * 5) * 1.065 * 100) / 100;
    const paid = payAt === "online" || status === "completed" || status === "checked-in" ? total : 0;
    return {
      code: `BW-S${(4821 + i * 37).toString(36).toUpperCase()}`,
      status, date: addDays(t, dd), start, hours, lanes, guests, shoes: guests,
      name: people[i][0], phone: people[i][1], email: `${people[i][0].split(" ")[0].toLowerCase()}@example.com`,
      total, paid, refunded: status === "refunded" ? total : 0, payAt, source,
      createdAt: new Date(Date.now() - (i + 1) * 3600_000 * 5).toISOString(), notes: "", sample: true,
    };
  });
  const parties: PartyRequest[] = [
    { id: "P-1001", kind: "Kids' birthday", date: addDays(t, 6), start: 13 * 60, guests: 14, packageId: "fun-food-arcade", name: "Jenna Morales", phone: "407-555-0121", status: "new", estimate: 457.21, sample: true },
    { id: "P-1002", kind: "Company party", date: addDays(t, 11), start: 18 * 60, guests: 40, packageId: "", name: "Orlando Health team", phone: "407-555-0188", status: "new", estimate: 0, sample: true },
    { id: "P-1003", kind: "Kids' birthday", date: addDays(t, 3), start: 11 * 60, guests: 10, packageId: "fun-pizza", name: "Andre Thompson", phone: "321-555-0144", status: "deposit-paid", estimate: 278.18, sample: true },
    { id: "P-1004", kind: "Sweet 16", date: addDays(t, 20), start: 19 * 60, guests: 30, packageId: "", name: "Lucia Herrera", phone: "407-555-0170", status: "approved", estimate: 0, sample: true },
  ];
  const giftCards: GiftCard[] = [
    { code: "GC-7Q4M-2LXA", initial: 50, balance: 32.5, buyer: "Rosa Diaz", recipient: "Leo Diaz", message: "Happy birthday!", createdAt: new Date(Date.now() - 9 * 864e5).toISOString(), active: true, sample: true },
    { code: "GC-K8P2-9RTN", initial: 100, balance: 100, buyer: "Sam Ortiz", recipient: "Team bowling night", message: "", createdAt: new Date(Date.now() - 2 * 864e5).toISOString(), active: true, sample: true },
    { code: "GC-3HZD-6WQE", initial: 25, balance: 0, buyer: "Nina Shah", recipient: "Ava", message: "Have fun!", createdAt: new Date(Date.now() - 30 * 864e5).toISOString(), active: true, sample: true },
  ];
  const arcadeSales: ArcadeSale[] = [
    { id: "A-2201", card: "AC-104882", packId: "p25", price: 25, credits: 120, buyer: "Jason Lee", email: "jason@example.com", reload: false, createdAt: new Date(Date.now() - 3 * 3600e3).toISOString(), sample: true },
    { id: "A-2202", card: "AC-099310", packId: "p10", price: 10, credits: 40, buyer: "Tasha Brown", email: "tasha@example.com", reload: true, createdAt: new Date(Date.now() - 26 * 3600e3).toISOString(), sample: true },
    { id: "A-2203", card: "AC-104951", packId: "p50", price: 50, credits: 260, buyer: "Carlos Rivera", email: "carlos@example.com", reload: false, createdAt: new Date(Date.now() - 50 * 3600e3).toISOString(), sample: true },
  ];
  return { orders, parties, giftCards, arcadeSales };
}

export function defaults(): AdminData {
  return {
    version: 1,
    tiers: [
      { id: "wkday-day", label: "Mon–Fri · open–5pm", hour: 24, game: 4.75 },
      { id: "wkend-day", label: "Sat & Sun · open–5pm", hour: 35, game: 5.75 },
      { id: "eve", label: "Sun–Thu · 5pm–close", hour: 35, game: 5.75 },
      { id: "wkend-eve", label: "Fri & Sat · 5pm–close", hour: 45, game: 7.5 },
    ],
    shoes: 5,
    taxRate: 0.065,
    maxPerLane: 6,
    holdMinutes: 15,
    bookingWindowDays: 14,
    onlineBooking: true,
    requireDeposit: false,
    depositPct: 25,
    laneOverrides: { "79": { extra: 10, label: "VIP lounge lane" }, "80": { extra: 10, label: "VIP lounge lane" } },
    closedLanes: { "17": { reason: "Pinsetter repair" } },
    holds: [],
    hours: HOURS_VENUE.map((h) => {
      const [open, close] = h.hours.split("–").map((x) => x.trim());
      return { day: h.day, open, close };
    }),
    specials: DAILY_SPECIALS.map((s) => ({ day: s.day, name: s.name, active: true })),
    packages: PARTY_PACKAGES.map((p) => ({ id: p.id, name: p.name, pricePerChild: p.pricePerChild })),
    giftBonus: { active: true, buy: 50, get: 10, label: "Holiday bonus: buy $50, get $10 free (Nov 28 – Dec 24)" },
    discounts: [
      { code: "KNIGHTS", kind: "percent", value: 20, appliesTo: "lanes", active: true, uses: 14, maxUses: 0, expires: "", note: "UCF students, Thursday nights" },
      { code: "BDAY10", kind: "amount", value: 10, appliesTo: "everything", active: true, uses: 3, maxUses: 100, expires: "2026-12-31", note: "Birthday month coupon" },
      { code: "LEAGUE50", kind: "percent", value: 50, appliesTo: "lanes", active: false, uses: 41, maxUses: 0, expires: "", note: "League bowler practice (paused)" },
    ],
    arcadePacks: [
      { id: "p10", price: 10, credits: 40, bonus: 0, label: "Starter", active: true },
      { id: "p25", price: 25, credits: 100, bonus: 20, label: "Player", active: true },
      { id: "p50", price: 50, credits: 200, bonus: 60, label: "Pro", active: true },
      { id: "p100", price: 100, credits: 400, bonus: 150, label: "Legend", active: true },
    ],
    ...seed(),
    log: [{ at: new Date().toISOString(), who: "System", text: "Admin demo started with sample orders" }],
  };
}

// ---------- tiny external store over localStorage ----------
let cache: AdminData | null = null;
let raw: string | null = null;
const listeners = new Set<() => void>();

function read(): AdminData {
  let r: string | null = null;
  try { r = localStorage.getItem(KEY); } catch { /* storage blocked */ }
  if (cache && r === raw) return cache;
  raw = r;
  try { cache = r ? { ...defaults(), ...JSON.parse(r) } : defaults(); } catch { cache = defaults(); }
  return cache!;
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) fn(); };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(fn); window.removeEventListener("storage", onStorage); };
}

const SERVER: AdminData | null = null;
export function useAdmin(): AdminData | null {
  return useSyncExternalStore(subscribe, read, () => SERVER);
}

export function getAdmin(): AdminData {
  return read();
}

/** Apply a change, log it, persist, notify every hook. */
export function updateAdmin(change: (d: AdminData) => AdminData, logText?: string) {
  const next = change(structuredClone(read()));
  if (logText) next.log = [{ at: new Date().toISOString(), who: "Owner", text: logText }, ...next.log].slice(0, 200);
  cache = next;
  raw = JSON.stringify(next);
  try { localStorage.setItem(KEY, raw); } catch { /* storage blocked: still works for this page view */ }
  listeners.forEach((l) => l());
}

export function resetAdmin() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  cache = null; raw = null;
  listeners.forEach((l) => l());
}

// ---------- pricing used by both /admin and /rent-a-lane ----------
export function tierFor(d: AdminData, date: string, start: number): Tier {
  const [y, m, dd] = date.split("-").map(Number);
  const day = new Date(y, m - 1, dd).getDay();
  const evening = start >= 17 * 60;
  if (!evening) return day === 0 || day === 6 ? d.tiers[1] : d.tiers[0];
  return day === 5 || day === 6 ? d.tiers[3] : d.tiers[2];
}

export function lanePrice(d: AdminData, date: string, start: number, lane: number) {
  return tierFor(d, date, start).hour + (d.laneOverrides[String(lane)]?.extra ?? 0);
}

/** Lanes taken by admin closures, admin holds and live orders (not cancelled/refunded) for a time window. */
export function adminBlocked(d: AdminData, date: string, start: number, minutes: number, ignoreCode?: string) {
  const out = new Set<number>();
  for (const k of Object.keys(d.closedLanes)) out.add(Number(k));
  for (const h of d.holds) {
    if (h.date === date && start < h.to && start + minutes > h.from) for (let n = h.first; n <= h.last; n++) out.add(n);
  }
  for (const o of d.orders) {
    if (o.code === ignoreCode || o.date !== date || o.status === "cancelled" || o.status === "refunded") continue;
    if (start < o.start + o.hours * 60 && start + minutes > o.start) o.lanes.forEach((n) => out.add(n));
  }
  return out;
}

/** Look up a promo code; returns the discount for a cart or a reason it can't be used. */
export function checkDiscount(d: AdminData, code: string, lanesSubtotal: number, allSubtotal: number) {
  const c = d.discounts.find((x) => x.code.toUpperCase() === code.trim().toUpperCase());
  if (!c) return { ok: false as const, reason: "That code isn't valid." };
  if (!c.active) return { ok: false as const, reason: "That code is paused right now." };
  if (c.expires && c.expires < todayIso()) return { ok: false as const, reason: "That code has expired." };
  if (c.maxUses && c.uses >= c.maxUses) return { ok: false as const, reason: "That code has been used up." };
  const base = c.appliesTo === "lanes" ? lanesSubtotal : allSubtotal;
  const amount = Math.min(base, c.kind === "percent" ? (base * c.value) / 100 : c.value);
  return { ok: true as const, code: c.code, amount: Math.round(amount * 100) / 100, label: c.kind === "percent" ? `${c.value}% off${c.appliesTo === "lanes" ? " lanes" : ""}` : `${money(c.value)} off` };
}

export function findGiftCard(d: AdminData, code: string) {
  return d.giftCards.find((g) => g.code.toUpperCase() === code.trim().toUpperCase()) ?? null;
}

export function randomCode(prefix: string, groups = 2) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const g = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return [prefix, ...Array.from({ length: groups }, g)].join("-");
}

export const daysAgoIso = (n: number) => new Date(Date.now() - n * 864e5).toISOString();
export const randomDigits = (prefix: string, digits: number) => `${prefix}${Math.floor(10 ** (digits - 1) + Math.random() * 9 * 10 ** (digits - 1))}`;

export const money = (v: number) => v.toLocaleString("en-US", { style: "currency", currency: "USD" });
export const timeLabel = (min: number) => {
  const m = ((min % 1440) + 1440) % 1440, h = Math.floor(m / 60), ap = h >= 12 ? "pm" : "am", h12 = h % 12 || 12;
  return `${h12}:${String(m % 60).padStart(2, "0")} ${ap}`;
};
