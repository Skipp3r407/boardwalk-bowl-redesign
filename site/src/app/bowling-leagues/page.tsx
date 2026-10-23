import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SectionReveal } from "@/components/SectionReveal";
import { DemoForm } from "@/components/forms/DemoForm";
import { BUSINESS, FALL_LEAGUES, LEAGUE_CONTACT } from "@/lib/site-data";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { PATH } from "@/lib/paths";
import { ScrapedOnPageGallery } from "@/components/scraped/ScrapedOnPageGallery";
import { ExpandableImage } from "@/components/ui/ExpandableImage";

export const metadata: Metadata = pageMeta({
  title: "Bowling Leagues in Orlando: 2026 Fall Schedule",
  description:
    "All 15 Boardwalk Bowl fall leagues in one table: day, start date, time, team size, weeks and weekly cost. Senior, youth, social and competitive USBC leagues.",
  path: "/bowling-leagues",
  image: "/images/boardwalk/2026/League-photo.jpg",
  imageAlt: "League bowlers at Boardwalk Bowl",
});

export default function BowlingLeaguesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Bowling Leagues", path: "/bowling-leagues" }])} />
      <PageHero
        eyebrow="Community · competition · consistency"
        title="Leagues that fit real life"
        subtitle="Men’s, women’s, mixed, seniors, juniors, and specialty leagues—pick a night that works and let Sync scoring keep every week interesting."
        imageSrc="/images/boardwalk/2026/League-photo.jpg"
        imageAlt="League bowlers on the lanes at Boardwalk Bowl"
      />

      <SectionReveal className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-3">
          {[
            {
              title: "Space to breathe",
              body: "Eighty lanes mean fewer nights sold out for your squad—weekly room for practice and play.",
            },
            {
              title: "Gear that keeps up",
              body: "Brunswick Sync scoring with interactive games when you want a break from straight ten‑pin.",
            },
            {
              title: "Corporate & custom",
              body: "Ask about company leagues—team building that shows up on the schedule weekly.",
            },
          ].map((c) => (
            <div key={c.title} className="glass-panel rounded-2xl p-6">
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-white">{c.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{c.body}</p>
            </div>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal className="mx-auto max-w-7xl px-4 pb-14">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">2026 fall season</p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-white">League schedule</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-400">
          Every league, typed out. Cost is per bowler per week. To join, use the sign-up form below or email{" "}
          <a className="font-semibold text-cyan-300" href={`mailto:${LEAGUE_CONTACT}`}>
            {LEAGUE_CONTACT}
          </a>
          .
        </p>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[760px] text-left text-sm">
            <caption className="sr-only">Boardwalk Bowl 2026 fall league schedule</caption>
            <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                {["Day", "League", "Starts", "Time", "Team", "Weeks", "Cost", "Type"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {FALL_LEAGUES.map((l) => (
                <tr key={l.name} className="hover:bg-cyan-500/5">
                  <td className="px-4 py-3 text-slate-400">{l.day}</td>
                  <th scope="row" className="px-4 py-3 font-semibold text-white">
                    {l.name}
                  </th>
                  <td className="px-4 py-3">{l.starts}</td>
                  <td className="px-4 py-3">{l.time}</td>
                  <td className="px-4 py-3">{l.team}</td>
                  <td className="px-4 py-3">{l.weeks}</td>
                  <td className="px-4 py-3 font-semibold text-orange-200">{l.cost}</td>
                  <td className="px-4 py-3 text-slate-400">{l.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link href={`${PATH.book}?type=league`} className="mt-5 inline-block rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-slate-950">
          Request a league spot
        </Link>
      </SectionReveal>

      <SectionReveal variant="left" className="border-y border-white/10 bg-slate-950/60 py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Now forming</p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-white">Fall leagues forming now</h2>
            <p className="mt-3 text-slate-400">
              Never bowled league before? You’re not alone—staff can match you to a friendly squad and explain etiquette in plain English.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={BUSINESS.phoneTel} className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-950">
                Call {BUSINESS.phone}
              </a>
              <Link href={PATH.contact} className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white">
                Front desk & hours
              </Link>
            </div>
          </div>
          <ExpandableImage
            src="/images/boardwalk/MG_1108-1-300x202-1.png"
            alt="League night at Boardwalk Bowl"
            sizes="(max-width:1024px) 100vw, 50vw"
            wrapperClassName="relative h-56 cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 sm:h-72"
          />
        </div>
      </SectionReveal>

      <ScrapedOnPageGallery pageKey="leagues" />

      <SectionReveal className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Join a league</h2>
            <p className="mt-2 text-sm text-slate-400">
              Demo inquiry form—connect your CRM or league management tool when you go live.
            </p>
          </div>
          <DemoForm variant="league" />
        </div>
      </SectionReveal>
    </>
  );
}
