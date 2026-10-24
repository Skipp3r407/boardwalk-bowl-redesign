"use client";

import { useState } from "react";
import { findGiftCard, money, randomCode, randomDigits, updateAdmin, useAdmin, type ArcadeSale, type GiftCard } from "@/lib/admin-store";

const inputCls =
  "mt-1 w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2.5 text-base text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none sm:text-sm";
const AMOUNTS = [25, 50, 100, 150];

/** A gift card / game card drawn like a real plastic card. */
function CardArt({ kind, line1, line2, code }: { kind: "gift" | "arcade"; line1: string; line2: string; code?: string }) {
  return (
    <div
      className={`relative aspect-[1.586] w-full max-w-sm overflow-hidden rounded-2xl p-5 text-white shadow-2xl ${
        kind === "gift" ? "bg-gradient-to-br from-fuchsia-600 via-blue-700 to-slate-950" : "bg-gradient-to-br from-cyan-500 via-indigo-700 to-slate-950"
      }`}
    >
      <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.12)_0_6px,transparent_6px_12px)]" />
      <p className="font-[family-name:var(--font-display)] text-xl tracking-[0.2em]">BOARDWALK BOWL</p>
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70">{kind === "gift" ? "Gift card" : "Arcade game card"}</p>
      <p className="mt-6 font-[family-name:var(--font-display)] text-5xl leading-none">{line1}</p>
      <p className="mt-1 text-sm text-white/80">{line2}</p>
      {code && <p className="absolute bottom-12 right-5 font-mono text-sm tracking-widest text-white/90">{code}</p>}
      <span className="absolute right-5 top-5 text-3xl" aria-hidden>{kind === "gift" ? "🎳" : "🕹️"}</span>
    </div>
  );
}

export function Shop() {
  const admin = useAdmin();
  const [tab, setTab] = useState<"gift" | "arcade" | "balance">("gift");

  // gift card form
  const [amount, setAmount] = useState(50);
  const [custom, setCustom] = useState("");
  const [g, setG] = useState({ to: "", toEmail: "", from: "", fromEmail: "", message: "" });
  const [giftDone, setGiftDone] = useState<GiftCard[] | null>(null);

  // arcade form
  const [packId, setPackId] = useState("p25");
  const [reload, setReload] = useState(false);
  const [cardNo, setCardNo] = useState("");
  const [a, setA] = useState({ name: "", email: "" });
  const [arcadeDone, setArcadeDone] = useState<ArcadeSale | null>(null);

  // balance check
  const [lookup, setLookup] = useState("");
  const [looked, setLooked] = useState("");

  if (!admin) return <div className="glass-panel h-96 animate-pulse rounded-3xl" />;

  const giftAmount = custom ? Math.max(0, Math.min(500, Number(custom) || 0)) : amount;
  const bonus = admin.giftBonus.active && giftAmount >= admin.giftBonus.buy ? Math.floor(giftAmount / admin.giftBonus.buy) * admin.giftBonus.get : 0;
  const packs = admin.arcadePacks.filter((p) => p.active);
  const pack = packs.find((p) => p.id === packId) ?? packs[0];
  const giftOk = giftAmount >= 10 && g.to.trim() && /\S+@\S+\.\S+/.test(g.toEmail) && g.from.trim() && /\S+@\S+\.\S+/.test(g.fromEmail);
  const arcadeOk = pack && a.name.trim() && /\S+@\S+\.\S+/.test(a.email) && (!reload || /^AC-\d{6}$/i.test(cardNo.trim()));
  const found = looked ? findGiftCard(admin, looked) : null;

  function buyGift() {
    const now = new Date().toISOString();
    const cards: GiftCard[] = [{ code: randomCode("GC"), initial: giftAmount, balance: giftAmount, buyer: g.from, recipient: g.to, message: g.message, createdAt: now, active: true }];
    if (bonus) cards.push({ code: randomCode("GC"), initial: bonus, balance: bonus, buyer: g.from, recipient: g.from, message: "Bonus card", createdAt: now, active: true });
    updateAdmin((d) => ({ ...d, giftCards: [...cards, ...d.giftCards] }), `Gift card sold online: ${money(giftAmount)} to ${g.to}${bonus ? ` (+${money(bonus)} bonus card)` : ""}`);
    setGiftDone(cards);
  }

  function buyArcade() {
    if (!pack) return;
    const sale: ArcadeSale = {
      id: randomDigits("A-", 4),
      card: reload ? cardNo.trim().toUpperCase() : randomDigits("AC-", 6),
      packId: pack.id, price: pack.price, credits: pack.credits + pack.bonus, buyer: a.name, email: a.email, reload, createdAt: new Date().toISOString(),
    };
    updateAdmin((d) => ({ ...d, arcadeSales: [sale, ...d.arcadeSales] }), `Arcade ${reload ? "reload" : "card"} sold online: ${pack.label} ${money(pack.price)} (${sale.credits} credits) for ${a.name}`);
    setArcadeDone(sale);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist">
        {([["gift", "🎁 Gift cards"], ["arcade", "🕹️ Arcade game cards"], ["balance", "Check a balance"]] as const).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} type="button" onClick={() => setTab(id)}
            className={`rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-wide ${tab === id ? "bg-cyan-400 text-slate-950" : "border border-white/15 text-slate-200"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "gift" && (giftDone ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-2" data-shop-done>
          <div className="space-y-4">
            {giftDone.map((c) => <CardArt key={c.code} kind="gift" line1={money(c.initial)} line2={c.message === "Bonus card" ? "Bonus card for you" : `For ${c.recipient}`} code={c.code} />)}
          </div>
          <div className="glass-panel glass-panel-static rounded-3xl p-6">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">Purchase complete</p>
            <h3 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-white">Gift card on its way</h3>
            <p className="mt-2 text-sm text-slate-300">{g.to} gets an email at {g.toEmail} with the card and your message. Use it for lanes, parties, food, arcade and drinks{bonus ? "; your bonus card is in your inbox" : ""}.</p>
            <button type="button" onClick={() => { setGiftDone(null); setG({ to: "", toEmail: "", from: "", fromEmail: "", message: "" }); }} className="mt-5 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white">Buy another</button>
            <p className="mt-4 text-xs text-slate-500">Concept demo: no card is charged and no email is sent.</p>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="glass-panel glass-panel-static rounded-3xl p-6">
            <p className="text-sm text-slate-300">Amount</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {AMOUNTS.map((v) => (
                <button key={v} type="button" onClick={() => { setAmount(v); setCustom(""); }}
                  className={`rounded-xl border px-5 py-3 font-[family-name:var(--font-display)] text-2xl ${!custom && amount === v ? "border-cyan-300 bg-cyan-400 text-slate-950" : "border-white/10 text-white"}`}>
                  ${v}
                </button>
              ))}
              <input className={`${inputCls} mt-0 w-28`} inputMode="numeric" placeholder="Other $" value={custom} onChange={(e) => setCustom(e.target.value.replace(/[^\d]/g, ""))} aria-label="Custom amount" />
            </div>
            {admin.giftBonus.active && <p className="mt-3 rounded-lg border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-2 text-sm text-fuchsia-100">{admin.giftBonus.label}{bonus ? ` · you get a ${money(bonus)} bonus card` : ""}</p>}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-slate-300">To (name)<input className={inputCls} value={g.to} onChange={(e) => setG({ ...g, to: e.target.value })} /></label>
              <label className="text-sm text-slate-300">Their email<input className={inputCls} type="email" value={g.toEmail} onChange={(e) => setG({ ...g, toEmail: e.target.value })} /></label>
              <label className="text-sm text-slate-300">From (your name)<input className={inputCls} value={g.from} onChange={(e) => setG({ ...g, from: e.target.value })} /></label>
              <label className="text-sm text-slate-300">Your email<input className={inputCls} type="email" value={g.fromEmail} onChange={(e) => setG({ ...g, fromEmail: e.target.value })} /></label>
              <label className="text-sm text-slate-300 sm:col-span-2">Message (optional)<textarea className={`${inputCls} min-h-[80px]`} maxLength={200} value={g.message} onChange={(e) => setG({ ...g, message: e.target.value })} placeholder="Happy birthday! Strike one for me." /></label>
            </div>
            <button type="button" disabled={!giftOk} onClick={buyGift} className="mt-5 w-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-xl shadow-orange-500/30 disabled:opacity-40">
              Buy {money(giftAmount)} gift card
            </button>
          </div>
          <div className="space-y-3">
            <CardArt kind="gift" line1={money(giftAmount)} line2={g.to ? `For ${g.to}` : "Good for lanes, parties, food & arcade"} />
            <p className="text-xs text-slate-500">Delivered by email instantly. Never expires. Works at the front desk, bar and arcade kiosks.</p>
          </div>
        </div>
      ))}

      {tab === "arcade" && (arcadeDone ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-2" data-shop-done>
          <CardArt kind="arcade" line1={`${arcadeDone.credits}`} line2="credits loaded" code={arcadeDone.card} />
          <div className="glass-panel glass-panel-static rounded-3xl p-6">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">{arcadeDone.reload ? "Card reloaded" : "Card ready"}</p>
            <h3 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-white">{arcadeDone.credits} credits on {arcadeDone.card}</h3>
            <p className="mt-2 text-sm text-slate-300">{arcadeDone.reload ? "Your credits are on your card now. Just swipe and play." : "Show this card number at the redemption counter or any arcade kiosk to pick up your card. Tickets you win go right onto it."}</p>
            <button type="button" onClick={() => setArcadeDone(null)} className="mt-5 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white">Buy more credits</button>
            <p className="mt-4 text-xs text-slate-500">Concept demo: no card is charged.</p>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="glass-panel glass-panel-static rounded-3xl p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {packs.map((p) => (
                <button key={p.id} type="button" onClick={() => setPackId(p.id)}
                  className={`rounded-2xl border p-4 text-left transition ${pack?.id === p.id ? "border-cyan-300 bg-cyan-500/10 shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)]" : "border-white/10 bg-white/5 hover:border-cyan-400/40"}`}>
                  <span className="flex items-baseline justify-between">
                    <span className="font-[family-name:var(--font-display)] text-2xl text-white">{p.label}</span>
                    <span className="text-xl font-bold text-orange-200">{money(p.price)}</span>
                  </span>
                  <span className="mt-1 block text-sm text-slate-300">{p.credits + p.bonus} credits{p.bonus ? <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-200">+{p.bonus} bonus</span> : null}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">Games run 3 to 12 credits. No tokens, no paper tickets: wins load onto the card.</p>
            <div className="mt-5 flex gap-2" role="radiogroup" aria-label="New card or reload">
              {[false, true].map((r) => (
                <button key={String(r)} type="button" role="radio" aria-checked={reload === r} onClick={() => setReload(r)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold ${reload === r ? "border-cyan-300 bg-cyan-400 text-slate-950" : "border-white/10 text-slate-200"}`}>
                  {r ? "Reload my card" : "New card"}
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {reload && <label className="text-sm text-slate-300 sm:col-span-2">Card number<input className={`${inputCls} uppercase`} placeholder="AC-123456" value={cardNo} onChange={(e) => setCardNo(e.target.value)} /></label>}
              <label className="text-sm text-slate-300">Name<input className={inputCls} value={a.name} onChange={(e) => setA({ ...a, name: e.target.value })} /></label>
              <label className="text-sm text-slate-300">Email<input className={inputCls} type="email" value={a.email} onChange={(e) => setA({ ...a, email: e.target.value })} /></label>
            </div>
            <button type="button" disabled={!arcadeOk} onClick={buyArcade} className="mt-5 w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-sm font-bold uppercase tracking-wide text-slate-950 shadow-lg shadow-cyan-500/30 disabled:opacity-40">
              {pack ? `Buy ${pack.credits + pack.bonus} credits · ${money(pack.price)}` : "No packs available"}
            </button>
          </div>
          <div className="space-y-3">
            {pack && <CardArt kind="arcade" line1={`${pack.credits + pack.bonus}`} line2="credits" />}
            <p className="text-xs text-slate-500">Load credits before you come and skip the kiosk line.</p>
          </div>
        </div>
      ))}

      {tab === "balance" && (
        <div className="mt-8 max-w-lg glass-panel glass-panel-static rounded-3xl p-6">
          <label className="text-sm text-slate-300">Gift card number
            <div className="mt-1 flex gap-2">
              <input className={`${inputCls} mt-0 uppercase`} placeholder="GC-XXXX-XXXX" value={lookup} onChange={(e) => setLookup(e.target.value)} />
              <button type="button" onClick={() => setLooked(lookup)} className="rounded-lg border border-cyan-400/50 px-4 text-sm font-semibold text-cyan-200">Check</button>
            </div>
          </label>
          {looked && (
            <p className="mt-4 text-sm text-slate-200">
              {found ? (found.active ? <>Balance: <span className="text-2xl font-bold text-cyan-200">{money(found.balance)}</span> of {money(found.initial)}</> : "This card has been turned off. Please call the front desk.") : "We couldn't find that card number."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
