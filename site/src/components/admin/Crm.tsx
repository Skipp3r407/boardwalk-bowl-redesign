"use client";

import { useMemo, useState } from "react";
import { money, randomCode, todayIso, updateAdmin, upsertCustomer, type AdminData, type Customer } from "@/lib/admin-store";
import { Badge, Btn, Drawer, Empty, Field, Panel, Stat, Toggle, downloadCsv, inputCls } from "./ui";

const TAGS = ["Regular", "League bowler", "Birthday parent", "Corporate", "UCF student", "VIP", "Senior", "Do not book"];
const dateLabel = (d: string) => new Date(d.length === 10 ? d + "T12:00" : d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

function history(d: AdminData, c: Customer) {
  const match = (name: string, email: string, phone: string) =>
    (c.email && email && email.toLowerCase() === c.email.toLowerCase()) || (c.phone && phone && phone.replace(/\D/g, "") === c.phone.replace(/\D/g, "")) || name === c.name;
  const orders = d.orders.filter((o) => match(o.name, o.email, o.phone));
  const payments = d.payments.filter((p) => p.customerId === c.id || (!p.customerId && p.customerName === c.name));
  const gifts = d.giftCards.filter((g) => g.buyer === c.name || g.recipient === c.name);
  const arcade = d.arcadeSales.filter((a) => a.buyer === c.name || (c.email && a.email === c.email));
  const spent = payments.reduce((s, p) => s + p.total - p.refunded, 0) + arcade.filter((a) => !payments.some((p) => p.at === a.createdAt)).reduce((s, a) => s + a.price, 0);
  const visits = orders.filter((o) => o.status !== "cancelled" && o.status !== "refunded").length;
  const last = orders.map((o) => o.date).sort().pop() ?? "";
  return { orders, payments, gifts, arcade, spent, visits, last };
}

function Profile({ d, c, onClose }: { d: AdminData; c: Customer; onClose: () => void }) {
  const [f, setF] = useState({ name: c.name, phone: c.phone, email: c.email, birthday: c.birthday });
  const [note, setNote] = useState("");
  const [fu, setFu] = useState({ date: c.followUp?.date ?? todayIso(), text: c.followUp?.text ?? "" });
  const [pts, setPts] = useState("");
  const [msg, setMsg] = useState("");
  const h = history(d, c);
  const save = (patch: Partial<Customer>, log: string) => { updateAdmin((x) => ({ ...x, customers: x.customers.map((y) => (y.id === c.id ? { ...y, ...patch } : y)) }), `${c.name}: ${log}`); setMsg(log); };

  return (
    <Drawer open onClose={onClose} title={c.name}>
      <div className="space-y-5 text-sm text-slate-300">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Spent" value={money(h.spent)} />
          <Stat label="Visits" value={String(h.visits)} tone="emerald" />
          <Stat label="Points" value={String(c.points)} tone="fuchsia" />
        </div>
        {msg && <p className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-cyan-100">✓ {msg}</p>}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Name"><input className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="Phone"><input className={inputCls} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
          <Field label="Email"><input className={inputCls} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
          <Field label="Birthday"><input type="date" className={inputCls} value={f.birthday} onChange={(e) => setF({ ...f, birthday: e.target.value })} /></Field>
        </div>
        <div className="flex items-center justify-between">
          <Btn onClick={() => save(f, "contact details saved")}>Save details</Btn>
          <span className="flex items-center gap-2 text-xs">Texts & emails OK <Toggle label="Marketing opt-in" on={c.marketing} onChange={(v) => save({ marketing: v }, v ? "opted in to marketing" : "opted out of marketing")} /></span>
        </div>

        <div>
          <p className="mb-2 font-semibold text-white">Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {TAGS.map((t) => {
              const on = c.tags.includes(t);
              return <button key={t} type="button" onClick={() => save({ tags: on ? c.tags.filter((x) => x !== t) : [...c.tags, t] }, `${on ? "removed" : "added"} tag ${t}`)} className={`rounded-full border px-2.5 py-1 text-xs ${on ? "border-cyan-300 bg-cyan-400 text-slate-950" : "border-white/10 text-slate-300"}`}>{t}</button>;
            })}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 p-4">
          <p className="mb-2 font-semibold text-white">Follow-up</p>
          {c.followUp && !c.followUp.done && <p className="mb-2 text-amber-200">Due {dateLabel(c.followUp.date)}: {c.followUp.text}</p>}
          <div className="grid grid-cols-[140px_1fr] gap-2">
            <input type="date" className={inputCls} value={fu.date} onChange={(e) => setFu({ ...fu, date: e.target.value })} aria-label="Follow-up date" />
            <input className={inputCls} placeholder="e.g. Call about the Saturday party" value={fu.text} onChange={(e) => setFu({ ...fu, text: e.target.value })} />
          </div>
          <div className="mt-2 flex gap-2">
            <Btn onClick={() => fu.text.trim() && save({ followUp: { ...fu, done: false } }, `follow-up set for ${fu.date}`)}>Set follow-up</Btn>
            {c.followUp && !c.followUp.done && <Btn tone="success" onClick={() => save({ followUp: { ...c.followUp!, done: true } }, "follow-up done")}>Mark done</Btn>}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 p-4">
          <p className="mb-2 font-semibold text-white">Loyalty points <span className="font-normal text-slate-500">· {d.loyaltyRate} pt per $1 · 100 pts = $5 reward</span></p>
          <div className="flex flex-wrap gap-2">
            <input className={`${inputCls} w-24`} placeholder="+/−" value={pts} onChange={(e) => setPts(e.target.value)} aria-label="Points" />
            <Btn onClick={() => { const v = Math.round(Number(pts) || 0); if (v) { save({ points: Math.max(0, c.points + v) }, `points ${v > 0 ? "+" : ""}${v}`); setPts(""); } }}>Adjust</Btn>
            <Btn tone="success" disabled={c.points < 100} onClick={() => {
              const code = randomCode("GC");
              updateAdmin((x) => ({ ...x, customers: x.customers.map((y) => (y.id === c.id ? { ...y, points: y.points - 100 } : y)), giftCards: [{ code, initial: 5, balance: 5, buyer: "Boardwalk Bowl", recipient: c.name, message: "Loyalty reward", createdAt: new Date().toISOString(), active: true }, ...x.giftCards] }), `${c.name} redeemed 100 points for a $5 reward card ${code}`);
              setMsg(`Redeemed 100 points: $5 reward card ${code}`);
            }}>Redeem 100 → $5</Btn>
          </div>
        </div>

        <div>
          <p className="mb-2 font-semibold text-white">Notes</p>
          <div className="flex gap-2">
            <input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Likes lanes 21-22, allergic to peanuts…" />
            <Btn onClick={() => { if (note.trim()) { save({ notes: [{ at: new Date().toISOString(), text: note.trim() }, ...c.notes] }, "note added"); setNote(""); } }}>Add</Btn>
          </div>
          <ul className="mt-2 space-y-1">{c.notes.map((n, i) => <li key={i} className="rounded-lg bg-white/5 px-3 py-1.5 text-xs"><span className="text-slate-500">{dateLabel(n.at)}</span> · {n.text}</li>)}</ul>
        </div>

        <div>
          <p className="mb-2 font-semibold text-white">History</p>
          {h.orders.length + h.payments.length + h.gifts.length + h.arcade.length === 0 ? <p className="text-slate-500">Nothing yet.</p> : (
            <ul className="space-y-1 text-xs">
              {h.orders.map((o) => <li key={o.code} className="rounded-lg border border-white/10 px-3 py-1.5">🎳 {dateLabel(o.date)} · lane{o.lanes.length > 1 ? "s" : ""} {o.lanes.join(", ")} · {o.status} · {money(o.total)}</li>)}
              {h.payments.map((p) => <li key={p.id} className="rounded-lg border border-white/10 px-3 py-1.5">💳 {dateLabel(p.at)} · {p.items.map((i) => i.label).join(", ")} · {money(p.total)} {p.method}</li>)}
              {h.gifts.map((g) => <li key={g.code} className="rounded-lg border border-white/10 px-3 py-1.5">🎁 {g.code} · {money(g.balance)} of {money(g.initial)}</li>)}
              {h.arcade.map((a) => <li key={a.id} className="rounded-lg border border-white/10 px-3 py-1.5">🕹️ {a.card} · {a.credits} credits · {money(a.price)}</li>)}
            </ul>
          )}
        </div>
        <p className="text-xs text-slate-500">Customer since {dateLabel(c.createdAt)} · {c.id}{c.sample ? " · sample" : ""}</p>
      </div>
    </Drawer>
  );
}

export function Crm({ d }: { d: AdminData }) {
  const [q, setQ] = useState("");
  const [seg, setSeg] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [nc, setNc] = useState({ name: "", phone: "", email: "" });
  const [compose, setCompose] = useState(false);
  const [msgText, setMsgText] = useState("Strike! This week at Boardwalk Bowl: $3 games on Twice on Tuesdays. Book your lane: boardwalk-bowl-redesign-site.vercel.app/rent-a-lane");
  const t = todayIso();
  const month = t.slice(5, 7);
  const rows = useMemo(() => d.customers.map((c) => ({ c, h: history(d, c) })), [d]);
  const segs: Record<string, (r: (typeof rows)[number]) => boolean> = {
    all: () => true,
    regulars: (r) => r.c.tags.includes("Regular") || r.h.visits >= 3,
    league: (r) => r.c.tags.includes("League bowler"),
    birthdays: (r) => r.c.birthday.slice(5, 7) === month,
    lapsed: (r) => !!r.h.last && r.h.last < new Date(new Date(t + "T12:00").getTime() - 60 * 864e5).toISOString().slice(0, 10),
    marketing: (r) => r.c.marketing,
    followups: (r) => !!r.c.followUp && !r.c.followUp.done,
  };
  const SEG_LABEL: Record<string, string> = { all: "All", regulars: "Regulars", league: "League", birthdays: "Birthdays this month", lapsed: "Not back in 60 days", marketing: "Opted in", followups: "Follow-ups" };
  const list = rows.filter(segs[seg]).filter(({ c }) => !q || `${c.name} ${c.phone} ${c.email} ${c.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.h.spent - a.h.spent);
  const due = d.customers.filter((c) => c.followUp && !c.followUp.done && c.followUp.date <= t);
  const current = d.customers.find((c) => c.id === open);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Customers" value={String(d.customers.length)} sub={`${d.customers.filter((c) => c.marketing).length} opted in to marketing`} />
        <Stat label="Lifetime revenue" value={money(rows.reduce((s, r) => s + r.h.spent, 0))} tone="emerald" />
        <Stat label="Points outstanding" value={String(d.customers.reduce((s, c) => s + c.points, 0))} tone="fuchsia" />
        <Stat label="Follow-ups due" value={String(due.length)} sub={due.map((c) => c.name.split(" ")[0]).join(", ") || "none"} tone="amber" />
      </div>

      <Panel title="Customers" action={
        <div className="flex flex-wrap gap-2">
          <input className={`${inputCls} w-52`} placeholder="Search name, phone, tag" value={q} onChange={(e) => setQ(e.target.value)} />
          <Btn onClick={() => setCompose(true)}>Message segment</Btn>
          <Btn onClick={() => downloadCsv(`crm-${t}.csv`, [["ID", "Name", "Phone", "Email", "Tags", "Visits", "Spent", "Points", "Marketing", "Birthday", "Last visit"], ...list.map(({ c, h }) => [c.id, c.name, c.phone, c.email, c.tags.join("; "), h.visits, h.spent.toFixed(2), c.points, c.marketing ? "yes" : "no", c.birthday, h.last])])}>CSV</Btn>
          <Btn tone="primary" onClick={() => setAdding(true)}>+ Customer</Btn>
        </div>
      }>
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.keys(segs).map((k) => <button key={k} type="button" onClick={() => setSeg(k)} className={`rounded-full px-3 py-1 text-xs font-bold ${seg === k ? "bg-cyan-400 text-slate-950" : "border border-white/10 text-slate-300"}`}>{SEG_LABEL[k]} <span className="opacity-60">{rows.filter(segs[k]).length}</span></button>)}
        </div>
        {adding && (
          <div className="mb-4 grid gap-2 rounded-xl border border-cyan-400/30 p-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <input className={inputCls} placeholder="Name" value={nc.name} onChange={(e) => setNc({ ...nc, name: e.target.value })} />
            <input className={inputCls} placeholder="Phone" value={nc.phone} onChange={(e) => setNc({ ...nc, phone: e.target.value })} />
            <input className={inputCls} placeholder="Email" value={nc.email} onChange={(e) => setNc({ ...nc, email: e.target.value })} />
            <Btn tone="primary" onClick={() => { if (!nc.name.trim()) return; let id = ""; updateAdmin((x) => { const [customers, cid] = upsertCustomer(x.customers, nc); id = cid; return { ...x, customers }; }, `New customer ${nc.name}`); setNc({ name: "", phone: "", email: "" }); setAdding(false); setOpen(id); }}>Save</Btn>
          </div>
        )}
        {list.length === 0 ? <Empty>No customers in this list.</Empty> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="py-2">Customer</th><th>Tags</th><th>Visits</th><th>Spent</th><th>Points</th><th>Last visit</th><th /></tr></thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {list.map(({ c, h }) => (
                  <tr key={c.id} className="cursor-pointer hover:bg-cyan-500/5" onClick={() => setOpen(c.id)}>
                    <td className="py-2">{c.name}{c.followUp && !c.followUp.done && <span className="ml-1 text-amber-300" title="Follow-up">●</span>}<span className="block text-xs text-slate-500">{[c.phone, c.email].filter(Boolean).join(" · ")}</span></td>
                    <td className="max-w-[200px]"><span className="flex flex-wrap gap-1">{c.tags.slice(0, 3).map((x) => <Badge key={x}>{x}</Badge>)}</span></td>
                    <td>{h.visits}</td>
                    <td className="text-cyan-200">{money(h.spent)}</td>
                    <td>{c.points}</td>
                    <td className="text-xs text-slate-400">{h.last ? dateLabel(h.last) : "—"}</td>
                    <td className="text-right text-cyan-300">Open →</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {compose && (
        <Drawer open onClose={() => setCompose(false)} title="Message a segment">
          <div className="space-y-3 text-sm">
            <p className="text-slate-300">To: <span className="font-semibold text-white">{SEG_LABEL[seg]}</span>, opted-in only · {rows.filter(segs[seg]).filter((r) => r.c.marketing).length} people</p>
            <textarea className={`${inputCls} min-h-[140px]`} value={msgText} onChange={(e) => setMsgText(e.target.value)} />
            <p className="text-xs text-slate-500">{msgText.length} characters · texts over 160 send as 2 messages</p>
            <Btn tone="primary" onClick={() => { const n = rows.filter(segs[seg]).filter((r) => r.c.marketing).length; updateAdmin((x) => x, `Campaign queued to ${n} customers (${SEG_LABEL[seg]}): “${msgText.slice(0, 60)}…”`); setCompose(false); }}>Queue message</Btn>
            <p className="text-xs text-slate-500">Concept demo: nothing is sent. In production this goes through a texting/email service with opt-out links.</p>
          </div>
        </Drawer>
      )}
      {current && <Profile key={current.id} d={d} c={current} onClose={() => setOpen(null)} />}
    </div>
  );
}
