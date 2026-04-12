"use client";

import { useState } from "react";

export type DemoFormVariant = "contact" | "event" | "birthday" | "league" | "employment";

const titles: Record<DemoFormVariant, { title: string; subtitle: string }> = {
  contact: { title: "Send a message", subtitle: "We’ll route your note to the right team." },
  event: { title: "Event inquiry", subtitle: "Tell us what you’re planning—we’ll follow up with options." },
  birthday: { title: "Birthday inquiry", subtitle: "Share your date range and guest count to get started." },
  league: { title: "League interest", subtitle: "New to leagues? Say so—we’ll help you find a fit." },
  employment: { title: "Apply", subtitle: "Demo form for pitch—connect ATS or email routing later." },
};

export function DemoForm({
  variant,
  className = "",
}: {
  variant: DemoFormVariant;
  className?: string;
}) {
  const [sent, setSent] = useState(false);
  const copy = titles[variant];

  return (
    <form
      className={`glass-panel glass-panel-static rounded-2xl p-6 ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">{copy.title}</h3>
      <p className="mt-1 text-sm text-slate-400">{copy.subtitle}</p>

      {sent ? (
        <p className="mt-6 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
          Thanks—this demo doesn’t submit anywhere yet. Wire this form to your CRM, email, or Tripleseat workflow.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-300 sm:col-span-1">
            First name
            <input
              required
              className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
              name="firstName"
              autoComplete="given-name"
            />
          </label>
          <label className="block text-sm text-slate-300 sm:col-span-1">
            Last name
            <input
              required
              className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
              name="lastName"
              autoComplete="family-name"
            />
          </label>
          <label className="block text-sm text-slate-300 sm:col-span-2">
            Email
            <input
              required
              type="email"
              className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
              name="email"
              autoComplete="email"
            />
          </label>
          <label className="block text-sm text-slate-300 sm:col-span-2">
            Phone
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
              name="phone"
              autoComplete="tel"
            />
          </label>
          {(variant === "event" || variant === "birthday") && (
            <label className="block text-sm text-slate-300 sm:col-span-2">
              Event details
              <textarea
                className="mt-1 min-h-[100px] w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
                name="details"
                placeholder="Date ideas, guest count, must-haves…"
              />
            </label>
          )}
          {variant === "league" && (
            <label className="block text-sm text-slate-300 sm:col-span-2">
              Experience & preferred nights
              <textarea
                className="mt-1 min-h-[100px] w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
                name="league"
                placeholder="Never bowled a league? Say so—we’ll recommend a fit."
              />
            </label>
          )}
          {variant === "employment" && (
            <label className="block text-sm text-slate-300 sm:col-span-2">
              Position interest
              <input
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
                name="role"
                placeholder="Front desk, kitchen, maintenance…"
              />
            </label>
          )}
          {(variant === "contact" || variant === "employment") && (
            <label className="block text-sm text-slate-300 sm:col-span-2">
              Message
              <textarea
                className="mt-1 min-h-[100px] w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
                name="message"
              />
            </label>
          )}
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-bold uppercase tracking-wide text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110 sm:w-auto sm:px-10"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
