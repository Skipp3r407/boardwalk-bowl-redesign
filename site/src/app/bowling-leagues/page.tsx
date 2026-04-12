import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SectionReveal } from "@/components/SectionReveal";
import { DemoForm } from "@/components/forms/DemoForm";
import { BUSINESS } from "@/lib/site-data";
import { PATH } from "@/lib/paths";
import { scrapedHero } from "@/lib/boardwalk-page-images";
import { ScrapedOnPageGallery } from "@/components/scraped/ScrapedOnPageGallery";
import { ExpandableImage } from "@/components/ui/ExpandableImage";

export const metadata: Metadata = {
  title: "Bowling Leagues",
  description:
    "Join a league at Boardwalk Bowl — 80 lanes, Brunswick Sync, beginner-friendly options, corporate leagues, and summer seasons forming now.",
};

export default function BowlingLeaguesPage() {
  return (
    <>
      <PageHero
        eyebrow="Community · competition · consistency"
        title="Leagues that fit real life"
        subtitle="Men’s, women’s, mixed, seniors, juniors, and specialty leagues—pick a night that works and let Sync scoring keep every week interesting."
        imageSrc={scrapedHero("leagues", "/images/boardwalk/leagues-background-1-300x202-1.png")}
        imageAlt="League visual"
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

      <SectionReveal variant="left" className="border-y border-white/10 bg-slate-950/60 py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Now forming</p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-white">2026 summer leagues</h2>
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
