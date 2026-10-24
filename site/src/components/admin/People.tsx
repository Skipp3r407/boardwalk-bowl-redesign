"use client";

import { useMemo, useState } from "react";
import { money, resetAdmin, timeLabel, todayIso, updateAdmin, type AdminData, type PartyRequest } from "@/lib/admin-store";
import { Badge, Btn, Empty, Field, Panel, Toggle, downloadCsv, inputCls } from "./ui";

const dateLabel = (d: string) => new Date(d + "T12:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
const TONE: Record<PartyRequest["status"], "amber" | "emerald" | "rose" | "cyan"> = { new: "amber", approved: "cyan", declined: "rose", "deposit-paid": "emerald" };

export function Parties({ d }: { d: AdminData }) {
  const set = (id: string, status: PartyRequest["status"], text: string) =>
    updateAdmin((x) => ({ ...x, parties: x.parties.map((p) => (p.id === id ? { ...p, status } : p)) }), `Party ${id}: ${text}`);
  return (
    <Panel title="Party & event requests">
      {d.parties.length === 0 ? <Empty>No requests.</Empty> : (
        <ul className="space-y-3">
          {[...d.parties].sort((a, b) => a.date.localeCompare(b.date)).map((p) => {
            const pkg = d.packages.find((x) => x.id === p.packageId);
            return (
              <li key={p.id} className="rounded-xl border border-white/10 p-4 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-white">{p.kind} · {p.guests} guests · {dateLabel(p.date)} {timeLabel(p.start)}</span>
                  <span className="flex gap-2"><Badge tone={TONE[p.status]}>{p.status.replace("-", " ")}</Badge>{p.sample && <Badge tone="fuchsia">Sample</Badge>}</span>
                </div>
                <p className="mt-1 text-slate-400">{p.name} · <a className="text-cyan-300" href={`tel:${p.phone}`}>{p.phone}</a>{pkg ? ` · ${pkg.name} (${money(pkg.pricePerChild)}/child)` : ""}{p.estimate ? ` · est. ${money(p.estimate)}` : ""} · {p.id}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.status === "new" && <Btn small tone="success" onClick={() => set(p.id, "approved", "approved, deposit link sent (demo)")}>Approve + send deposit link</Btn>}
                  {p.status === "approved" && <Btn small tone="success" onClick={() => set(p.id, "deposit-paid", "deposit recorded")}>Mark deposit paid</Btn>}
                  {p.status !== "declined" && <Btn small tone="danger" onClick={() => set(p.id, "declined", "declined")}>Decline</Btn>}
                  <Btn small onClick={() => updateAdmin((x) => x, `Called ${p.name} about ${p.id}`)}>Log a call</Btn>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-3 text-xs text-slate-500">Requests from the party planner (/book) land here. In production they sync with Tripleseat.</p>
    </Panel>
  );
}

export function Customers({ d }: { d: AdminData }) {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const m = new Map<string, { name: string; phone: string; email: string; visits: number; spent: number; last: string; gift: number; arcade: number }>();
    const key = (name: string, email: string) => (email || name).toLowerCase();
    for (const o of d.orders) {
      if (o.name === "Walk-in") continue;
      const k = key(o.name, o.email);
      const r = m.get(k) ?? { name: o.name, phone: o.phone, email: o.email, visits: 0, spent: 0, last: "", gift: 0, arcade: 0 };
      if (o.status !== "cancelled" && o.status !== "refunded") r.visits++;
      r.spent += o.paid - o.refunded;
      if (o.date > r.last) r.last = o.date;
      m.set(k, r);
    }
    for (const a of d.arcadeSales) {
      const k = key(a.buyer, a.email);
      const r = m.get(k) ?? { name: a.buyer, phone: "", email: a.email, visits: 0, spent: 0, last: "", gift: 0, arcade: 0 };
      r.arcade += a.price;
      r.spent += a.price;
      m.set(k, r);
    }
    for (const g of d.giftCards) {
      if (g.buyer === "Boardwalk Bowl" || g.message === "Bonus card") continue;
      const k = key(g.buyer, "");
      const r = m.get(k) ?? { name: g.buyer, phone: "", email: "", visits: 0, spent: 0, last: "", gift: 0, arcade: 0 };
      r.gift += g.initial;
      r.spent += g.initial;
      m.set(k, r);
    }
    return [...m.values()].filter((r) => !q || `${r.name} ${r.email} ${r.phone}`.toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.spent - a.spent);
  }, [d, q]);

  return (
    <Panel title="Customers" action={<div className="flex gap-2"><input className={`${inputCls} w-56`} placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} /><Btn onClick={() => downloadCsv(`customers-${todayIso()}.csv`, [["Name", "Phone", "Email", "Visits", "Spent", "Gift cards", "Arcade", "Last visit"], ...rows.map((r) => [r.name, r.phone, r.email, r.visits, r.spent.toFixed(2), r.gift, r.arcade, r.last])])}>CSV</Btn></div>}>
      {rows.length === 0 ? <Empty>No customers yet.</Empty> : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="py-2">Customer</th><th>Visits</th><th>Spent</th><th>Gift / arcade</th><th>Last visit</th></tr></thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {rows.map((r) => (
                <tr key={r.name + r.email}>
                  <td className="py-2">{r.name}<span className="block text-xs text-slate-500">{[r.phone, r.email].filter(Boolean).join(" · ")}</span></td>
                  <td>{r.visits}</td>
                  <td className="text-cyan-200">{money(r.spent)}</td>
                  <td className="text-xs">{money(r.gift)} / {money(r.arcade)}</td>
                  <td className="text-xs text-slate-400">{r.last ? dateLabel(r.last) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-3 text-xs text-slate-500">Built from bookings, gift cards and game card sales. Export for email or text campaigns.</p>
    </Panel>
  );
}

export function Settings({ d }: { d: AdminData }) {
  const [f, setF] = useState({ maxPerLane: String(d.maxPerLane), holdMinutes: String(d.holdMinutes), bookingWindowDays: String(d.bookingWindowDays), depositPct: String(d.depositPct) });
  const n = (v: string) => Math.max(0, Number(v) || 0);
  return (
    <div className="space-y-5">
      <Panel title="Online booking">
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-4 py-3">
            <span><span className="font-semibold text-white">Take lane bookings online</span><span className="block text-xs text-slate-400">Turn off during big events or if the system is down. Rent a lane shows a “walk-in only” message.</span></span>
            <Toggle label="Online booking" on={d.onlineBooking} onChange={(v) => updateAdmin((x) => ({ ...x, onlineBooking: v }), `Online lane booking ${v ? "turned on" : "paused"}`)} />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-4 py-3">
            <span><span className="font-semibold text-white">Require a deposit for pay-at-desk bookings</span><span className="block text-xs text-slate-400">Cuts no-shows on busy nights.</span></span>
            <Toggle label="Require deposit" on={d.requireDeposit} onChange={(v) => updateAdmin((x) => ({ ...x, requireDeposit: v }), `Deposit ${v ? "required" : "not required"}`)} />
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <Field label="Max bowlers per lane"><input className={inputCls} value={f.maxPerLane} onChange={(e) => setF({ ...f, maxPerLane: e.target.value })} /></Field>
          <Field label="Hold lanes (minutes late)"><input className={inputCls} value={f.holdMinutes} onChange={(e) => setF({ ...f, holdMinutes: e.target.value })} /></Field>
          <Field label="Book up to (days ahead)"><input className={inputCls} value={f.bookingWindowDays} onChange={(e) => setF({ ...f, bookingWindowDays: e.target.value })} /></Field>
          <Field label="Deposit %"><input className={inputCls} value={f.depositPct} onChange={(e) => setF({ ...f, depositPct: e.target.value })} /></Field>
        </div>
        <div className="mt-3"><Btn tone="primary" onClick={() => updateAdmin((x) => ({ ...x, maxPerLane: Math.max(1, n(f.maxPerLane)), holdMinutes: n(f.holdMinutes), bookingWindowDays: Math.min(60, Math.max(1, n(f.bookingWindowDays))), depositPct: Math.min(100, n(f.depositPct)) }), `Booking settings: ${f.maxPerLane} per lane, hold ${f.holdMinutes} min, ${f.bookingWindowDays} days ahead`)}>Save settings</Btn></div>
      </Panel>
      <Panel title="Staff & integrations (production)">
        <ul className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
          {["Staff logins with roles (owner, manager, front desk)", "Lane system sync (Brunswick Sync / POS)", "Payments + refunds (Square or Stripe)", "Tripleseat for parties and events", "Arcade card system (Embed / Intercard / CenterEdge)", "Text and email confirmations + reminders"].map((t) => <li key={t} className="rounded-lg border border-white/10 px-3 py-2">{t}</li>)}
        </ul>
      </Panel>
      <Panel title="Demo data">
        <p className="mb-3 text-sm text-slate-400">This concept keeps its data in your browser. Reset brings back the sample orders and default prices.</p>
        <Btn tone="danger" onClick={() => resetAdmin()}>Reset demo data</Btn>
      </Panel>
    </div>
  );
}

export function Activity({ d }: { d: AdminData }) {
  return (
    <Panel title="Activity log" action={<Btn onClick={() => downloadCsv(`activity-${todayIso()}.csv`, [["When", "Who", "What"], ...d.log.map((l) => [l.at, l.who, l.text])])}>CSV</Btn>}>
      <ul className="divide-y divide-white/5 text-sm">
        {d.log.map((l, i) => (
          <li key={i} className="flex gap-3 py-2 text-slate-300"><span className="w-40 shrink-0 text-xs text-slate-500">{new Date(l.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span><span className="flex-1">{l.text}</span><Badge>{l.who}</Badge></li>
        ))}
      </ul>
    </Panel>
  );
}
