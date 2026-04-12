import Link from "next/link";
import type { ReactNode } from "react";

function RibbonLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
  if (external) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function CtaRibbon({
  headline,
  body,
  primary,
  secondary,
}: {
  headline: string;
  body?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <div className="relative overflow-hidden border-y border-cyan-500/20 bg-gradient-to-r from-slate-900/90 via-slate-900 to-slate-900/90">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(34,211,238,0.14),transparent_45%),radial-gradient(circle_at_80%_50%,rgba(251,146,60,0.12),transparent_40%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-10 md:flex-row md:items-center">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white md:text-3xl">{headline}</p>
          {body && <p className="mt-2 max-w-xl text-sm text-slate-400">{body}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          <RibbonLink
            href={primary.href}
            className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-slate-950 shadow-lg shadow-cyan-500/25 transition duration-200 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/40"
          >
            {primary.label}
          </RibbonLink>
          {secondary && (
            <RibbonLink
              href={secondary.href}
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:scale-105 hover:border-orange-400/45 hover:bg-orange-500/10 hover:text-orange-50"
            >
              {secondary.label}
            </RibbonLink>
          )}
        </div>
      </div>
    </div>
  );
}
