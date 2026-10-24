"use client";

import { useMemo, useState } from "react";
import { TOTAL_LANES } from "@/lib/lanes";
import { adminBlocked, addDays, lanePrice, money, timeLabel, todayIso, updateAdmin, type AdminData, type Order, type OrderStatus } from "@/lib/admin-store";
import { Badge, Btn, Drawer, Empty, Field, Panel, StatusBadge, downloadCsv, inputCls } from "./ui";

const STATUSES: (OrderStatus | "all")[] = ["all", "pending", "confirmed", "checked-in", "completed", "cancelled", "refunded"];
const dateLabel = (d: string) => new Date(d + "T12:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

export function parseLanes(s: string) {
  return [...new Set(s.split(/[ ,]+/).map(Number).filter((n) => n >= 1 && n <= TOTAL_LANES))].sort((a, b) => a - b);
}

function OrderDrawer({ d, order, onClose }: { d: AdminData; order: Order; onClose: () => void }) {
  const [refund, setRefund] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [laneText, setLaneText] = useState(order.lanes.join(", "));
  const [msg, setMsg] = useState("");
  const refundable = Math.round((order.paid - order.refunded) * 100) / 100;
  const set = (patch: Partial<Order>, log: string) => {
    updateAdmin((x) => ({ ...x, orders: x.orders.map((o) => (o.code === order.code ? { ...o, ...patch } : o)) }), `${order.code}: ${log}`);
    setMsg(log);
  };

  function doRefund(amount: number, cancel: boolean) {
    const amt = Math.min(refundable, Math.max(0, amount));
    if (!amt && !cancel) return setMsg("Enter an amount to refund.");
    const refunded = Math.round((order.refunded + amt) * 100) / 100;
    const full = refunded >= order.paid && order.paid > 0;
    set(
      { refunded, status: cancel ? (amt > 0 ? "refunded" : "cancelled") : full ? "refunded" : order.status, notes: [order.notes, `Refund ${money(amt)}${reason ? `: ${reason}` : ""}`].filter(Boolean).join(" · ") },
      cancel ? `cancelled${amt ? `, refunded ${money(amt)}` : ""}${reason ? ` (${reason})` : ""}` : `refunded ${money(amt)}${reason ? ` (${reason})` : ""}`,
    );
    setRefund("");
  }

  function moveLanes() {
    const lanes = parseLanes(laneText);
    if (!lanes.length) return setMsg("Enter lane numbers, e.g. 21, 22");
    const blocked = adminBlocked(d, order.date, order.start, order.hours * 60, order.code);
    const clash = lanes.filter((n) => blocked.has(n));
    if (clash.length) return setMsg(`Lane ${clash.join(", ")} is booked, held or closed at that time.`);
    set({ lanes }, `moved to lane${lanes.length > 1 ? "s" : ""} ${lanes.join(", ")}`);
  }

  const live = order.status !== "cancelled" && order.status !== "refunded";
  return (
    <Drawer open onClose={onClose} title={order.code}>
      <div className="space-y-5 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={order.status} />
          <Badge tone={order.payAt === "online" ? "cyan" : "amber"}>{order.payAt === "online" ? "Paid online" : "Pay at desk"}</Badge>
          <Badge>{order.source}</Badge>
          {order.sample && <Badge tone="fuchsia">Sample</Badge>}
        </div>
        <dl className="grid grid-cols-[110px_1fr] gap-y-1.5 text-slate-300">
          <dt className="text-slate-500">When</dt><dd>{dateLabel(order.date)} · {timeLabel(order.start)}–{timeLabel(order.start + order.hours * 60)}</dd>
          <dt className="text-slate-500">Lanes</dt><dd>{order.lanes.join(", ")} · {order.guests} bowlers · {order.shoes} shoes</dd>
          <dt className="text-slate-500">Customer</dt><dd>{order.name}<br /><a className="text-cyan-300" href={`tel:${order.phone}`}>{order.phone}</a> · {order.email}</dd>
          <dt className="text-slate-500">Total</dt><dd>{money(order.total)} · paid {money(order.paid)}{order.refunded ? ` · refunded ${money(order.refunded)}` : ""}</dd>
          {order.notes && (<><dt className="text-slate-500">Notes</dt><dd className="text-slate-400">{order.notes}</dd></>)}
        </dl>
        {msg && <p className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-cyan-100">✓ {msg}</p>}

        {live && (
          <div className="flex flex-wrap gap-2">
            {order.status === "pending" && <Btn tone="success" onClick={() => set({ status: "confirmed" }, "confirmed")}>Confirm</Btn>}
            {(order.status === "pending" || order.status === "confirmed") && <Btn tone="success" onClick={() => set({ status: "checked-in" }, "checked in")}>Check in</Btn>}
            {order.status === "checked-in" && <Btn onClick={() => set({ status: "completed" }, "completed")}>Mark completed</Btn>}
            {order.paid < order.total && <Btn onClick={() => set({ paid: order.total }, `payment of ${money(order.total - order.paid)} taken at the desk`)}>Mark paid</Btn>}
            <Btn onClick={() => setMsg(`Confirmation re-sent to ${order.email}${order.phone ? " and by text" : ""} (demo)`)}>Resend confirmation</Btn>
          </div>
        )}

        {live && (
          <div className="rounded-xl border border-white/10 p-4">
            <p className="mb-2 font-semibold text-white">Move lanes</p>
            <div className="flex gap-2">
              <input className={inputCls} value={laneText} onChange={(e) => setLaneText(e.target.value)} aria-label="Lanes" />
              <Btn onClick={moveLanes}>Move</Btn>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-white/10 p-4">
          <p className="mb-2 font-semibold text-white">Refund {refundable > 0 && <span className="font-normal text-slate-400">· up to {money(refundable)}</span>}</p>
          {refundable > 0 ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input className={inputCls} inputMode="decimal" placeholder="Amount" value={refund} onChange={(e) => setRefund(e.target.value.replace(/[^\d.]/g, ""))} aria-label="Refund amount" />
                <Btn onClick={() => setRefund(String(refundable))}>Full</Btn>
              </div>
              <input className={inputCls} placeholder="Reason (optional, saved on the order)" value={reason} onChange={(e) => setReason(e.target.value)} />
              <Btn tone="danger" onClick={() => doRefund(Number(refund), false)}>Issue refund</Btn>
              <p className="text-[11px] text-slate-500">Goes back to the original card through the payment processor (demo: recorded only).</p>
            </div>
          ) : (
            <p className="text-slate-500">Nothing paid to refund.</p>
          )}
        </div>

        {live && (
          <div className="rounded-xl border border-rose-400/30 p-4">
            <p className="mb-2 font-semibold text-rose-200">Cancel booking</p>
            <p className="mb-3 text-slate-400">Frees the lanes right away{refundable ? ", and you can refund in the same step" : ""}.</p>
            <div className="flex flex-wrap gap-2">
              {refundable > 0 && <Btn tone="danger" onClick={() => doRefund(refundable, true)}>Cancel + refund {money(refundable)}</Btn>}
              <Btn tone="danger" onClick={() => doRefund(0, true)}>Cancel{refundable ? " without refund" : ""}</Btn>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-white/10 p-4">
          <p className="mb-2 font-semibold text-white">Add a note</p>
          <div className="flex gap-2">
            <input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Needs ramp, birthday on lane 22" />
            <Btn onClick={() => { if (note.trim()) { set({ notes: [order.notes, note.trim()].filter(Boolean).join(" · ") }, "note added"); setNote(""); } }}>Save</Btn>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

function NewBooking({ d, onClose }: { d: AdminData; onClose: () => void }) {
  const now = new Date();
  const [f, setF] = useState({ date: todayIso(), start: Math.ceil((now.getHours() * 60 + now.getMinutes()) / 30) * 30, hours: 1, lanes: "", guests: 4, name: "", phone: "", source: "walk-in" as Order["source"], paid: true });
  const [err, setErr] = useState("");
  const lanes = parseLanes(f.lanes);
  const total = Math.round((lanes.reduce((s, n) => s + lanePrice(d, f.date, f.start, n) * f.hours, 0) + d.shoes * f.guests) * (1 + d.taxRate) * 100) / 100;

  function save() {
    if (!lanes.length || !f.name.trim()) return setErr("Add lanes and a name.");
    const blocked = adminBlocked(d, f.date, f.start, f.hours * 60);
    const clash = lanes.filter((n) => blocked.has(n));
    if (clash.length) return setErr(`Lane ${clash.join(", ")} is booked, held or closed then.`);
    const code = `BW-${f.source === "walk-in" ? "W" : "P"}${Math.floor(Math.random() * 90000 + 10000)}`;
    updateAdmin((x) => ({
      ...x,
      orders: [{ code, status: f.source === "walk-in" ? "checked-in" : "confirmed", date: f.date, start: f.start, hours: f.hours, lanes, guests: f.guests, shoes: f.guests, name: f.name, phone: f.phone, email: "", total, paid: f.paid ? total : 0, refunded: 0, payAt: "desk", source: f.source, createdAt: new Date().toISOString(), notes: "" }, ...x.orders],
    }), `New ${f.source} booking ${code}: lane${lanes.length > 1 ? "s" : ""} ${lanes.join(", ")}`);
    onClose();
  }

  return (
    <Drawer open onClose={onClose} title="New booking">
      <div className="grid gap-4">
        <div className="flex gap-2">
          {(["walk-in", "phone"] as const).map((s) => <Btn key={s} tone={f.source === s ? "primary" : "ghost"} onClick={() => setF({ ...f, source: s })}>{s === "walk-in" ? "Walk-in" : "Phone booking"}</Btn>)}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date"><input type="date" className={inputCls} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
          <Field label="Start">
            <select className={inputCls} value={f.start} onChange={(e) => setF({ ...f, start: Number(e.target.value) })}>
              {Array.from({ length: 36 }, (_, i) => 9 * 60 + i * 30).map((m) => <option key={m} value={m}>{timeLabel(m)}</option>)}
            </select>
          </Field>
          <Field label="Hours"><select className={inputCls} value={f.hours} onChange={(e) => setF({ ...f, hours: Number(e.target.value) })}>{[1, 1.5, 2, 3].map((h) => <option key={h} value={h}>{h}</option>)}</select></Field>
          <Field label="Bowlers"><input type="number" min={1} className={inputCls} value={f.guests} onChange={(e) => setF({ ...f, guests: Math.max(1, Number(e.target.value)) })} /></Field>
          <Field label="Lanes" hint="e.g. 21, 22"><input className={inputCls} value={f.lanes} onChange={(e) => setF({ ...f, lanes: e.target.value })} /></Field>
          <Field label="Name"><input className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="Phone"><input className={inputCls} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
          <Field label="Paid now?"><select className={inputCls} value={f.paid ? "y" : "n"} onChange={(e) => setF({ ...f, paid: e.target.value === "y" })}><option value="y">Yes</option><option value="n">Pay later</option></select></Field>
        </div>
        <p className="text-sm text-slate-300">Total with shoes and tax: <span className="font-bold text-cyan-200">{money(total)}</span></p>
        {err && <p className="text-sm text-amber-300">{err}</p>}
        <Btn tone="primary" onClick={save}>Save booking</Btn>
      </div>
    </Drawer>
  );
}

export function Orders({ d, initialStatus }: { d: AdminData; initialStatus?: OrderStatus | "all" }) {
  const [status, setStatus] = useState<OrderStatus | "all">(initialStatus ?? "all");
  const [range, setRange] = useState<"today" | "upcoming" | "past" | "all">("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const t = todayIso();
  const list = useMemo(() => d.orders
    .filter((o) => status === "all" || o.status === status)
    .filter((o) => range === "all" || (range === "today" ? o.date === t : range === "upcoming" ? o.date >= t : o.date < t))
    .filter((o) => !q || `${o.code} ${o.name} ${o.phone} ${o.email} ${o.lanes.join(" ")}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (a.date + String(a.start).padStart(4, "0")).localeCompare(b.date + String(b.start).padStart(4, "0"))), [d.orders, status, range, q, t]);
  const current = d.orders.find((o) => o.code === open);

  return (
    <Panel
      title="Orders"
      action={
        <div className="flex gap-2">
          <Btn onClick={() => downloadCsv(`boardwalk-orders-${t}.csv`, [["Code", "Status", "Date", "Start", "Hours", "Lanes", "Guests", "Name", "Phone", "Email", "Total", "Paid", "Refunded", "Source"], ...list.map((o) => [o.code, o.status, o.date, timeLabel(o.start), o.hours, o.lanes.join(" "), o.guests, o.name, o.phone, o.email, o.total, o.paid, o.refunded, o.source])])}>Export CSV</Btn>
          <Btn tone="primary" onClick={() => setCreating(true)}>+ New booking</Btn>
        </div>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {STATUSES.map((s) => (
          <button key={s} type="button" onClick={() => setStatus(s)} className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${status === s ? "bg-cyan-400 text-slate-950" : "border border-white/10 text-slate-300"}`}>
            {s} {s !== "all" && <span className="opacity-60">{d.orders.filter((o) => o.status === s).length}</span>}
          </button>
        ))}
        <select className={`${inputCls} w-auto`} value={range} onChange={(e) => setRange(e.target.value as typeof range)} aria-label="Date range">
          <option value="all">All dates</option><option value="today">Today</option><option value="upcoming">Today & upcoming</option><option value="past">Past</option>
        </select>
        <input className={`${inputCls} w-56`} placeholder="Search name, phone, code, lane" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {list.length === 0 ? <Empty>No orders match.</Empty> : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-slate-500">
              <tr><th className="py-2">Code</th><th>When</th><th>Lanes</th><th>Customer</th><th>Total</th><th>Status</th><th /></tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {list.map((o) => (
                <tr key={o.code} className="cursor-pointer hover:bg-cyan-500/5" onClick={() => setOpen(o.code)}>
                  <td className="py-2.5 font-mono text-xs">{o.code}{o.sample && <span className="ml-1 text-[10px] text-fuchsia-300">sample</span>}</td>
                  <td>{o.date === t ? "Today" : o.date === addDays(t, 1) ? "Tomorrow" : dateLabel(o.date)} · {timeLabel(o.start)}</td>
                  <td>{o.lanes.join(", ")}</td>
                  <td>{o.name}<span className="block text-xs text-slate-500">{o.guests} bowlers · {o.source}</span></td>
                  <td>{money(o.total)}{o.refunded > 0 && <span className="block text-xs text-fuchsia-300">−{money(o.refunded)}</span>}{o.paid < o.total && o.status !== "cancelled" && <span className="block text-xs text-amber-300">unpaid</span>}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td className="text-right text-cyan-300">Open →</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {current && <OrderDrawer key={current.code} d={d} order={current} onClose={() => setOpen(null)} />}
      {creating && <NewBooking d={d} onClose={() => setCreating(false)} />}
    </Panel>
  );
}
