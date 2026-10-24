"use client";

import type { OrderStatus } from "@/lib/admin-store";

export const inputCls =
  "w-full rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none";

export function Panel({ title, action, children, className = "" }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-white/10 bg-[#0b1222]/90 p-5 shadow-xl ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          {title && <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({ label, value, sub, tone = "cyan" }: { label: string; value: string; sub?: string; tone?: "cyan" | "orange" | "emerald" | "fuchsia" | "amber" }) {
  const c = { cyan: "text-cyan-200", orange: "text-orange-200", emerald: "text-emerald-200", fuchsia: "text-fuchsia-200", amber: "text-amber-200" }[tone];
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1222]/90 p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className={`mt-1 font-[family-name:var(--font-display)] text-4xl leading-none ${c}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "bg-amber-500/15 text-amber-200 border-amber-400/40",
  confirmed: "bg-cyan-500/15 text-cyan-200 border-cyan-400/40",
  "checked-in": "bg-emerald-500/15 text-emerald-200 border-emerald-400/40",
  completed: "bg-slate-500/15 text-slate-300 border-slate-400/30",
  cancelled: "bg-rose-500/15 text-rose-200 border-rose-400/40",
  refunded: "bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-400/40",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${STATUS_STYLE[status]}`}>{status.replace("-", " ")}</span>;
}

export function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "emerald" | "rose" | "amber" | "cyan" | "fuchsia" }) {
  const c = {
    slate: "bg-white/5 text-slate-300 border-white/10",
    emerald: "bg-emerald-500/15 text-emerald-200 border-emerald-400/40",
    rose: "bg-rose-500/15 text-rose-200 border-rose-400/40",
    amber: "bg-amber-500/15 text-amber-200 border-amber-400/40",
    cyan: "bg-cyan-500/15 text-cyan-200 border-cyan-400/40",
    fuchsia: "bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-400/40",
  }[tone];
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold ${c}`}>{children}</span>;
}

export function Btn({ children, onClick, tone = "ghost", disabled, type = "button", small }: { children: React.ReactNode; onClick?: () => void; tone?: "primary" | "ghost" | "danger" | "success"; disabled?: boolean; type?: "button" | "submit"; small?: boolean }) {
  const c = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold",
    ghost: "border border-white/15 text-slate-100 hover:border-cyan-400/50",
    danger: "border border-rose-400/50 text-rose-200 hover:bg-rose-500/15",
    success: "border border-emerald-400/50 text-emerald-200 hover:bg-emerald-500/15",
  }[tone];
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`rounded-lg ${small ? "px-2.5 py-1 text-xs" : "px-3.5 py-2 text-sm"} font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${c}`}>
      {children}
    </button>
  );
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
      {label}
      <div className="mt-1 normal-case tracking-normal">{children}</div>
      {hint && <span className="mt-1 block text-[11px] font-normal normal-case tracking-normal text-slate-500">{hint}</span>}
    </label>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-cyan-400" : "bg-slate-700"}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

export function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <aside className="h-full w-full max-w-lg overflow-y-auto border-l border-white/10 bg-[#070c18] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={title}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-white">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-full border border-white/15 px-3 py-1 text-sm text-slate-300" aria-label="Close">✕</button>
        </div>
        {children}
      </aside>
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">{children}</p>;
}

export function downloadCsv(name: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
