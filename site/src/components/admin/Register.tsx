"use client";

import { useMemo, useState } from "react";
import { TOTAL_LANES } from "@/lib/lanes";
import {
  adminBlocked, checkDiscount, findGiftCard, lanePrice, money, randomCode, randomDigits, todayIso, updateAdmin, upsertCustomer,
  type AdminData, type LineItem, type PayMethod, type Payment,
} from "@/lib/admin-store";
import { parseLanes } from "./Orders";
import { setLanes } from "./LaneControl";
import { Badge, Btn, Empty, Field, Panel, Stat, downloadCsv, inputCls } from "./ui";

type Line = LineItem & { key: string; taxable: boolean; lanes?: number[]; hours?: number };
const r2 = (v: number) => Math.round(v * 100) / 100;

function Receipt({ p, onNew }: { p: Payment; onNew: () => void }) {
  return (
    <div className="mx-auto max-w-sm">
      <div id="receipt" className="rounded-2xl bg-white p-6 font-mono text-[13px] text-slate-900 shadow-2xl">
        <p className="text-center text-lg font-black tracking-widest">BOARDWALK BOWL</p>
        <p className="text-center text-xs">10749 E Colonial Dr · Orlando · 407-384-0003</p>
        <p className="mt-2 text-center text-xs">{new Date(p.at).toLocaleString("en-US")} · {p.id}</p>
        {p.customerName && <p className="text-center text-xs">Customer: {p.customerName}</p>}
        <div className="my-3 border-t border-dashed border-slate-400" />
        {p.items.map((i, k) => (
          <p key={k} className="flex justify-between gap-2"><span>{i.qty > 1 ? `${i.qty} × ` : ""}{i.label}</span><span>{money(i.price * i.qty)}</span></p>
        ))}
        <div className="my-3 border-t border-dashed border-slate-400" />
        <p className="flex justify-between"><span>Subtotal</span><span>{money(p.subtotal)}</span></p>
        {p.discount > 0 && <p className="flex justify-between"><span>Discount</span><span>−{money(p.discount)}</span></p>}
        <p className="flex justify-between"><span>Tax</span><span>{money(p.tax)}</span></p>
        {p.tip > 0 && <p className="flex justify-between"><span>Tip</span><span>{money(p.tip)}</span></p>}
        <p className="mt-1 flex justify-between text-base font-black"><span>TOTAL</span><span>{money(p.total)}</span></p>
        <div className="my-3 border-t border-dashed border-slate-400" />
        {p.card > 0 && <p className="flex justify-between"><span>Card</span><span>{money(p.card)}</span></p>}
        {p.gift > 0 && <p className="flex justify-between"><span>Gift card {p.giftCode}</span><span>{money(p.gift)}</span></p>}
        {p.cash > 0 && <p className="flex justify-between"><span>Cash</span><span>{money(p.cash + p.change)}</span></p>}
        {p.change > 0 && <p className="flex justify-between"><span>Change</span><span>{money(p.change)}</span></p>}
        <p className="mt-3 text-center text-xs">Thanks for bowling with us! 🎳</p>
      </div>
      <div className="mt-4 flex justify-center gap-2 print:hidden">
        <Btn onClick={() => window.print()}>Print receipt</Btn>
        <Btn tone="primary" onClick={onNew}>New sale</Btn>
      </div>
    </div>
  );
}

function Checkout({ d }: { d: AdminData }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [laneText, setLaneText] = useState("");
  const [laneHours, setLaneHours] = useState(1);
  const [startNow, setStartNow] = useState(true);
  const [custom, setCustom] = useState({ label: "", price: "" });
  const [custQ, setCustQ] = useState("");
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [newCust, setNewCust] = useState({ name: "", phone: "" });
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [promo, setPromo] = useState("");
  const [tipPct, setTipPct] = useState(0);
  const [method, setMethod] = useState<PayMethod>("card");
  const [tendered, setTendered] = useState("");
  const [giftCode, setGiftCode] = useState("");
  const [splitCash, setSplitCash] = useState("");
  const [reader, setReader] = useState<"idle" | "waiting">("idle");
  const [done, setDone] = useState<Payment | null>(null);
  const [err, setErr] = useState("");

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const t = todayIso();
  const customer = d.customers.find((c) => c.id === customerId) ?? null;
  const unpaid = d.orders.filter((o) => o.status !== "cancelled" && o.status !== "refunded" && o.paid < o.total && o.date >= t).slice(0, 8);

  const totals = useMemo(() => {
    const subtotal = r2(lines.reduce((s, l) => s + l.price * l.qty, 0));
    const lanesSub = lines.filter((l) => l.kind === "lane").reduce((s, l) => s + l.price * l.qty, 0);
    const pr = promo ? checkDiscount(d, promo, lanesSub, subtotal) : null;
    const discount = pr && pr.ok ? pr.amount : 0;
    const taxable = lines.filter((l) => l.taxable).reduce((s, l) => s + l.price * l.qty, 0);
    const tax = r2(Math.max(0, taxable - (pr && pr.ok && subtotal ? discount * (taxable / subtotal) : 0)) * d.taxRate);
    const tip = r2(((subtotal - discount) * tipPct) / 100);
    const total = r2(subtotal - discount + tax + tip);
    return { subtotal, discount, tax, tip, total, promo: pr };
  }, [lines, promo, tipPct, d]);

  const card = findGiftCard(d, giftCode);
  const giftApplied = method === "gift" && card && card.active ? Math.min(card.balance, totals.total) : 0;
  const rest = r2(totals.total - giftApplied);
  const cashIn = Number(tendered) || 0;

  function addLaneTime() {
    const lanes = parseLanes(laneText);
    if (!lanes.length) return setErr("Enter lane numbers, e.g. 12 or 21, 22");
    const blocked = adminBlocked(d, t, nowMin, laneHours * 60);
    const clash = lanes.filter((n) => blocked.has(n) || d.lanePower[String(n)]);
    if (clash.length) return setErr(`Lane ${clash.join(", ")} is busy, held, closed or already on.`);
    const price = r2(lanes.reduce((s, n) => s + lanePrice(d, t, nowMin, n), 0) * laneHours);
    setLines([...lines, { key: randomDigits("lane-", 7), label: `Lane${lanes.length > 1 ? "s" : ""} ${lanes.join(", ")} · ${laneHours} hr`, qty: 1, price, kind: "lane", taxable: true, lanes, hours: laneHours }]);
    setLaneText(""); setErr("");
  }
  const addItem = (i: { id: string; label: string; price: number; kind: LineItem["kind"]; taxable: boolean }) => {
    const ex = lines.find((l) => l.key === i.id);
    setLines(ex ? lines.map((l) => (l.key === i.id ? { ...l, qty: l.qty + 1 } : l)) : [...lines, { key: i.id, label: i.label, qty: 1, price: i.price, kind: i.kind, taxable: i.taxable }]);
  };

  function finish(m: PayMethod) {
    if (!lines.length) return setErr("Add something to the sale first.");
    let cash = 0, cardAmt = 0, change = 0;
    if (m === "cash") { if (cashIn < totals.total) return setErr("Cash given is less than the total."); cash = totals.total; change = r2(cashIn - totals.total); }
    if (m === "card") cardAmt = totals.total;
    if (m === "gift") { if (!card || !card.active || card.balance <= 0) return setErr("Gift card not found, off, or empty."); cardAmt = rest; }
    if (m === "split") { const c = Math.min(totals.total, Number(splitCash) || 0); cash = c; cardAmt = r2(totals.total - c); }
    const id = randomDigits("PAY-", 5);
    const at = new Date().toISOString();
    const giftSold = lines.filter((l) => l.kind === "gift");
    const arcadeSold = lines.filter((l) => l.kind === "arcade");
    const laneLines = lines.filter((l) => l.kind === "lane" && l.lanes);
    const pay: Payment = {
      id, at, customerId, customerName: customer?.name ?? newCust.name, orderCode, items: lines.map(({ label, qty, price, kind }) => ({ label, qty, price, kind })),
      subtotal: totals.subtotal, discount: totals.discount, tax: totals.tax, tip: totals.tip, total: totals.total, method: m,
      cash, card: cardAmt, gift: giftApplied, giftCode: giftApplied ? card!.code : "", change, refunded: 0, status: "paid", staff: "Front desk",
    };
    const newGiftCodes = giftSold.flatMap((l) => Array.from({ length: l.qty }, () => ({ code: randomCode("GC"), amount: l.price })));
    const newOrders = startNow ? laneLines.map((l) => ({ code: randomDigits("BW-W", 5), lanes: l.lanes!, hours: l.hours!, price: l.price })) : [];
    updateAdmin((x) => {
      let customers = x.customers, cid = customerId;
      if (!cid && newCust.name.trim()) [customers, cid] = upsertCustomer(customers, { name: newCust.name.trim(), phone: newCust.phone });
      if (cid) customers = customers.map((c) => (c.id === cid ? { ...c, points: c.points + Math.floor(totals.total * x.loyaltyRate) } : c));
      return {
        ...x,
        customers,
        payments: [{ ...pay, customerId: cid }, ...x.payments],
        giftCards: [
          ...newGiftCodes.map((g) => ({ code: g.code, initial: g.amount, balance: g.amount, buyer: pay.customerName || "Walk-in", recipient: pay.customerName || "Walk-in", message: "Sold at the front desk", createdAt: at, active: true })),
          ...x.giftCards.map((g) => (giftApplied && g.code === card!.code ? { ...g, balance: r2(g.balance - giftApplied) } : g)),
        ],
        arcadeSales: [...arcadeSold.flatMap((l) => Array.from({ length: l.qty }, () => ({ id: randomDigits("A-", 4), card: randomDigits("AC-", 6), packId: "desk", price: l.price, credits: Math.round(l.price * 4), buyer: pay.customerName || "Walk-in", email: "", reload: false, createdAt: at }))), ...x.arcadeSales],
        orders: [
          ...newOrders.map((o) => ({ code: o.code, status: "checked-in" as const, date: t, start: nowMin, hours: o.hours, lanes: o.lanes, guests: 4, shoes: lines.find((l) => l.kind === "shoes")?.qty ?? 0, name: pay.customerName || "Walk-in", phone: customer?.phone ?? newCust.phone, email: customer?.email ?? "", total: o.price, paid: o.price, refunded: 0, payAt: "desk" as const, source: "walk-in" as const, createdAt: at, notes: `Paid at register ${id}` })),
          ...x.orders.map((o) => (o.code === orderCode ? { ...o, paid: o.total, status: o.status === "pending" ? ("confirmed" as const) : o.status } : o)),
        ],
        discounts: totals.promo && totals.promo.ok ? x.discounts.map((c) => (c.code === (totals.promo as { code: string }).code ? { ...c, uses: c.uses + 1 } : c)) : x.discounts,
      };
    }, `Register sale ${id}: ${money(totals.total)} by ${m}${pay.customerName ? ` (${pay.customerName})` : ""}`);
    for (const o of newOrders) setLanes(o.lanes, true, { minutes: o.hours * 60, label: pay.customerName || "Walk-in", orderCode: o.code }, `Lane${o.lanes.length > 1 ? "s" : ""} ${o.lanes.join(", ")} turned on from the register`);
    setDone(pay);
  }

  function chargeCard(m: PayMethod) {
    setReader("waiting");
    setTimeout(() => { setReader("idle"); finish(m); }, 1400);
  }

  if (done) return <Receipt p={done} onNew={() => { setDone(null); setLines([]); setCustomerId(null); setNewCust({ name: "", phone: "" }); setOrderCode(null); setPromo(""); setTipPct(0); setTendered(""); setGiftCode(""); setSplitCash(""); }} />;

  const matches = custQ ? d.customers.filter((c) => `${c.name} ${c.phone} ${c.email}`.toLowerCase().includes(custQ.toLowerCase())).slice(0, 5) : [];
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
      <div className="space-y-5">
        <Panel title="Lane time">
          <div className="grid gap-3 sm:grid-cols-[1fr_120px_auto] sm:items-end">
            <Field label="Lanes" hint="Price uses the current rate block + lane surcharges"><input className={inputCls} value={laneText} onChange={(e) => setLaneText(e.target.value)} placeholder="e.g. 12 or 21, 22" /></Field>
            <Field label="Hours"><select className={inputCls} value={laneHours} onChange={(e) => setLaneHours(Number(e.target.value))}>{[0.5, 1, 1.5, 2, 3].map((h) => <option key={h} value={h}>{h}</option>)}</select></Field>
            <Btn tone="primary" onClick={addLaneTime}>Add</Btn>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" className="h-4 w-4 accent-cyan-400" checked={startNow} onChange={(e) => setStartNow(e.target.checked)} /> Turn the lanes on when paid</label>
        </Panel>
        <Panel title="Quick items">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {d.registerItems.map((i) => (
              <button key={i.id} type="button" onClick={() => addItem(i)} className="rounded-xl border border-white/10 bg-white/5 p-3 text-left hover:border-cyan-400/50">
                <span className="block text-sm font-semibold text-white">{i.label}</span><span className="text-xs text-cyan-200">{money(i.price)}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-[1fr_110px_auto] gap-2">
            <input className={inputCls} placeholder="Custom item" value={custom.label} onChange={(e) => setCustom({ ...custom, label: e.target.value })} />
            <input className={inputCls} placeholder="$" inputMode="decimal" value={custom.price} onChange={(e) => setCustom({ ...custom, price: e.target.value })} />
            <Btn onClick={() => { const v = Number(custom.price); if (!custom.label.trim() || !v) return; addItem({ id: randomDigits("c-", 7), label: custom.label, price: v, kind: "other", taxable: true }); setCustom({ label: "", price: "" }); }}>Add</Btn>
          </div>
        </Panel>
        {unpaid.length > 0 && (
          <Panel title="Collect for a booking">
            <ul className="space-y-1 text-sm">
              {unpaid.map((o) => (
                <li key={o.code} className="flex items-center justify-between gap-2 rounded-lg border border-white/10 px-3 py-2">
                  <span>{o.name} · {o.code} · lane{o.lanes.length > 1 ? "s" : ""} {o.lanes.join(", ")} · due {money(o.total - o.paid)}</span>
                  <Btn small disabled={orderCode === o.code} onClick={() => { setOrderCode(o.code); const c = d.customers.find((x) => x.name === o.name || (o.email && x.email === o.email)); if (c) setCustomerId(c.id); else setNewCust({ name: o.name, phone: o.phone }); setLines([...lines, { key: `ord-${o.code}`, label: `Booking ${o.code}`, qty: 1, price: r2((o.total - o.paid) / (1 + d.taxRate)), kind: "lane", taxable: true }]); }}>{orderCode === o.code ? "Added" : "Add"}</Btn>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>

      <div className="space-y-4 xl:sticky xl:top-20 xl:self-start">
        <Panel title="Sale">
          {err && <p className="mb-2 rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{err}</p>}
          <div className="mb-3">
            {customer ? (
              <div className="flex items-center justify-between rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">
                <span>{customer.name} · {customer.points} pts{customer.tags.length ? ` · ${customer.tags.join(", ")}` : ""}</span>
                <button type="button" className="text-xs" onClick={() => setCustomerId(null)}>change</button>
              </div>
            ) : (
              <div className="space-y-2">
                <input className={inputCls} placeholder="Find customer (name, phone, email)" value={custQ} onChange={(e) => setCustQ(e.target.value)} />
                {matches.map((c) => <button key={c.id} type="button" className="block w-full rounded-lg border border-white/10 px-3 py-1.5 text-left text-sm text-slate-200 hover:border-cyan-400/50" onClick={() => { setCustomerId(c.id); setCustQ(""); }}>{c.name} · {c.phone}</button>)}
                <div className="grid grid-cols-2 gap-2">
                  <input className={inputCls} placeholder="Or new: name" value={newCust.name} onChange={(e) => setNewCust({ ...newCust, name: e.target.value })} />
                  <input className={inputCls} placeholder="Phone" value={newCust.phone} onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })} />
                </div>
              </div>
            )}
          </div>
          {lines.length === 0 ? <Empty>Tap items or add lane time.</Empty> : (
            <ul className="divide-y divide-white/5 text-sm">
              {lines.map((l) => (
                <li key={l.key} className="flex items-center justify-between gap-2 py-2">
                  <span className="text-slate-200">{l.label}</span>
                  <span className="flex items-center gap-1">
                    {l.kind !== "lane" && <><button type="button" aria-label="Less" className="h-6 w-6 rounded border border-white/15" onClick={() => setLines(lines.flatMap((x) => (x.key === l.key ? (x.qty > 1 ? [{ ...x, qty: x.qty - 1 }] : []) : [x])))}>−</button><span className="w-5 text-center">{l.qty}</span><button type="button" aria-label="More" className="h-6 w-6 rounded border border-white/15" onClick={() => setLines(lines.map((x) => (x.key === l.key ? { ...x, qty: x.qty + 1 } : x)))}>+</button></>}
                    <span className="w-20 text-right">{money(l.price * l.qty)}</span>
                    <button type="button" aria-label="Remove" className="ml-1 text-rose-300" onClick={() => { setLines(lines.filter((x) => x.key !== l.key)); if (l.key.startsWith("ord-")) setOrderCode(null); }}>✕</button>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <input className={`${inputCls} uppercase`} placeholder="Promo code" value={promo} onChange={(e) => setPromo(e.target.value)} />
            {totals.promo && <span className={`self-center text-xs ${totals.promo.ok ? "text-emerald-300" : "text-amber-300"}`}>{totals.promo.ok ? totals.promo.label : totals.promo.reason}</span>}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">Tip
            {[0, 15, 18, 20].map((p) => <button key={p} type="button" onClick={() => setTipPct(p)} className={`rounded-full border px-2.5 py-1 ${tipPct === p ? "border-cyan-300 bg-cyan-400 text-slate-950" : "border-white/10 text-slate-200"}`}>{p ? `${p}%` : "None"}</button>)}
          </div>
          <dl className="mt-3 grid grid-cols-[1fr_auto] gap-y-1 text-sm text-slate-300">
            <dt>Subtotal</dt><dd className="text-right">{money(totals.subtotal)}</dd>
            {totals.discount > 0 && (<><dt className="text-emerald-300">Discount</dt><dd className="text-right text-emerald-300">−{money(totals.discount)}</dd></>)}
            <dt>Tax</dt><dd className="text-right">{money(totals.tax)}</dd>
            {totals.tip > 0 && (<><dt>Tip</dt><dd className="text-right">{money(totals.tip)}</dd></>)}
            <dt className="border-t border-white/10 pt-2 text-base font-bold text-white">Total</dt><dd className="border-t border-white/10 pt-2 text-right text-2xl font-bold text-cyan-200">{money(totals.total)}</dd>
          </dl>
        </Panel>

        <Panel title="Payment">
          <div className="grid grid-cols-4 gap-2">
            {(["card", "cash", "gift", "split"] as const).map((m) => <button key={m} type="button" onClick={() => setMethod(m)} className={`rounded-lg border py-2 text-sm font-semibold capitalize ${method === m ? "border-cyan-300 bg-cyan-400 text-slate-950" : "border-white/10 text-slate-200"}`}>{m === "gift" ? "Gift card" : m}</button>)}
          </div>
          <div className="mt-3 space-y-2 text-sm">
            {method === "card" && <p className="text-slate-400">Customer taps, inserts or swipes on the card reader (Square / Stripe Terminal in production).</p>}
            {method === "cash" && (
              <>
                <Field label="Cash given"><input className={inputCls} inputMode="decimal" value={tendered} onChange={(e) => setTendered(e.target.value.replace(/[^\d.]/g, ""))} /></Field>
                <div className="flex flex-wrap gap-1.5">{[Math.ceil(totals.total), 20, 50, 100].filter((v, i, a) => v >= totals.total && a.indexOf(v) === i).map((v) => <Btn key={v} small onClick={() => setTendered(String(v))}>${v}</Btn>)}</div>
                {cashIn >= totals.total && totals.total > 0 && <p className="text-lg font-bold text-emerald-300">Change: {money(r2(cashIn - totals.total))}</p>}
              </>
            )}
            {method === "gift" && (
              <>
                <Field label="Gift card code"><input className={`${inputCls} uppercase`} value={giftCode} onChange={(e) => setGiftCode(e.target.value)} placeholder="GC-XXXX-XXXX" /></Field>
                {giftCode && <p className={card?.active ? "text-emerald-300" : "text-amber-300"}>{!card ? "Not found" : !card.active ? "Card is off" : `Balance ${money(card.balance)} · using ${money(giftApplied)}${rest > 0 ? ` · ${money(rest)} more on card` : ""}`}</p>}
              </>
            )}
            {method === "split" && (
              <>
                <Field label="Cash part"><input className={inputCls} inputMode="decimal" value={splitCash} onChange={(e) => setSplitCash(e.target.value.replace(/[^\d.]/g, ""))} /></Field>
                <p className="text-slate-400">Card part: {money(r2(Math.max(0, totals.total - (Number(splitCash) || 0))))}</p>
              </>
            )}
          </div>
          <button type="button" disabled={!lines.length || reader === "waiting"}
            onClick={() => (method === "card" || method === "split" || (method === "gift" && rest > 0) ? chargeCard(method) : finish(method))}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-base font-bold uppercase tracking-wide text-white shadow-xl shadow-orange-500/30 disabled:opacity-40">
            {reader === "waiting" ? "Waiting for card reader…" : `Charge ${money(totals.total)}`}
          </button>
          <p className="mt-2 text-center text-[11px] text-slate-500">Concept demo: no card is charged.</p>
        </Panel>
      </div>
    </div>
  );
}

function PaymentsLedger({ d }: { d: AdminData }) {
  const [day, setDay] = useState(todayIso());
  const [refund, setRefund] = useState<Record<string, string>>({});
  const list = d.payments.filter((p) => p.at.slice(0, 10) === day || new Date(p.at).toLocaleDateString("en-CA") === day);
  const sum = (f: (p: Payment) => number) => r2(list.reduce((s, p) => s + f(p), 0));
  const gross = sum((p) => p.total), refunds = sum((p) => p.refunded);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <Stat label="Sales" value={money(gross)} sub={`${list.length} payments`} />
        <Stat label="Card" value={money(sum((p) => (p.method === "online" ? 0 : p.card)))} tone="cyan" />
        <Stat label="Cash" value={money(sum((p) => p.cash))} sub="expected in drawer" tone="emerald" />
        <Stat label="Online" value={money(sum((p) => (p.method === "online" ? p.total : 0)))} tone="fuchsia" />
        <Stat label="Tips" value={money(sum((p) => p.tip))} tone="orange" />
        <Stat label="Refunds" value={money(refunds)} sub={`net ${money(gross - refunds)}`} tone="amber" />
      </div>
      <Panel title="Payments" action={
        <div className="flex gap-2">
          <input type="date" className={`${inputCls} w-auto`} value={day} onChange={(e) => setDay(e.target.value)} aria-label="Day" />
          <Btn onClick={() => downloadCsv(`payments-${day}.csv`, [["ID", "Time", "Customer", "Items", "Subtotal", "Discount", "Tax", "Tip", "Total", "Method", "Card", "Cash", "Gift", "Refunded"], ...list.map((p) => [p.id, p.at, p.customerName, p.items.map((i) => `${i.qty}x ${i.label}`).join("; "), p.subtotal, p.discount, p.tax, p.tip, p.total, p.method, p.card, p.cash, p.gift, p.refunded])])}>CSV</Btn>
          <Btn tone="primary" onClick={() => { updateAdmin((x) => x, `Day closed ${day}: sales ${money(gross)}, cash ${money(sum((p) => p.cash))}, card ${money(sum((p) => p.card))}, refunds ${money(refunds)}`); window.alert(`Day summary for ${day}\n\nSales ${money(gross)}\nCash in drawer ${money(sum((p) => p.cash))}\nCard ${money(sum((p) => p.card))}\nTips ${money(sum((p) => p.tip))}\nRefunds ${money(refunds)}\nNet ${money(gross - refunds)}`); }}>Close day</Btn>
        </div>
      }>
        {list.length === 0 ? <Empty>No payments that day.</Empty> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="py-2">Time</th><th>Customer</th><th>Items</th><th>Total</th><th>Method</th><th>Refund</th></tr></thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {list.map((p) => {
                  const left = r2(p.total - p.refunded);
                  return (
                    <tr key={p.id}>
                      <td className="py-2 text-xs">{new Date(p.at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}<span className="block font-mono text-[10px] text-slate-500">{p.id}{p.sample ? " · sample" : ""}</span></td>
                      <td>{p.customerName || "Walk-in"}</td>
                      <td className="max-w-[260px] truncate text-xs text-slate-400">{p.items.map((i) => `${i.qty > 1 ? `${i.qty}× ` : ""}${i.label}`).join(", ")}</td>
                      <td>{money(p.total)}{p.refunded > 0 && <span className="block text-xs text-fuchsia-300">−{money(p.refunded)}</span>}</td>
                      <td><Badge tone={p.method === "cash" ? "emerald" : p.method === "online" ? "fuchsia" : "cyan"}>{p.method}</Badge></td>
                      <td>
                        {left > 0 ? (
                          <div className="flex gap-1">
                            <input className={`${inputCls} w-20 py-1`} placeholder={String(left)} value={refund[p.id] ?? ""} onChange={(e) => setRefund({ ...refund, [p.id]: e.target.value })} aria-label={`Refund ${p.id}`} />
                            <Btn small tone="danger" onClick={() => {
                              const amt = Math.min(left, Number(refund[p.id] || left));
                              updateAdmin((x) => ({
                                ...x,
                                payments: x.payments.map((q) => (q.id === p.id ? { ...q, refunded: r2(q.refunded + amt), status: q.refunded + amt >= q.total ? "refunded" : "partly-refunded" } : q)),
                                orders: x.orders.map((o) => (o.code === p.orderCode ? { ...o, refunded: r2(o.refunded + amt) } : o)),
                              }), `Refunded ${money(amt)} on ${p.id} to ${p.method === "cash" ? "cash" : p.method === "gift" ? "gift card" : "the card"}`);
                              setRefund({ ...refund, [p.id]: "" });
                            }}>Refund</Btn>
                          </div>
                        ) : <Badge tone="fuchsia">Refunded</Badge>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}

export function Register({ d }: { d: AdminData }) {
  const [view, setView] = useState<"checkout" | "payments">("checkout");
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["checkout", "payments"] as const).map((v) => <Btn key={v} tone={view === v ? "primary" : "ghost"} onClick={() => setView(v)}>{v === "checkout" ? "Take a payment" : "Payments & day close"}</Btn>)}
        <span className="self-center text-xs text-slate-500">{TOTAL_LANES - Object.keys(d.lanePower).length - Object.keys(d.closedLanes).length} lanes off right now</span>
      </div>
      {view === "checkout" ? <Checkout d={d} /> : <PaymentsLedger d={d} />}
    </div>
  );
}
