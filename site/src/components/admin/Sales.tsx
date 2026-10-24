"use client";

import { useState } from "react";
import { daysAgoIso, money, randomCode, todayIso, updateAdmin, type AdminData, type Discount } from "@/lib/admin-store";
import { Badge, Btn, Empty, Field, Panel, Stat, Toggle, downloadCsv, inputCls } from "./ui";

const num = (v: string) => Number(v.replace(/[^\d.-]/g, "")) || 0;
const day = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export function GiftCards({ d }: { d: AdminData }) {
  const [q, setQ] = useState("");
  const [issue, setIssue] = useState({ amount: "50", to: "", reason: "Customer service credit" });
  const [adjust, setAdjust] = useState<Record<string, string>>({});
  const [bonus, setBonus] = useState({ ...d.giftBonus, buy: String(d.giftBonus.buy), get: String(d.giftBonus.get) });
  const list = d.giftCards.filter((g) => !q || `${g.code} ${g.buyer} ${g.recipient}`.toLowerCase().includes(q.toLowerCase()));
  const sold = d.giftCards.filter((g) => g.message !== "Bonus card" && g.buyer !== "Boardwalk Bowl").reduce((s, g) => s + g.initial, 0);
  const unspent = d.giftCards.filter((g) => g.active).reduce((s, g) => s + g.balance, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Gift cards sold" value={money(sold)} sub={`${d.giftCards.length} cards`} tone="fuchsia" />
        <Stat label="Unspent balance" value={money(unspent)} sub="still owed to customers" tone="amber" />
        <Stat label="Redeemed" value={money(d.giftCards.reduce((s, g) => s + g.initial - g.balance, 0))} tone="emerald" />
      </div>

      <Panel title="Bonus offer" action={<Btn onClick={() => updateAdmin((x) => ({ ...x, giftBonus: { active: bonus.active, buy: num(bonus.buy), get: num(bonus.get), label: bonus.label } }), `Gift card bonus ${bonus.active ? "on" : "off"}: buy ${money(num(bonus.buy))} get ${money(num(bonus.get))}`)}>Save offer</Btn>}>
        <div className="grid gap-3 sm:grid-cols-[auto_120px_120px_1fr] sm:items-end">
          <Field label="On"><Toggle label="Bonus offer on" on={bonus.active} onChange={(v) => setBonus({ ...bonus, active: v })} /></Field>
          <Field label="For every"><input className={inputCls} value={bonus.buy} onChange={(e) => setBonus({ ...bonus, buy: e.target.value })} /></Field>
          <Field label="Bonus card"><input className={inputCls} value={bonus.get} onChange={(e) => setBonus({ ...bonus, get: e.target.value })} /></Field>
          <Field label="Message on the site"><input className={inputCls} value={bonus.label} onChange={(e) => setBonus({ ...bonus, label: e.target.value })} /></Field>
        </div>
      </Panel>

      <Panel title="Issue a gift card">
        <div className="grid gap-3 sm:grid-cols-[120px_1fr_1fr_auto] sm:items-end">
          <Field label="Amount"><input className={inputCls} value={issue.amount} onChange={(e) => setIssue({ ...issue, amount: e.target.value })} /></Field>
          <Field label="For"><input className={inputCls} value={issue.to} onChange={(e) => setIssue({ ...issue, to: e.target.value })} placeholder="Customer name" /></Field>
          <Field label="Reason"><input className={inputCls} value={issue.reason} onChange={(e) => setIssue({ ...issue, reason: e.target.value })} /></Field>
          <Btn tone="primary" disabled={!num(issue.amount) || !issue.to.trim()} onClick={() => { const code = randomCode("GC"); updateAdmin((x) => ({ ...x, giftCards: [{ code, initial: num(issue.amount), balance: num(issue.amount), buyer: "Boardwalk Bowl", recipient: issue.to, message: issue.reason, createdAt: new Date().toISOString(), active: true }, ...x.giftCards] }), `Issued gift card ${code} ${money(num(issue.amount))} to ${issue.to} (${issue.reason})`); setIssue({ ...issue, to: "" }); }}>Issue</Btn>
        </div>
        <p className="mt-2 text-xs text-slate-500">For make-goods, donations and raffles. Shows up in the list below with a code to give the customer.</p>
      </Panel>

      <Panel title="All gift cards" action={<div className="flex gap-2"><input className={`${inputCls} w-56`} placeholder="Search code or name" value={q} onChange={(e) => setQ(e.target.value)} /><Btn onClick={() => downloadCsv(`gift-cards-${todayIso()}.csv`, [["Code", "Initial", "Balance", "Buyer", "Recipient", "Created", "Active"], ...d.giftCards.map((g) => [g.code, g.initial, g.balance, g.buyer, g.recipient, g.createdAt, g.active ? "yes" : "no"])])}>CSV</Btn></div>}>
        {list.length === 0 ? <Empty>No gift cards.</Empty> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="py-2">Code</th><th>Balance</th><th>From → to</th><th>Sold</th><th>Adjust</th><th>Active</th></tr></thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {list.map((g) => (
                  <tr key={g.code}>
                    <td className="py-2 font-mono text-xs">{g.code}{g.sample && <span className="ml-1 text-[10px] text-fuchsia-300">sample</span>}</td>
                    <td><span className="font-semibold text-cyan-200">{money(g.balance)}</span> <span className="text-xs text-slate-500">of {money(g.initial)}</span></td>
                    <td className="text-xs">{g.buyer} → {g.recipient}</td>
                    <td className="text-xs text-slate-400">{day(g.createdAt)}</td>
                    <td>
                      <div className="flex gap-1">
                        <input className={`${inputCls} w-20 py-1`} placeholder="+/−" value={adjust[g.code] ?? ""} onChange={(e) => setAdjust({ ...adjust, [g.code]: e.target.value })} aria-label={`Adjust ${g.code}`} />
                        <Btn small onClick={() => { const v = num(adjust[g.code] ?? ""); if (!v) return; updateAdmin((x) => ({ ...x, giftCards: x.giftCards.map((c) => (c.code === g.code ? { ...c, balance: Math.max(0, Math.round((c.balance + v) * 100) / 100) } : c)) }), `Gift card ${g.code} balance ${v > 0 ? "+" : ""}${money(v)}`); setAdjust({ ...adjust, [g.code]: "" }); }}>Apply</Btn>
                      </div>
                    </td>
                    <td><Toggle label={`${g.code} active`} on={g.active} onChange={(v) => updateAdmin((x) => ({ ...x, giftCards: x.giftCards.map((c) => (c.code === g.code ? { ...c, active: v } : c)) }), `Gift card ${g.code} turned ${v ? "on" : "off"}`)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}

export function Discounts({ d }: { d: AdminData }) {
  const blank: Discount = { code: "", kind: "percent", value: 10, appliesTo: "lanes", active: true, uses: 0, maxUses: 0, expires: "", note: "" };
  const [f, setF] = useState({ ...blank, value: "10", maxUses: "0" });
  const exists = d.discounts.some((x) => x.code === f.code.trim().toUpperCase());

  return (
    <div className="space-y-5">
      <Panel title="Create a discount code">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Field label="Code"><input className={`${inputCls} uppercase`} value={f.code} onChange={(e) => setF({ ...f, code: e.target.value.replace(/\s/g, "") })} placeholder="SPRING20" /></Field>
          <Field label="Type"><select className={inputCls} value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value as Discount["kind"] })}><option value="percent">% off</option><option value="amount">$ off</option></select></Field>
          <Field label="Value"><input className={inputCls} value={f.value} onChange={(e) => setF({ ...f, value: e.target.value })} /></Field>
          <Field label="Applies to"><select className={inputCls} value={f.appliesTo} onChange={(e) => setF({ ...f, appliesTo: e.target.value as Discount["appliesTo"] })}><option value="lanes">Lane time only</option><option value="everything">Whole order</option></select></Field>
          <Field label="Max uses" hint="0 = unlimited"><input className={inputCls} value={f.maxUses} onChange={(e) => setF({ ...f, maxUses: e.target.value })} /></Field>
          <Field label="Expires"><input type="date" className={inputCls} value={f.expires} onChange={(e) => setF({ ...f, expires: e.target.value })} /></Field>
        </div>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div className="min-w-[240px] flex-1"><Field label="Internal note"><input className={inputCls} value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="Who it's for" /></Field></div>
          <Btn tone="primary" disabled={!f.code.trim() || !num(f.value) || exists} onClick={() => { const c: Discount = { ...f, code: f.code.trim().toUpperCase(), value: num(f.value), maxUses: num(f.maxUses), uses: 0 }; updateAdmin((x) => ({ ...x, discounts: [c, ...x.discounts] }), `Discount code ${c.code} created: ${c.kind === "percent" ? `${c.value}%` : money(c.value)} off ${c.appliesTo === "lanes" ? "lanes" : "the order"}`); setF({ ...blank, value: "10", maxUses: "0" }); }}>{exists ? "Code exists" : "Create code"}</Btn>
        </div>
      </Panel>

      <Panel title="Discount codes">
        {d.discounts.length === 0 ? <Empty>No codes yet.</Empty> : (
          <ul className="space-y-2">
            {d.discounts.map((c) => (
              <li key={c.code} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm">
                <span>
                  <span className="font-mono text-base font-bold text-white">{c.code}</span>{" "}
                  <span className="text-emerald-200">{c.kind === "percent" ? `${c.value}%` : money(c.value)} off {c.appliesTo === "lanes" ? "lanes" : "order"}</span>
                  <span className="block text-xs text-slate-500">{c.uses} used{c.maxUses ? ` of ${c.maxUses}` : ""}{c.expires ? ` · expires ${c.expires}` : ""}{c.note ? ` · ${c.note}` : ""}</span>
                </span>
                <span className="flex items-center gap-2">
                  {c.active ? <Badge tone="emerald">Active</Badge> : <Badge>Paused</Badge>}
                  <Toggle label={`${c.code} active`} on={c.active} onChange={(v) => updateAdmin((x) => ({ ...x, discounts: x.discounts.map((y) => (y.code === c.code ? { ...y, active: v } : y)) }), `Code ${c.code} ${v ? "activated" : "paused"}`)} />
                  <Btn small tone="danger" onClick={() => updateAdmin((x) => ({ ...x, discounts: x.discounts.filter((y) => y.code !== c.code) }), `Code ${c.code} deleted`)}>Delete</Btn>
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-slate-500">Customers enter codes at checkout on Rent a lane. Try KNIGHTS there.</p>
      </Panel>
    </div>
  );
}

export function Arcade({ d }: { d: AdminData }) {
  const [packs, setPacks] = useState(d.arcadePacks.map((p) => ({ ...p, price: String(p.price), credits: String(p.credits), bonus: String(p.bonus) })));
  const total30 = d.arcadeSales.filter((a) => a.createdAt >= daysAgoIso(30)).reduce((s, a) => s + a.price, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Online card sales (30 days)" value={money(total30)} tone="cyan" />
        <Stat label="Credits sold" value={String(d.arcadeSales.reduce((s, a) => s + a.credits, 0))} tone="fuchsia" />
        <Stat label="Reloads" value={String(d.arcadeSales.filter((a) => a.reload).length)} sub={`${d.arcadeSales.filter((a) => !a.reload).length} new cards`} tone="emerald" />
      </div>
      <Panel title="Game card packs" action={<div className="flex gap-2"><Btn onClick={() => setPacks([...packs, { id: `p${Date.now()}`, label: "New pack", price: "15", credits: "60", bonus: "0", active: true }])}>+ Pack</Btn><Btn tone="primary" onClick={() => updateAdmin((x) => ({ ...x, arcadePacks: packs.map((p) => ({ ...p, price: num(p.price), credits: num(p.credits), bonus: num(p.bonus) })) }), `Arcade packs updated: ${packs.filter((p) => p.active).map((p) => `${p.label} ${money(num(p.price))}`).join(", ")}`)}>Save packs</Btn></div>}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead className="text-left text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="py-2">Name</th><th>Price</th><th>Credits</th><th>Bonus credits</th><th>On sale</th><th /></tr></thead>
            <tbody className="divide-y divide-white/5">
              {packs.map((p, i) => (
                <tr key={p.id}>
                  {(["label", "price", "credits", "bonus"] as const).map((k) => (
                    <td key={k} className="py-2 pr-2"><input className={inputCls} value={p[k]} onChange={(e) => setPacks(packs.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)))} aria-label={`${p.label} ${k}`} /></td>
                  ))}
                  <td><Toggle label={`${p.label} on sale`} on={p.active} onChange={(v) => setPacks(packs.map((x, j) => (j === i ? { ...x, active: v } : x)))} /></td>
                  <td><Btn small tone="danger" onClick={() => setPacks(packs.filter((_, j) => j !== i))}>Remove</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-slate-500">Shown on the Gift & game cards page. Credits load onto the card system (Embed / Intercard / CenterEdge) in production.</p>
      </Panel>
      <Panel title="Recent game card sales" action={<Btn onClick={() => downloadCsv(`arcade-sales-${todayIso()}.csv`, [["ID", "Card", "Pack", "Price", "Credits", "Buyer", "Email", "Reload", "Date"], ...d.arcadeSales.map((a) => [a.id, a.card, a.packId, a.price, a.credits, a.buyer, a.email, a.reload ? "yes" : "no", a.createdAt])])}>CSV</Btn>}>
        {d.arcadeSales.length === 0 ? <Empty>No sales yet.</Empty> : (
          <ul className="divide-y divide-white/5 text-sm">
            {d.arcadeSales.slice(0, 20).map((a) => (
              <li key={a.id} className="flex justify-between gap-3 py-2 text-slate-300">
                <span><span className="font-mono text-xs text-white">{a.card}</span> · {a.buyer} · {a.reload ? "reload" : "new card"}{a.sample && <span className="ml-1 text-[10px] text-fuchsia-300">sample</span>}</span>
                <span>{a.credits} credits · <span className="text-cyan-200">{money(a.price)}</span> · {day(a.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
