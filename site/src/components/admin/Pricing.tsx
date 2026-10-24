"use client";

import { useState } from "react";
import { DAILY_SPECIALS } from "@/lib/site-data";
import { money, timeLabel, todayIso, updateAdmin, type AdminData, type Hold } from "@/lib/admin-store";
import { parseLanes } from "./Orders";
import { Badge, Btn, Empty, Field, Panel, Toggle, inputCls } from "./ui";

const num = (v: string) => Number(v.replace(/[^\d.-]/g, "")) || 0;

export function Pricing({ d }: { d: AdminData }) {
  const [tiers, setTiers] = useState(d.tiers.map((t) => ({ ...t, hour: String(t.hour), game: String(t.game) })));
  const [shoes, setShoes] = useState(String(d.shoes));
  const [tax, setTax] = useState(String(Math.round(d.taxRate * 1000) / 10));
  const [pkgs, setPkgs] = useState(d.packages.map((p) => ({ ...p, price: String(p.pricePerChild) })));
  const [ovLanes, setOvLanes] = useState("");
  const [ovExtra, setOvExtra] = useState("10");
  const [ovLabel, setOvLabel] = useState("VIP lane");
  const [saved, setSaved] = useState("");

  function saveRates() {
    updateAdmin((x) => ({ ...x, tiers: tiers.map((t) => ({ ...t, hour: num(t.hour), game: num(t.game) })), shoes: num(shoes), taxRate: num(tax) / 100 }),
      `Prices updated: ${tiers.map((t) => `${t.label} ${money(num(t.hour))}/hr`).join(", ")}; shoes ${money(num(shoes))}`);
    setSaved("Rates saved. The Rent a lane page uses them right away.");
  }

  return (
    <div className="space-y-5">
      <Panel title="Lane rates" action={<Btn tone="primary" onClick={saveRates}>Save rates</Btn>}>
        {saved && <p className="mb-3 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">✓ {saved}</p>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="text-left text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="py-2">Time block</th><th>Per lane / hour</th><th>Per person / game</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {tiers.map((t, i) => (
                <tr key={t.id}>
                  <td className="py-2 text-slate-200">{t.label}</td>
                  <td className="pr-3"><input className={inputCls} inputMode="decimal" value={t.hour} onChange={(e) => setTiers(tiers.map((x, j) => (j === i ? { ...x, hour: e.target.value } : x)))} aria-label={`${t.label} hourly`} /></td>
                  <td><input className={inputCls} inputMode="decimal" value={t.game} onChange={(e) => setTiers(tiers.map((x, j) => (j === i ? { ...x, game: e.target.value } : x)))} aria-label={`${t.label} per game`} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid max-w-md grid-cols-2 gap-3">
          <Field label="Shoe rental"><input className={inputCls} inputMode="decimal" value={shoes} onChange={(e) => setShoes(e.target.value)} /></Field>
          <Field label="Sales tax %"><input className={inputCls} inputMode="decimal" value={tax} onChange={(e) => setTax(e.target.value)} /></Field>
        </div>
      </Panel>

      <Panel title="Premium & discounted lanes">
        <p className="mb-3 text-sm text-slate-400">Charge more for VIP or lounge lanes, or less for lanes near the arcade. Added on top of the time-block rate.</p>
        {Object.keys(d.laneOverrides).length === 0 ? <Empty>No lane price changes.</Empty> : (
          <ul className="mb-4 flex flex-wrap gap-2">
            {Object.entries(d.laneOverrides).sort((a, b) => Number(a[0]) - Number(b[0])).map(([n, o]) => (
              <li key={n} className="flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-500/10 px-3 py-1 text-sm text-orange-100">
                Lane {n}: {o.extra > 0 ? "+" : ""}{money(o.extra)}/hr{o.label ? ` · ${o.label}` : ""}
                <button type="button" aria-label={`Remove lane ${n} price`} className="text-orange-300" onClick={() => updateAdmin((x) => { const c = { ...x.laneOverrides }; delete c[n]; return { ...x, laneOverrides: c }; }, `Lane ${n} back to base rate`)}>✕</button>
              </li>
            ))}
          </ul>
        )}
        <div className="grid gap-3 sm:grid-cols-[1fr_120px_1fr_auto] sm:items-end">
          <Field label="Lanes" hint="e.g. 79, 80"><input className={inputCls} value={ovLanes} onChange={(e) => setOvLanes(e.target.value)} /></Field>
          <Field label="+/− per hour"><input className={inputCls} value={ovExtra} onChange={(e) => setOvExtra(e.target.value)} /></Field>
          <Field label="Label"><input className={inputCls} value={ovLabel} onChange={(e) => setOvLabel(e.target.value)} /></Field>
          <Btn onClick={() => { const lanes = parseLanes(ovLanes); if (!lanes.length) return; updateAdmin((x) => { const o = { ...x.laneOverrides }; lanes.forEach((n) => (o[String(n)] = { extra: num(ovExtra), label: ovLabel })); return { ...x, laneOverrides: o }; }, `Lane price ${num(ovExtra) > 0 ? "+" : ""}${money(num(ovExtra))}/hr on lanes ${lanes.join(", ")}`); setOvLanes(""); }}>Apply</Btn>
        </div>
      </Panel>

      <Panel title="Birthday packages" action={<Btn onClick={() => updateAdmin((x) => ({ ...x, packages: pkgs.map((p) => ({ id: p.id, name: p.name, pricePerChild: num(p.price) })) }), `Party packages: ${pkgs.map((p) => `${p.name} ${money(num(p.price))}`).join(", ")}`)}>Save packages</Btn>}>
        <div className="grid gap-3 sm:grid-cols-2">
          {pkgs.map((p, i) => (
            <div key={p.id} className="grid grid-cols-[1fr_120px] gap-2">
              <Field label="Package"><input className={inputCls} value={p.name} onChange={(e) => setPkgs(pkgs.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} /></Field>
              <Field label="Per child"><input className={inputCls} value={p.price} onChange={(e) => setPkgs(pkgs.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)))} /></Field>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function Schedule({ d }: { d: AdminData }) {
  const [h, setH] = useState<Omit<Hold, "id">>({ date: todayIso(), from: 18 * 60, to: 21 * 60, first: 1, last: 20, reason: "Tournament" });
  const [hours, setHours] = useState(d.hours);
  const times = Array.from({ length: 41 }, (_, i) => 6 * 60 + i * 30);
  const upcoming = [...d.holds].sort((a, b) => (a.date + a.from).localeCompare(b.date + b.from));

  return (
    <div className="space-y-5">
      <Panel title="Block lanes (tournaments, leagues, private events)">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Field label="Date"><input type="date" className={inputCls} value={h.date} onChange={(e) => setH({ ...h, date: e.target.value })} /></Field>
          <Field label="From"><select className={inputCls} value={h.from} onChange={(e) => setH({ ...h, from: Number(e.target.value) })}>{times.map((m) => <option key={m} value={m}>{timeLabel(m)}</option>)}</select></Field>
          <Field label="To"><select className={inputCls} value={h.to} onChange={(e) => setH({ ...h, to: Number(e.target.value) })}>{times.map((m) => <option key={m} value={m}>{timeLabel(m)}</option>)}</select></Field>
          <Field label="First lane"><input type="number" min={1} max={80} className={inputCls} value={h.first} onChange={(e) => setH({ ...h, first: Math.min(80, Math.max(1, Number(e.target.value))) })} /></Field>
          <Field label="Last lane"><input type="number" min={1} max={80} className={inputCls} value={h.last} onChange={(e) => setH({ ...h, last: Math.min(80, Math.max(1, Number(e.target.value))) })} /></Field>
          <Field label="Reason"><select className={inputCls} value={h.reason} onChange={(e) => setH({ ...h, reason: e.target.value })}>{["Tournament", "League", "Private event", "School group", "Maintenance", "Holiday closure"].map((r) => <option key={r}>{r}</option>)}</select></Field>
        </div>
        <div className="mt-3">
          <Btn tone="primary" disabled={h.to <= h.from || h.last < h.first} onClick={() => updateAdmin((x) => ({ ...x, holds: [...x.holds, { ...h, id: `H${Date.now()}` }] }), `Lanes ${h.first}–${h.last} blocked ${h.date} ${timeLabel(h.from)}–${timeLabel(h.to)} (${h.reason})`)}>Block lanes {h.first}–{h.last}</Btn>
        </div>
        <div className="mt-5">
          {upcoming.length === 0 ? <Empty>No blocks yet. The site already blocks the holds listed on the live site (Oct 25, Oct 27–29, Thanksgiving) and the Tue/Thu league nights.</Empty> : (
            <ul className="space-y-2 text-sm">
              {upcoming.map((x) => (
                <li key={x.id} className="flex items-center justify-between gap-3 rounded-lg border border-violet-400/30 bg-violet-500/10 px-3 py-2 text-violet-100">
                  <span>{new Date(x.date + "T12:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {timeLabel(x.from)}–{timeLabel(x.to)} · lanes {x.first}–{x.last} · {x.reason}</span>
                  <Btn small tone="danger" onClick={() => updateAdmin((y) => ({ ...y, holds: y.holds.filter((z) => z.id !== x.id) }), `Removed block: lanes ${x.first}–${x.last} on ${x.date}`)}>Remove</Btn>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Panel>

      <Panel title="Opening hours" action={<Btn onClick={() => updateAdmin((x) => ({ ...x, hours }), "Opening hours updated")}>Save hours</Btn>}>
        <div className="grid gap-2 sm:grid-cols-2">
          {hours.map((r, i) => (
            <div key={r.day} className="grid grid-cols-[100px_1fr_1fr] items-center gap-2 text-sm">
              <span className="text-slate-300">{r.day}</span>
              <input className={inputCls} value={r.open} onChange={(e) => setHours(hours.map((x, j) => (j === i ? { ...x, open: e.target.value } : x)))} aria-label={`${r.day} open`} />
              <input className={inputCls} value={r.close} onChange={(e) => setHours(hours.map((x, j) => (j === i ? { ...x, close: e.target.value } : x)))} aria-label={`${r.day} close`} />
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">Shown on the site and used for booking start times in production.</p>
      </Panel>

      <Panel title="Daily specials">
        <ul className="space-y-2">
          {d.specials.map((s) => {
            const info = DAILY_SPECIALS.find((x) => x.day === s.day);
            return (
              <li key={s.day} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-2 text-sm">
                <span><span className="font-semibold text-white">{s.name}</span> <span className="text-slate-400">· {info?.time} · {info?.deals.join(", ")}</span></span>
                <span className="flex items-center gap-2">{s.active ? <Badge tone="emerald">On</Badge> : <Badge>Off</Badge>}<Toggle label={`${s.name} on or off`} on={s.active} onChange={(v) => updateAdmin((x) => ({ ...x, specials: x.specials.map((y) => (y.day === s.day ? { ...y, active: v } : y)) }), `${s.name} turned ${v ? "on" : "off"}`)} /></span>
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}
