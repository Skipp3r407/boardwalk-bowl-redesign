"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdmin, type OrderStatus } from "@/lib/admin-store";
import { Dashboard } from "./Dashboard";
import { LaneBoard } from "./LaneBoard";
import { Orders } from "./Orders";
import { Pricing, Schedule } from "./Pricing";
import { Arcade, Discounts, GiftCards } from "./Sales";
import { Activity, Parties, Settings } from "./People";
import { Crm } from "./Crm";
import { Register } from "./Register";
import { LaneControl } from "./LaneControl";

const TABS = [
  ["dashboard", "Dashboard", "📊"],
  ["register", "Register", "💳"],
  ["control", "Lane control", "⚡"],
  ["lanes", "Lane board", "🎳"],
  ["orders", "Orders", "🧾"],
  ["pricing", "Pricing", "💲"],
  ["schedule", "Schedule & holds", "📅"],
  ["parties", "Parties", "🎉"],
  ["gift", "Gift cards", "🎁"],
  ["discounts", "Discounts", "🏷️"],
  ["arcade", "Arcade cards", "🕹️"],
  ["crm", "CRM", "👥"],
  ["settings", "Settings", "⚙️"],
  ["activity", "Activity log", "📝"],
] as const;
type Tab = (typeof TABS)[number][0];

const PIN = "1234";

export function AdminApp() {
  const d = useAdmin();
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [bad, setBad] = useState(false);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [orderFilter, setOrderFilter] = useState<OrderStatus | "all">("all");

  const go = (t: string) => {
    const [name, filter] = t.split(":");
    if (name === "orders") setOrderFilter((filter as OrderStatus) ?? "all");
    setTab(name as Tab);
    window.scrollTo({ top: 0 });
  };

  if (!authed) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#050814] px-4">
        <form
          className="w-full max-w-sm rounded-3xl border border-cyan-400/30 bg-[#0b1222] p-8 text-center shadow-[0_0_60px_-15px_rgba(34,211,238,0.6)]"
          onSubmit={(e) => { e.preventDefault(); if (pin === PIN) setAuthed(true); else { setBad(true); setPin(""); } }}
        >
          <p className="text-4xl" aria-hidden>🎳</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-wide text-white">Boardwalk staff</h1>
          <p className="mt-1 text-sm text-slate-400">Owner & front desk admin</p>
          <input
            className="mt-6 w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] text-white focus:border-cyan-400 focus:outline-none"
            type="password" inputMode="numeric" maxLength={6} autoFocus value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setBad(false); }} aria-label="Staff PIN"
          />
          {bad && <p className="mt-2 text-sm text-rose-300">Wrong PIN.</p>}
          <button type="submit" className="mt-4 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold uppercase tracking-wide text-slate-950">Sign in</button>
          <p className="mt-4 text-xs text-slate-500">Concept demo: PIN <span className="font-mono text-slate-300">1234</span>. Production uses staff accounts with two-step sign-in.</p>
          <Link href="/" className="mt-3 inline-block text-xs text-cyan-300">← Back to the website</Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050814] text-slate-200">
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-white/10 bg-[#050814]/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden>🎳</span>
          <div>
            <p className="font-[family-name:var(--font-display)] text-2xl leading-none tracking-wide text-white">Boardwalk Bowl · Admin</p>
            <p className="text-[11px] text-slate-500">Concept demo · data saved in this browser</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {d && !d.onlineBooking && <span className="hidden rounded-full border border-rose-400/40 bg-rose-500/10 px-3 py-1 text-xs text-rose-200 sm:inline">Online booking paused</span>}
          <Link href="/rent-a-lane" target="_blank" className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-200">View Rent a lane ↗</Link>
          <button type="button" onClick={() => { setAuthed(false); setPin(""); }} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-slate-300">Sign out</button>
        </div>
      </header>
      <div className="flex">
        <nav className="sticky top-[61px] hidden h-[calc(100vh-61px)] w-56 shrink-0 overflow-y-auto border-r border-white/10 p-3 lg:block" aria-label="Admin sections">
          {TABS.map(([id, label, icon]) => (
            <button key={id} type="button" onClick={() => go(id)}
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold ${tab === id ? "bg-cyan-400 text-slate-950 shadow-[0_0_20px_-6px_rgba(34,211,238,0.8)]" : "text-slate-300 hover:bg-white/5"}`}>
              <span aria-hidden>{icon}</span>{label}
              {id === "orders" && d && d.orders.some((o) => o.status === "pending") && <span className="ml-auto rounded-full bg-amber-400 px-1.5 text-[10px] font-bold text-slate-950">{d.orders.filter((o) => o.status === "pending").length}</span>}
              {id === "parties" && d && d.parties.some((p) => p.status === "new") && <span className="ml-auto rounded-full bg-amber-400 px-1.5 text-[10px] font-bold text-slate-950">{d.parties.filter((p) => p.status === "new").length}</span>}
            </button>
          ))}
        </nav>
        <div className="min-w-0 flex-1">
          <div className="flex gap-2 overflow-x-auto border-b border-white/10 px-4 py-2 lg:hidden" role="tablist">
            {TABS.map(([id, label, icon]) => (
              <button key={id} type="button" onClick={() => go(id)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${tab === id ? "bg-cyan-400 text-slate-950" : "border border-white/10 text-slate-300"}`}>
                {icon} {label}
              </button>
            ))}
          </div>
          <div className="mx-auto max-w-6xl p-4 sm:p-6">
            {!d ? <div className="h-96 animate-pulse rounded-2xl bg-white/5" /> : (
              <>
                {tab === "dashboard" && <Dashboard d={d} go={go} />}
                {tab === "lanes" && <LaneBoard d={d} />}
                {tab === "orders" && <Orders key={orderFilter} d={d} initialStatus={orderFilter} />}
                {tab === "pricing" && <Pricing d={d} />}
                {tab === "schedule" && <Schedule d={d} />}
                {tab === "parties" && <Parties d={d} />}
                {tab === "gift" && <GiftCards d={d} />}
                {tab === "discounts" && <Discounts d={d} />}
                {tab === "arcade" && <Arcade d={d} />}
                {tab === "crm" && <Crm d={d} />}
                {tab === "register" && <Register d={d} />}
                {tab === "control" && <LaneControl d={d} />}
                {tab === "settings" && <Settings d={d} />}
                {tab === "activity" && <Activity d={d} />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
