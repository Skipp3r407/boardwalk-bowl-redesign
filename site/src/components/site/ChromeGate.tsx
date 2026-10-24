"use client";

import { usePathname } from "next/navigation";

/** The staff admin (/admin) gets its own full-screen layout without the public header, footer and phone bar. */
export function ChromeGate({ top, header, footer, floating, children }: { top: React.ReactNode; header: React.ReactNode; footer: React.ReactNode; floating: React.ReactNode; children: React.ReactNode }) {
  const path = usePathname();
  if (path?.startsWith("/admin")) return <main className="min-h-screen">{children}</main>;
  return (
    <>
      <div className="sticky top-0 z-50">
        {top}
        {header}
      </div>
      <main className="relative flex-1 overflow-x-hidden pb-24 lg:pb-0">{children}</main>
      {footer}
      {floating}
    </>
  );
}
