"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BUSINESS } from "@/lib/site-data";
import { PATH } from "@/lib/paths";
import { NAV_GROUPS } from "@/components/site/nav-config";

function cx(...p: (string | false | undefined)[]) {
  return p.filter(Boolean).join(" ");
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const desktopNavRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => setOpenDropdown(null), []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      closeDropdown();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, closeDropdown]);

  useEffect(() => {
    if (!openDropdown) return;
    function onDocMouseDown(e: MouseEvent) {
      if (desktopNavRef.current && !desktopNavRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDropdown();
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openDropdown, closeDropdown]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <header className="relative border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href={PATH.home}
          className="group flex min-w-0 items-center gap-3 transition duration-200 hover:scale-[1.02]"
          onClick={() => setMobileOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/boardwalk/Logo.jpg"
            alt={BUSINESS.name}
            className="h-10 w-auto shrink-0 rounded-sm object-contain ring-1 ring-white/10 transition duration-200 group-hover:ring-cyan-400/50 group-hover:shadow-[0_0_24px_-4px_rgba(34,211,238,0.4)] sm:h-11"
            width={140}
            height={48}
          />
          <span className="hidden min-w-0 flex-col leading-none sm:flex">
            <span className="font-[family-name:var(--font-display)] text-lg tracking-[0.08em] text-white">
              BOARDWALK
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-300/90">BOWL</span>
          </span>
        </Link>

        <nav ref={desktopNavRef} className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          <Link
            href={PATH.home}
            className={cx(
              "rounded-full px-3 py-2 text-sm font-medium text-slate-200 transition duration-200 hover:scale-105 hover:bg-white/5 hover:text-cyan-100",
              pathname === PATH.home && "bg-white/10 text-white",
            )}
          >
            Home
          </Link>

          {NAV_GROUPS.map((g, index) => {
            const isOpen = openDropdown === g.label;
            const menuId = `nav-menu-${index}`;
            const triggerId = `nav-trigger-${index}`;
            return (
              <div key={g.label} className="relative">
                <button
                  type="button"
                  className={cx(
                    "flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-slate-200 transition duration-200 hover:scale-105 hover:bg-white/5 hover:text-cyan-100",
                    isOpen && "bg-white/10 text-white",
                  )}
                  aria-expanded={isOpen}
                  aria-haspopup="menu"
                  aria-controls={menuId}
                  id={triggerId}
                  onClick={() => setOpenDropdown(isOpen ? null : g.label)}
                >
                  {g.label}
                  <span className={cx("text-[10px] text-slate-500 transition", isOpen && "rotate-180")}>▾</span>
                </button>
                <div
                  id={menuId}
                  role="menu"
                  aria-labelledby={triggerId}
                  className={cx(
                    "absolute top-full z-[100] pt-2 transition-[opacity,visibility] duration-150",
                    index >= NAV_GROUPS.length - 1 ? "right-0" : "left-0",
                    isOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none",
                  )}
                >
                  <div className="glass-panel glass-panel-static min-w-[260px] max-h-[min(70vh,520px)] overflow-y-auto rounded-xl p-2 shadow-2xl shadow-cyan-500/10">
                    {g.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        className={cx(
                          "block rounded-lg px-3 py-2 text-sm text-slate-200 transition duration-200 hover:translate-x-0.5 hover:bg-cyan-500/15 hover:text-cyan-50",
                          pathname === item.href && "bg-white/5 text-cyan-200",
                        )}
                        onClick={() => closeDropdown()}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
          <a
            href={BUSINESS.phoneTel}
            className="rounded-full border border-white/10 px-3 py-2 text-sm font-semibold text-slate-100 transition duration-200 hover:scale-105 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-50 hover:shadow-[0_0_20px_-4px_rgba(34,211,238,0.35)]"
          >
            Call
          </a>
          <Link
            href={PATH.rentLane}
            className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-orange-500/25 transition duration-200 hover:scale-105 hover:brightness-110 hover:shadow-orange-500/40"
          >
            Rent a lane
          </Link>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-white/15 p-2 text-slate-100 transition duration-200 hover:scale-105 hover:border-cyan-400/40 hover:bg-cyan-500/10 lg:hidden"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span className="text-xl leading-none">{mobileOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {mobileOpen && createPortal(
        <div className="fixed inset-0 z-[200] lg:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-[100dvh] w-[min(100%,400px)] flex-col border-l border-white/10 bg-slate-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <span className="font-[family-name:var(--font-display)] text-lg tracking-widest text-white">Menu</span>
              <button
                type="button"
                className="rounded-lg border border-white/15 px-3 py-1 text-sm text-slate-200"
                onClick={() => setMobileOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <Link
                href={PATH.home}
                className="mb-4 block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white"
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>
              {NAV_GROUPS.map((g) => (
                <details key={g.label} className="group mb-3 rounded-xl border border-white/10 bg-slate-900/60 open:border-cyan-500/20">
                  <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-cyan-200">
                    {g.label}
                  </summary>
                  <div className="border-t border-white/5 px-2 pb-2">
                    {g.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
              <div className="mt-4 grid gap-2">
                <a
                  href={BUSINESS.phoneTel}
                  className="rounded-xl bg-cyan-500/15 px-4 py-3 text-center text-sm font-bold text-cyan-100"
                  onClick={() => setMobileOpen(false)}
                >
                  Call {BUSINESS.phone}
                </a>
                <Link
                  href={PATH.contact}
                  className="rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-semibold text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Contact & directions
                </Link>
                <Link
                  href={PATH.rentLane}
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-3 text-center text-sm font-bold text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Rent a lane
                </Link>
                <Link
                  href={PATH.book}
                  className="rounded-xl border border-orange-400/40 px-4 py-3 text-center text-sm font-semibold text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Plan a party or event
                </Link>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </header>
  );
}
