"use client";

import { addDays, daysAgoIso, money, timeLabel, todayIso, type AdminData } from "@/lib/admin-store";
import { laneStates } from "./LaneBoard";
import { Badge, Btn, Panel, Stat, StatusBadge } from "./ui";

export function Dashboard({ d, go }: { d: AdminData; go: (tab: string) => void }) {
  const t = todayIso();
  const now = new Date();
  const nowMin = Math.max(9 * 60, Math.floor((now.getHours() * 60 + now.getMinutes()) / 30) * 30);
  const live = d.orders.filter((o) => o.status !== "cancelled" && o.status !== "refunded");
  const today = live.filter((o) => o.date === t);
  const net = (from: string, to: string) =>
    d.orders.filter((o) => o.date >= from && o.date <= to).reduce((s, o) => s + o.paid - o.refunded, 0);
  const since30 = daysAgoIso(30);
  const giftSales = d.giftCards.filter((g) => g.createdAt >= since30 && g.message !== "Bonus card").reduce((s, g) => s + g.initial, 0);
  const arcadeSales = d.arcadeSales.filter((a) => a.createdAt >= since30).reduce((s, a) => s + a.price, 0);
  const outstanding = d.giftCards.filter((g) => g.active).reduce((s, g) => s + g.balance, 0);
  const states = laneStates(d, t, nowMin);
  const inUse = states.filter((s) => s.kind === "order" || s.kind === "walkin").length;
  const pending = d.orders.filter((o) => o.status === "pending");
  const newParties = d.parties.filter((p) => p.status === "new");
  const closed = Object.entries(d.closedLanes);
  const upcoming = today.filter((o) => o.start + o.hours * 60 > nowMin && o.status !== "completed").sort((a, b) => a.start - b.start).slice(0, 6);
  const week = Array.from({ length: 7 }, (_, i) => addDays(t, i - 6));
  const weekNet = week.map((day) => net(day, day));
  const max = Math.max(1, ...weekNet);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Today's bookings" value={String(today.length)} sub={`${today.reduce((s, o) => s + o.guests, 0)} bowlers`} />
        <Stat label="Today's revenue" value={money(net(t, t))} sub="lanes, paid minus refunds" tone="emerald" />
        <Stat label="Lanes in use now" value={`${inUse}/80`} sub={timeLabel(nowMin)} tone="orange" />
        <Stat label="Pending" value={String(pending.length)} sub="need confirming or payment" tone="amber" />
        <Stat label="Gift cards (30 days)" value={money(giftSales)} sub={`${money(outstanding)} unspent balance`} tone="fuchsia" />
        <Stat label="Arcade cards (30 days)" value={money(arcadeSales)} sub={`${d.arcadeSales.length} sales`} tone="cyan" />
        <Stat label="Party requests" value={String(newParties.length)} sub="new, waiting on you" tone="amber" />
        <Stat label="Lanes closed" value={String(closed.length)} sub={closed.map(([n]) => `#${n}`).join(", ") || "all lanes open"} tone="orange" />
      </div>

      {(pending.length > 0 || newParties.length > 0 || closed.length > 0 || !d.onlineBooking) && (
        <Panel title="Needs attention">
          <ul className="space-y-2 text-sm">
            {!d.onlineBooking && <li className="flex items-center justify-between gap-3 rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-rose-100">Online lane booking is paused <Btn small onClick={() => go("settings")}>Settings</Btn></li>}
            {pending.length > 0 && <li className="flex items-center justify-between gap-3 rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-amber-100">{pending.length} pending order{pending.length > 1 ? "s" : ""} (pay at desk or not confirmed) <Btn small onClick={() => go("orders:pending")}>Review</Btn></li>}
            {newParties.length > 0 && <li className="flex items-center justify-between gap-3 rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-amber-100">{newParties.length} new party request{newParties.length > 1 ? "s" : ""} <Btn small onClick={() => go("parties")}>Open</Btn></li>}
            {closed.map(([n, c]) => <li key={n} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-2 text-slate-300">Lane {n} closed: {c.reason} <Btn small onClick={() => go("lanes")}>Lane board</Btn></li>)}
          </ul>
        </Panel>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Arriving today" action={<Btn small onClick={() => go("orders")}>All orders</Btn>}>
          {upcoming.length === 0 ? <p className="text-sm text-slate-500">No more bookings today.</p> : (
            <ul className="divide-y divide-white/5 text-sm">
              {upcoming.map((o) => (
                <li key={o.code} className="flex items-center justify-between gap-3 py-2">
                  <span><span className="font-semibold text-white">{timeLabel(o.start)}</span> · {o.name} · lane{o.lanes.length > 1 ? "s" : ""} {o.lanes.join(", ")}</span>
                  <StatusBadge status={o.status} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Lane revenue, last 7 days">
          <div className="flex h-44 items-end gap-2">
            {week.map((day, i) => (
              <div key={day} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] text-slate-400">{weekNet[i] ? money(weekNet[i]).replace(".00", "") : ""}</span>
                <div className="w-full rounded-t-md bg-gradient-to-t from-cyan-600 to-cyan-300" style={{ height: `${Math.max(2, (weekNet[i] / max) * 120)}px` }} />
                <span className="text-[10px] text-slate-500">{new Date(day + "T12:00").toLocaleDateString("en-US", { weekday: "short" })}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">From bookings in this panel (sample + new). In production: POS + online sales.</p>
        </Panel>
      </div>

      <Panel title="Recent activity" action={<Btn small onClick={() => go("activity")}>Full log</Btn>}>
        <ul className="space-y-1 text-sm text-slate-300">
          {d.log.slice(0, 6).map((l, i) => (
            <li key={i} className="flex gap-3"><span className="w-32 shrink-0 text-xs text-slate-500">{new Date(l.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span><span>{l.text}</span> <Badge>{l.who}</Badge></li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
