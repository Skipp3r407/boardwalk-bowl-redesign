"use client";

import { useMemo, useState } from "react";
import { TOTAL_LANES, busyLanesAt, holdFor } from "@/lib/lanes";
import { lanePrice, money, tierFor, timeLabel, todayIso, updateAdmin, type AdminData, type Order } from "@/lib/admin-store";
import { Badge, Btn, Drawer, Field, Panel, inputCls } from "./ui";

type LaneState = { kind: "open" | "order" | "walkin" | "hold" | "closed"; label: string; order?: Order };

export function laneStates(d: AdminData, date: string, min: number): LaneState[] {
  const traffic = busyLanesAt(date, min);
  const siteHold = holdFor(date, min);
  return Array.from({ length: TOTAL_LANES }, (_, i) => {
    const n = i + 1;
    const closed = d.closedLanes[String(n)];
    if (closed) return { kind: "closed", label: closed.reason };
    const order = d.orders.find((o) => o.date === date && o.lanes.includes(n) && o.status !== "cancelled" && o.status !== "refunded" && min >= o.start && min < o.start + o.hours * 60);
    if (order) return { kind: "order", label: order.name, order };
    const hold = d.holds.find((h) => h.date === date && min >= h.from && min < h.to && n >= h.first && n <= h.last);
    if (hold) return { kind: "hold", label: hold.reason };
    if (siteHold) return { kind: "hold", label: siteHold.reason };
    if (traffic.has(n)) return { kind: "walkin", label: "Open play (demo traffic)" };
    return { kind: "open", label: "Open" };
  });
}

const STYLE: Record<LaneState["kind"], string> = {
  open: "from-amber-100 via-amber-300 to-amber-500 text-amber-950",
  order: "from-cyan-300 via-cyan-400 to-blue-600 text-slate-950",
  walkin: "from-slate-500 via-slate-600 to-slate-700 text-slate-100",
  hold: "from-violet-400 via-violet-500 to-fuchsia-700 text-white",
  closed: "from-rose-500 via-rose-600 to-rose-800 text-white",
};

function LaneDrawer({ d, lane, date, min, state, onClose }: { d: AdminData; lane: number; date: string; min: number; state: LaneState; onClose: () => void }) {
  const closed = d.closedLanes[String(lane)];
  const ov = d.laneOverrides[String(lane)];
  const [reason, setReason] = useState("Maintenance");
  const [extra, setExtra] = useState(String(ov?.extra ?? 0));
  const [label, setLabel] = useState(ov?.label ?? "");
  const [msg, setMsg] = useState("");
  const todays = d.orders.filter((o) => o.date === date && o.lanes.includes(lane) && o.status !== "cancelled" && o.status !== "refunded").sort((a, b) => a.start - b.start);

  function walkIn() {
    const total = Math.round((lanePrice(d, date, min, lane) + d.shoes * 4) * (1 + d.taxRate) * 100) / 100;
    const code = `BW-W${Math.floor(Math.random() * 90000 + 10000)}`;
    updateAdmin((x) => ({ ...x, orders: [{ code, status: "checked-in", date, start: min, hours: 1, lanes: [lane], guests: 4, shoes: 4, name: "Walk-in", phone: "", email: "", total, paid: total, refunded: 0, payAt: "desk", source: "walk-in", createdAt: new Date().toISOString(), notes: "Started from lane board" }, ...x.orders] }), `Walk-in started on lane ${lane} (${code})`);
    setMsg(`Walk-in started on lane ${lane} for 1 hour`);
  }

  return (
    <Drawer open onClose={onClose} title={`Lane ${lane}`}>
      <div className="space-y-5 text-sm text-slate-300">
        <div className="flex flex-wrap gap-2">
          <Badge tone={state.kind === "closed" ? "rose" : state.kind === "order" ? "cyan" : state.kind === "hold" ? "fuchsia" : state.kind === "walkin" ? "slate" : "emerald"}>{state.kind === "order" ? "Booked" : state.kind}</Badge>
          <Badge>{timeLabel(min)} on {new Date(date + "T12:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</Badge>
          <Badge tone="amber">{money(lanePrice(d, date, min, lane))}/hr now</Badge>
        </div>
        <p>{state.label}</p>
        {msg && <p className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-cyan-100">✓ {msg}</p>}

        <div className="rounded-xl border border-white/10 p-4">
          <p className="mb-2 font-semibold text-white">{closed ? "Lane is closed" : "Close this lane"}</p>
          {closed ? (
            <>
              <p className="mb-3">Reason: {closed.reason}. It can’t be booked online until you reopen it.</p>
              <Btn tone="success" onClick={() => { updateAdmin((x) => { const c = { ...x.closedLanes }; delete c[String(lane)]; return { ...x, closedLanes: c }; }, `Lane ${lane} reopened`); setMsg("Lane reopened"); }}>Reopen lane</Btn>
            </>
          ) : (
            <div className="flex gap-2">
              <select className={inputCls} value={reason} onChange={(e) => setReason(e.target.value)} aria-label="Reason">
                {["Maintenance", "Pinsetter repair", "Lane oiling", "Ball return jam", "Scoring screen down", "Private reservation", "Staff shortage"].map((r) => <option key={r}>{r}</option>)}
              </select>
              <Btn tone="danger" onClick={() => { updateAdmin((x) => ({ ...x, closedLanes: { ...x.closedLanes, [String(lane)]: { reason } } }), `Lane ${lane} closed: ${reason}`); setMsg(`Lane closed: ${reason}`); }}>Close</Btn>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/10 p-4">
          <p className="mb-1 font-semibold text-white">Lane price</p>
          <p className="mb-3 text-xs text-slate-500">Base rate comes from Pricing ({tierFor(d, date, min).label}: {money(tierFor(d, date, min).hour)}/hr). Add an amount for premium lanes, or a negative number to discount this lane.</p>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Extra per hour"><input className={inputCls} inputMode="decimal" value={extra} onChange={(e) => setExtra(e.target.value.replace(/[^\d.-]/g, ""))} /></Field>
            <Field label="Label"><input className={inputCls} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="VIP lane" /></Field>
          </div>
          <div className="mt-2">
            <Btn onClick={() => { const v = Number(extra) || 0; updateAdmin((x) => { const o = { ...x.laneOverrides }; if (v) o[String(lane)] = { extra: v, label }; else delete o[String(lane)]; return { ...x, laneOverrides: o }; }, `Lane ${lane} price ${v ? `${v > 0 ? "+" : ""}${money(v)}/hr${label ? ` (${label})` : ""}` : "back to base rate"}`); setMsg("Lane price saved"); }}>Save price</Btn>
          </div>
        </div>

        {state.kind === "open" && <Btn tone="primary" onClick={walkIn}>Start a walk-in here (1 hr)</Btn>}

        <div>
          <p className="mb-2 font-semibold text-white">Bookings on this lane that day</p>
          {todays.length === 0 ? <p className="text-slate-500">None.</p> : (
            <ul className="space-y-1">
              {todays.map((o) => <li key={o.code} className="rounded-lg border border-white/10 px-3 py-2">{timeLabel(o.start)}–{timeLabel(o.start + o.hours * 60)} · {o.name} · <span className="font-mono text-xs">{o.code}</span> · {o.status}</li>)}
            </ul>
          )}
        </div>
      </div>
    </Drawer>
  );
}

export function LaneBoard({ d }: { d: AdminData }) {
  const now = new Date();
  const [date, setDate] = useState(todayIso());
  const [min, setMin] = useState(Math.max(9 * 60, Math.floor((now.getHours() * 60 + now.getMinutes()) / 30) * 30));
  const [open, setOpen] = useState<number | null>(null);
  const states = useMemo(() => laneStates(d, date, min), [d, date, min]);
  const count = (k: LaneState["kind"]) => states.filter((s) => s.kind === k).length;

  return (
    <Panel
      title="Live lane board"
      action={
        <div className="flex flex-wrap items-center gap-2">
          <input type="date" className={`${inputCls} w-auto`} value={date} onChange={(e) => setDate(e.target.value)} aria-label="Date" />
          <select className={`${inputCls} w-auto`} value={min} onChange={(e) => setMin(Number(e.target.value))} aria-label="Time">
            {Array.from({ length: 36 }, (_, i) => 9 * 60 + i * 30).map((m) => <option key={m} value={m}>{timeLabel(m)}</option>)}
          </select>
        </div>
      }
    >
      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <Badge tone="emerald">Open {count("open")}</Badge>
        <Badge tone="cyan">Booked {count("order")}</Badge>
        <Badge>Open play {count("walkin")}</Badge>
        <Badge tone="fuchsia">Held / league {count("hold")}</Badge>
        <Badge tone="rose">Closed {count("closed")}</Badge>
      </div>
      <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10 lg:grid-cols-[repeat(20,minmax(0,1fr))]">
        {states.map((s, i) => {
          const n = i + 1;
          const ov = d.laneOverrides[String(n)];
          return (
            <button key={n} type="button" onClick={() => setOpen(n)} title={`Lane ${n}: ${s.label}`} data-admin-lane={n}
              className={`relative flex h-24 flex-col items-center justify-between rounded-md bg-gradient-to-b p-1 text-[10px] font-bold shadow transition hover:-translate-y-0.5 hover:ring-2 hover:ring-white/60 ${STYLE[s.kind]}`}>
              <span className="text-[9px] leading-none tracking-[-0.1em]" aria-hidden>{"●●●●"}</span>
              <span className="line-clamp-2 text-center text-[9px] font-semibold leading-tight opacity-90">{s.kind === "open" ? "" : s.kind === "order" ? s.label.split(" ")[0] : s.kind === "closed" ? "CLOSED" : s.kind === "hold" ? "HOLD" : ""}</span>
              <span className="text-sm leading-none">{n}</span>
              {ov && <span className="absolute -right-1 -top-1 rounded-full bg-orange-400 px-1 text-[8px] text-slate-950">$</span>}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-slate-500">Tap a lane to close or reopen it, change its price, see its bookings, or start a walk-in. Grey “open play” lanes are the demo’s simulated walk-in traffic.</p>
      {open !== null && <LaneDrawer d={d} lane={open} date={date} min={min} state={states[open - 1]} onClose={() => setOpen(null)} />}
    </Panel>
  );
}
