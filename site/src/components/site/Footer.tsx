import Link from "next/link";
import { BOWLING_FUN_COPY, BUSINESS, HOURS_VENUE } from "@/lib/site-data";
import { PATH } from "@/lib/paths";
import { NAV_GROUPS } from "@/components/site/nav-config";

const flatLinks = NAV_GROUPS.flatMap((g) => g.items);

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="lane-divider" />
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-[family-name:var(--font-display)] text-2xl tracking-[0.12em] text-white">
              BOARDWALK BOWL
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Orlando’s largest bowling and entertainment experience—lanes, lights, leagues, and events under one roof.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-fuchsia-300/70">{BOWLING_FUN_COPY.footer}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={PATH.parties}
                className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-950 transition duration-200 hover:scale-105 hover:shadow-[0_0_24px_-4px_rgba(34,211,238,0.5)]"
              >
                Plan an event
              </Link>
              <Link
                href={PATH.specialsEvents}
                className="rounded-full border border-orange-400/40 bg-orange-500/10 px-4 py-2 text-xs font-semibold text-orange-100 transition duration-200 hover:scale-105 hover:border-orange-300/60 hover:bg-orange-500/25 hover:shadow-[0_0_20px_-4px_rgba(251,146,60,0.4)]"
              >
                View specials
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Visit</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {BUSINESS.fullAddress}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Phone:{" "}
              <a className="font-semibold text-cyan-300 transition duration-200 hover:text-orange-200" href={BUSINESS.phoneTel}>
                {BUSINESS.phone}
              </a>
            </p>
            <a
              href={BUSINESS.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-sm font-semibold text-cyan-300 transition duration-200 hover:scale-105 hover:text-orange-200"
            >
              Get directions →
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Hours</h3>
            <ul className="mt-3 space-y-1 text-sm text-slate-400">
              {HOURS_VENUE.map((h) => (
                <li key={h.day} className="flex justify-between gap-4 border-b border-white/5 py-1">
                  <span className="text-slate-500">{h.day}</span>
                  <span className="text-slate-300">{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Connect</h3>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <a
                className="text-slate-300 transition duration-200 hover:scale-105 hover:text-cyan-300"
                href={BUSINESS.social.facebook}
              >
                Facebook
              </a>
              <a
                className="text-slate-300 transition duration-200 hover:scale-105 hover:text-orange-300"
                href={BUSINESS.social.instagram}
              >
                Instagram
              </a>
              <a
                className="text-slate-300 transition duration-200 hover:scale-105 hover:text-fuchsia-300"
                href={BUSINESS.social.twitter}
              >
                X
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Follow for tournaments, league updates, and weekend happenings.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sitemap</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
            {flatLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="transition duration-200 hover:scale-105 hover:text-cyan-200"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} {BUSINESS.name}. Demo redesign for proposal presentation. Business information
          sourced from the public Boardwalk Bowl website.
        </p>
        <p className="mt-2 text-center text-xs">
          <Link href="/admin" className="text-slate-600 underline decoration-white/10 underline-offset-2 hover:text-cyan-300">
            Staff login
          </Link>
        </p>
        <p className="mt-3 text-center text-xs text-slate-500">
          Website Designed &amp; Powered by{" "}
          <a
            href="https://elevatedigitalstudios.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-400 underline decoration-white/10 underline-offset-2 transition duration-200 hover:scale-[1.02] hover:text-cyan-300 hover:decoration-cyan-400/50"
          >
            Elevate Digital Studios
          </a>
        </p>
      </div>
    </footer>
  );
}
