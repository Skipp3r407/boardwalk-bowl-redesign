"use client";

import { useState, useSyncExternalStore } from "react";
import { TOTAL_LANES } from "@/lib/lanes";
import { todayIso, updateAdmin, type AdminData, type LaneSession } from "@/lib/admin-store";
import { Badge, Btn, Drawer, Field, Panel, inputCls } from "./ui";

/** Clock that re-renders every 15 s, so session timers count down. */
function subscribeClock(fn: () => void) {
  const id = setInterval(fn, 15000);
  return () => clearInterval(id);
}
const minuteNow = () => Math.floor(Date.now() / 15000) * 15000;
export function useNow() {
  return useSyncExternalStore(subscribeClock, minuteNow, () => 0);
}

const mins = (ms: number) => Math.round(ms / 60000);
function remaining(s: LaneSession, now: number) {
  if (!s.until) return null;
  return mins(new Date(s.until).getTime() - now);
}

export function setLanes(lanes: number[], on: boolean, opts: { minutes?: number; label?: string; orderCode?: string } = {}, log?: string) {
  updateAdmin((d) => {
    const p = { ...d.lanePower };
    for (const n of lanes) {
      if (d.closedLanes[String(n)] && on) continue; // closed for maintenance: stays off
      if (!on) { delete p[String(n)]; continue; }
      const since = new Date().toISOString();
      p[String(n)] = { on: true, since, until: opts.minutes ? new Date(Date.now() + opts.minutes * 60000).toISOString() : "", label: opts.label ?? "", orderCode: opts.orderCode ?? "" };
    }
    return { ...d, lanePower: p };
  }, log ?? `Lane${lanes.length > 1 ? "s" : ""} ${lanes.join(", ")} turned ${on ? "on" : "off"}`);
}

function LaneDrawer({ d, lane, now, onClose }: { d: AdminData; lane: number; now: number; onClose: () => void }) {
  const s = d.lanePower[String(lane)];
  const closed = d.closedLanes[String(lane)];
  const t = todayIso();
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const booking = d.orders.find((o) => o.date === t && o.lanes.includes(lane) && o.status !== "cancelled" && o.status !== "refunded" && nowMin >= o.start - 20 && nowMin < o.start + o.hours * 60);
  const [minutes, setMinutes] = useState(booking ? Math.max(15, booking.start + booking.hours * 60 - nowMin) : 60);
  const [label, setLabel] = useState(booking?.name ?? "Walk-in");
  const left = s ? remaining(s, now) : null;

  return (
    <Drawer open onClose={onClose} title={`Lane ${lane}`}>
      <div className="space-y-5 text-sm text-slate-300">
        <div className="flex flex-wrap gap-2">
          {closed ? <Badge tone="rose">Closed: {closed.reason}</Badge> : s ? <Badge tone="emerald">ON</Badge> : <Badge>OFF</Badge>}
          {s && <Badge tone={left !== null && left < 0 ? "rose" : left !== null && left <= 10 ? "amber" : "cyan"}>{left === null ? "Open-ended" : left < 0 ? `${-left} min over` : `${left} min left`}</Badge>}
          {s?.label && <Badge>{s.label}</Badge>}
        </div>
        {booking && <p className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-cyan-100">Booking now: {booking.name} · {booking.code} · {booking.guests} bowlers</p>}
        {closed ? (
          <p>This lane is closed on the lane board ({closed.reason}). Reopen it there before turning it on.</p>
        ) : s ? (
          <div className="flex flex-wrap gap-2">
            {[15, 30, 60].map((m) => (
              <Btn key={m} onClick={() => updateAdmin((x) => { const cur = x.lanePower[String(lane)]; const base = cur.until ? Math.max(Date.now(), new Date(cur.until).getTime()) : Date.now(); return { ...x, lanePower: { ...x.lanePower, [String(lane)]: { ...cur, until: new Date(base + m * 60000).toISOString() } } }; }, `Lane ${lane} extended ${m} min`)}>+{m} min</Btn>
            ))}
            <Btn tone="danger" onClick={() => { setLanes([lane], false); if (s.orderCode) updateAdmin((x) => ({ ...x, orders: x.orders.map((o) => (o.code === s.orderCode && o.status === "checked-in" ? { ...o, status: "completed" } : o)) })); onClose(); }}>Turn off (end game)</Btn>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="For"><input className={inputCls} value={label} onChange={(e) => setLabel(e.target.value)} /></Field>
              <Field label="Time">
                <select className={inputCls} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}>
                  {[...new Set([minutes, 30, 60, 90, 120, 180])].sort((a, b) => a - b).map((m) => <option key={m} value={m}>{m} min</option>)}
                  <option value={0}>Open-ended</option>
                </select>
              </Field>
            </div>
            <Btn tone="success" onClick={() => { setLanes([lane], true, { minutes, label, orderCode: booking?.code }); if (booking && booking.status !== "checked-in") updateAdmin((x) => ({ ...x, orders: x.orders.map((o) => (o.code === booking.code ? { ...o, status: "checked-in" } : o)) }), `${booking.code} checked in on lane ${lane}`); onClose(); }}>Turn lane on</Btn>
          </div>
        )}
        <p className="text-xs text-slate-500">In production this switch talks to the lane management system (Brunswick Sync): the pinsetter and scoring screen come on and the timer is enforced.</p>
      </div>
    </Drawer>
  );
}

export function LaneControl({ d }: { d: AdminData }) {
  const now = useNow();
  const [picking, setPicking] = useState(false);
  const [picked, setPicked] = useState<number[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const [bulkMin, setBulkMin] = useState(60);
  const onCount = Object.keys(d.lanePower).length;
  const expiring = Object.entries(d.lanePower).filter(([, s]) => { const l = remaining(s, now); return l !== null && l <= 10; });
  const lanes = Array.from({ length: TOTAL_LANES }, (_, i) => i + 1);

  return (
    <div className="space-y-5">
      <Panel
        title="Lane control"
        action={
          <div className="flex flex-wrap gap-2">
            <Btn tone={picking ? "primary" : "ghost"} onClick={() => { setPicking(!picking); setPicked([]); }}>{picking ? "Done picking" : "Select lanes"}</Btn>
            <Btn tone="danger" disabled={!onCount} onClick={() => { if (window.confirm(`Turn off all ${onCount} lanes?`)) setLanes(lanes, false, {}, `All lanes turned off (${onCount} were on)`); }}>All lanes off</Btn>
          </div>
        }
      >
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
          <Badge tone="emerald">On {onCount}</Badge>
          <Badge>Off {TOTAL_LANES - onCount - Object.keys(d.closedLanes).length}</Badge>
          <Badge tone="rose">Closed {Object.keys(d.closedLanes).length}</Badge>
          {expiring.length > 0 && <Badge tone="amber">{expiring.length} ending within 10 min</Badge>}
        </div>

        {picking && (
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/5 p-3 text-sm">
            <span className="text-slate-300">{picked.length ? `Lanes ${picked.join(", ")}` : "Tap lanes to select"}</span>
            <select className={`${inputCls} w-auto`} value={bulkMin} onChange={(e) => setBulkMin(Number(e.target.value))} aria-label="Time">
              {[30, 60, 90, 120, 180].map((m) => <option key={m} value={m}>{m} min</option>)}<option value={0}>Open-ended</option>
            </select>
            <Btn tone="success" disabled={!picked.length} onClick={() => { setLanes(picked, true, { minutes: bulkMin, label: "Group" }); setPicked([]); }}>Turn on</Btn>
            <Btn tone="danger" disabled={!picked.length} onClick={() => { setLanes(picked, false); setPicked([]); }}>Turn off</Btn>
            <Btn small onClick={() => setPicked(lanes.filter((n) => n <= 40 && !d.closedLanes[String(n)]))}>1–40</Btn>
            <Btn small onClick={() => setPicked(lanes.filter((n) => n > 40 && !d.closedLanes[String(n)]))}>41–80</Btn>
          </div>
        )}

        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8 lg:grid-cols-10">
          {lanes.map((n) => {
            const s = d.lanePower[String(n)];
            const closed = d.closedLanes[String(n)];
            const left = s ? remaining(s, now) : null;
            const sel = picked.includes(n);
            const tone = closed ? "border-rose-500/50 bg-rose-950/40" : s ? (left !== null && left < 0 ? "border-rose-400 bg-rose-500/15" : left !== null && left <= 10 ? "border-amber-400 bg-amber-500/10" : "border-emerald-400/70 bg-emerald-500/10") : "border-white/10 bg-white/[0.03]";
            return (
              <button key={n} type="button" data-power-lane={n}
                onClick={() => (picking ? (!closed && setPicked(sel ? picked.filter((x) => x !== n) : [...picked, n])) : setOpen(n))}
                className={`relative rounded-xl border p-2 text-left transition hover:-translate-y-0.5 ${tone} ${sel ? "ring-2 ring-cyan-300" : ""}`}>
                <span className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-display)] text-2xl leading-none text-white">{n}</span>
                  <span className={`h-3 w-3 rounded-full ${closed ? "bg-rose-500" : s ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" : "bg-slate-600"}`} aria-hidden />
                </span>
                <span className="mt-1 block truncate text-[11px] text-slate-300">{closed ? closed.reason : s ? s.label || "On" : "Off"}</span>
                <span className={`block text-[11px] font-semibold ${left !== null && left < 0 ? "text-rose-300" : left !== null && left <= 10 ? "text-amber-300" : "text-slate-500"}`}>
                  {s ? (left === null ? "open-ended" : left < 0 ? `${-left}m over` : `${left}m left`) : closed ? "locked" : "tap to start"}
                </span>
              </button>
            );
          })}
        </div>
      </Panel>
      {open !== null && <LaneDrawer d={d} lane={open} now={now} onClose={() => setOpen(null)} />}
    </div>
  );
}
