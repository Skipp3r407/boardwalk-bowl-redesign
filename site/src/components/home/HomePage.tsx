import Image from "next/image";
import Link from "next/link";
import { SectionReveal } from "@/components/SectionReveal";
import { CtaRibbon } from "@/components/home/CtaRibbon";
import { TodaysHours } from "@/components/TodaysHours";
import {
  BOWLING_FUN_COPY,
  BUSINESS,
  FEATURED_VIDEOS,
  HOMEPAGE_ARCADE_SPOTLIGHT,
  HOME_INTRO_SCRAPED,
  STATS_STRIP,
  TESTIMONIALS_PLACEHOLDER,
} from "@/lib/site-data";
import { PATH } from "@/lib/paths";
import { scrapedHero } from "@/lib/boardwalk-page-images";
import { ScrapedOnPageGallery } from "@/components/scraped/ScrapedOnPageGallery";
import { HomeFlyerTiles } from "@/components/home/HomeFlyerTiles";
import { ExpandableImage } from "@/components/ui/ExpandableImage";
import { HeroGridFadeOverlay } from "@/components/home/HeroGridFadeOverlay";

const homeHeroSrc = scrapedHero(
  "home",
  "/images/boardwalk/Boardwalk-Bowling-Front-View-Twilight-1536x1097.jpg",
);

const highlights = [
  { label: "Bowling", href: PATH.bowling, emoji: "🎳", blurb: "80 lanes · Brunswick Sync" },
  { label: "Arcade", href: PATH.arcade, emoji: "🕹️", blurb: "Reloadable cards · prizes" },
  { label: "Billiards", href: PATH.billiards, emoji: "🎱", blurb: "Brooklyn South lounge" },
  { label: "Events", href: PATH.parties, emoji: "🎉", blurb: "Bridge · parties · teams" },
  { label: "Food & Drinks", href: PATH.foodDrinks, emoji: "🍔", blurb: "Brooklyn South Bar & Grill" },
  { label: "Leagues", href: PATH.bowlingLeagues, emoji: "🏆", blurb: "Beginners welcome" },
];

const visitIntent = [
  { label: "Bowl", href: PATH.bowling },
  { label: "Party", href: PATH.parties },
  { label: "Eat & Drink", href: PATH.foodDrinks },
  { label: "League", href: PATH.bowlingLeagues },
  { label: "Tournament", href: PATH.tournaments },
];

const partyCategories = [
  { label: "The Bridge Event Center", href: PATH.partiesBridge },
  { label: "Kid’s Birthday Parties", href: PATH.partiesKids },
  { label: "Teen Parties", href: PATH.partiesTeen },
  { label: "Company & Team Building", href: PATH.partiesCompany },
  { label: "Sweet 16 & Quinceañera", href: PATH.partiesSweet },
  { label: "Graduation Parties", href: PATH.partiesGrad },
  { label: "Fundraising", href: PATH.partiesFund },
  { label: "Schools & Daycares", href: PATH.partiesSchools },
  { label: "Youth & Team Parties", href: PATH.partiesYouth },
];

export function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[78vh] overflow-hidden">
        <Image
          src={homeHeroSrc}
          alt="Boardwalk Bowl exterior at twilight"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <HeroGridFadeOverlay />
        <div className="absolute inset-0 z-[3] bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/20" />
        <div className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_top,rgba(147,51,234,0.12),transparent_50%)]" />
        <div className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.15),transparent_55%)]" />
        <div className="relative z-[4] mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:pb-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/90">Orlando · East Colonial</p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-[0.04em] text-white sm:text-6xl md:text-7xl">
              <span className="hero-gradient-text">BOARDWALK BOWL</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-200/85 md:text-base">
              {BOWLING_FUN_COPY.heroTagline}
            </p>
            <p className="mt-5 max-w-2xl text-lg text-slate-200 sm:text-xl">
              {BUSINESS.legalName} — {BUSINESS.tagline}. Eighty lanes, cosmic nights, arcade energy, and party rooms
              that go past the tenth frame.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={PATH.parties}
                className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-xl shadow-orange-500/30 transition duration-200 hover:scale-[1.04] hover:brightness-110 hover:shadow-orange-500/45"
              >
                Plan an Event
              </Link>
              <Link
                href={PATH.bowling}
                className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition duration-200 hover:scale-[1.04] hover:border-cyan-400/60 hover:bg-cyan-500/15 hover:text-cyan-50 hover:shadow-[0_0_24px_-4px_rgba(34,211,238,0.45)]"
              >
                Lanes &amp; open play
              </Link>
              <Link
                href={PATH.specialsEvents}
                className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-6 py-3 text-sm font-semibold text-cyan-50 transition duration-200 hover:scale-[1.04] hover:border-orange-400/50 hover:bg-gradient-to-r hover:from-cyan-500/25 hover:to-orange-500/20 hover:text-white hover:shadow-[0_0_28px_-4px_rgba(34,211,238,0.35)]"
              >
                View Specials
              </Link>
            </div>
            <a
              href={BUSINESS.phoneTel}
              className="group/call mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition duration-200 hover:scale-[1.02] hover:text-cyan-100"
            >
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wider text-slate-200 transition duration-200 group-hover/call:bg-cyan-500/25 group-hover/call:text-cyan-50">
                Call
              </span>
              {BUSINESS.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Plan your visit strip */}
      <div className="cosmic-lane-strip border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-200/80">{BOWLING_FUN_COPY.planStripKicker}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Plan your visit</p>
            <TodaysHours />
          </div>
          <div className="flex flex-wrap gap-2">
            {visitIntent.map((v) => (
              <Link
                key={v.label}
                href={v.href}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition duration-200 hover:scale-105 hover:border-cyan-400/45 hover:bg-cyan-500/10 hover:text-cyan-50 hover:shadow-[0_0_20px_-4px_rgba(34,211,238,0.35)]"
              >
                {v.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Arcade spotlight — YouTube */}
      <section className="border-b border-white/10 bg-gradient-to-b from-slate-950/90 via-slate-950 to-slate-950/95 py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/90">Arcade</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-wide text-white md:text-4xl">
            {HOMEPAGE_ARCADE_SPOTLIGHT.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-400 md:text-base">{HOMEPAGE_ARCADE_SPOTLIGHT.subtitle}</p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-cyan-500/25 bg-black shadow-2xl shadow-cyan-500/10">
            <div className="relative aspect-video w-full">
              <iframe
                title="Boardwalk Bowl arcade walkthrough"
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${HOMEPAGE_ARCADE_SPOTLIGHT.youtubeId}?rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-600">Video tour of the games floor — content via YouTube.</p>
            <Link
              href={PATH.arcade}
              className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              Arcade details &amp; how it works →
            </Link>
          </div>
        </div>
      </section>

      {/* Live-site intro copy */}
      <SectionReveal className="border-b border-white/10 bg-slate-950/40 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">From the live Boardwalk Bowl site</p>
          <blockquote className="mt-3 text-lg leading-relaxed text-slate-300 md:text-xl">
            <span className="text-cyan-200/90">&ldquo;</span>
            {HOME_INTRO_SCRAPED}
            <span className="text-cyan-200/90">&rdquo;</span>
          </blockquote>
        </div>
      </SectionReveal>

      {/* Quick highlights */}
      <SectionReveal className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-white md:text-4xl">
              Pick your shot
            </h2>
            <p className="mt-2 max-w-2xl text-slate-400">
              One house, every kind of night—wood, tokens, pool cues, pizza, milestones, and league rivalries.
            </p>
          </div>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h) => (
            <Link
              key={h.label}
              href={h.href}
              className="group glass-panel rounded-2xl p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 transition group-hover:text-cyan-400/90">{h.emoji}</p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl tracking-wide text-white transition group-hover:text-cyan-50">
                    {h.label}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400 transition group-hover:text-slate-300">{h.blurb}</p>
                </div>
                <span className="text-cyan-300/80 transition duration-200 group-hover:translate-x-1 group-hover:text-cyan-200">→</span>
              </div>
            </Link>
          ))}
        </div>
      </SectionReveal>

      {/* Stats */}
      <section className="border-y border-fuchsia-500/15 bg-slate-950/50 shadow-[inset_0_0_60px_-20px_rgba(147,51,234,0.15)]">
        <div className="mx-auto grid max-w-7xl gap-px bg-gradient-to-b from-cyan-500/10 via-white/5 to-fuchsia-500/10 px-0 sm:grid-cols-2 lg:grid-cols-3">
          {STATS_STRIP.map((s) => (
            <div key={s.label} className="stat-glow bg-slate-950 px-6 py-8 text-center">
              <p className="font-[family-name:var(--font-display)] text-3xl text-white">{s.label}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-cyan-300/80">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaRibbon
        headline="Let’s roll — lanes are calling."
        body="Need bumpers, cosmic, or a full buyout? Tell us the occasion and headcount—we’ll line it up from the approach to the last pin."
        primary={{ label: "Call the house", href: BUSINESS.phoneTel }}
        secondary={{ label: "Plan something big", href: PATH.parties }}
      />

      {/* Value proposition */}
      <SectionReveal variant="left" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-white md:text-4xl">
          Why Boardwalk Bowl wins the night
        </h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <ul className="space-y-4 text-slate-300">
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
              <span>
                <strong className="text-white">80 lanes</strong> — room for leagues, tournaments, and walk-ins without
                feeling crowded.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.7)]" />
              <span>
                <strong className="text-white">Brunswick Sync</strong> — interactive games, themes, and stats that keep
                every frame interesting.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_12px_rgba(232,121,249,0.7)]" />
              <span>
                <strong className="text-white">Private events</strong> from Bridge receptions to company throwdowns—food,
                bar, and attractions in one walkable footprint.
              </span>
            </li>
          </ul>
          <div className="glass-panel glass-panel-static relative overflow-hidden rounded-2xl p-1">
            <ExpandableImage
              src="/images/boardwalk/Boardwalk-Bowling-Bowling-Lanes-3-Jennifer-Halpern.jpg"
              alt="Bowling lanes inside Boardwalk Bowl"
              sizes="(max-width:1024px) 100vw, 50vw"
              wrapperClassName="relative h-72 w-full cursor-zoom-in overflow-hidden rounded-xl sm:h-80"
            />
          </div>
        </div>
      </SectionReveal>

      {/* Attractions alternating */}
      <SectionReveal variant="right" className="border-t border-white/10 bg-slate-950/40 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center font-[family-name:var(--font-display)] text-3xl tracking-wide text-white md:text-4xl">
            Attractions showcase
          </h2>
          <div className="mt-12 space-y-14">
            {[
              {
                title: "Bowling · cosmic to competitive",
                body: "Bumpers for kids, Sync games for crews, and league nights for purists. Cosmic nights turn the house into a neon runway—music up, lights down.",
                href: PATH.bowling,
                img: "/images/boardwalk/Boardwalk-Bowling-Bowling-Lanes-3-Jennifer-Halpern.jpg",
              },
              {
                title: "Arcade · play, swipe, redeem",
                body: "No tokens—load a card, play across the floor, and bank tickets digitally. Perfect after bowling while you wait on lanes.",
                href: PATH.arcade,
                img: "/images/boardwalk/Boardwalk-Bowling-Rental-Desk-Jennifer-Halpern-1.png",
              },
              {
                title: "Billiards · Brooklyn South",
                body: "Six regulation tables, TVs, patio seating, and full bar access—post-bowling hangs with a lounge pulse.",
                href: PATH.billiards,
                img: "/images/boardwalk/wp-mirror/sites/2/2025/06/Boardwalk-Bowling-Brooklyn-South-Billards-Jennifer-Halpern.jpg",
              },
            ].map((row, i) => (
              <div
                key={row.title}
                className={`grid items-center gap-8 lg:grid-cols-2 ${i % 2 === 1 ? "lg:grid-flow-dense" : ""}`}
              >
                <div className={i % 2 === 1 ? "lg:col-start-2" : ""}>
                  <h3 className="font-[family-name:var(--font-display)] text-3xl text-white">{row.title}</h3>
                  <p className="mt-3 text-slate-400">{row.body}</p>
                  <Link
                    href={row.href}
                    className="mt-4 inline-flex text-sm font-semibold text-cyan-300 transition duration-200 hover:scale-105 hover:text-cyan-100"
                  >
                    Explore {row.title.split("·")[0]?.trim()}
                  </Link>
                </div>
                <ExpandableImage
                  src={row.img}
                  alt={`${row.title} at Boardwalk Bowl`}
                  sizes="(max-width:1024px) 100vw, 50vw"
                  wrapperClassName={`group relative h-64 cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 transition duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_40px_-8px_rgba(34,211,238,0.35)] sm:h-80 ${i % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}
                  imageClassName="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      {/* Specials */}
      <SectionReveal className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-white">This week at Boardwalk</h2>
            <p className="mt-2 text-slate-400">Flyers pulled from the live specials page—swap seasonally.</p>
          </div>
          <Link
            href={PATH.specialsEvents}
            className="text-sm font-semibold text-cyan-300 transition duration-200 hover:scale-105 hover:text-orange-200"
          >
            Full specials calendar →
          </Link>
        </div>
        <HomeFlyerTiles />
      </SectionReveal>

      {/* Featured videos */}
      <section className="border-y border-white/10 bg-slate-950/60 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center font-[family-name:var(--font-display)] text-3xl tracking-wide text-white">
            Featured videos
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-400">
            Embedded from the public Boardwalk Bowl homepage (YouTube IDs preserved).
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {FEATURED_VIDEOS.map((v) => (
              <div
                key={v.youtubeId}
                className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-cyan-500/10 transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:border-cyan-400/35 hover:shadow-[0_0_40px_-6px_rgba(34,211,238,0.35)]"
              >
                <div className="relative aspect-video w-full">
                  <iframe
                    title={v.title}
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leagues */}
      <SectionReveal className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/80 to-slate-950 p-8 lg:grid-cols-2 lg:p-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Leagues · 2026 summer forming</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-white">Roll with a crew</h2>
            <p className="mt-3 text-slate-400">
              Beginner-friendly options, corporate leagues, and traditional formats—plus Sync scoring perks that make
              weekly nights feel fresh.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={PATH.bowlingLeagues}
                className="rounded-full bg-white px-5 py-2 text-sm font-bold uppercase tracking-wide text-slate-950 transition duration-200 hover:scale-105 hover:bg-cyan-100 hover:shadow-[0_0_24px_-4px_rgba(34,211,238,0.5)]"
              >
                League info & signup
              </Link>
              <a
                href={BUSINESS.phoneTel}
                className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white transition duration-200 hover:scale-105 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-50"
              >
                Call {BUSINESS.phone}
              </a>
            </div>
          </div>
          <ExpandableImage
            src="/images/boardwalk/leagues-background-1-300x202-1.png"
            alt="Leagues visual from Boardwalk Bowl"
            sizes="(max-width:1024px) 100vw, 45vw"
            wrapperClassName="relative h-56 w-full cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 sm:h-72 lg:h-full lg:min-h-[280px]"
            imageClassName="object-cover opacity-90"
          />
        </div>
      </SectionReveal>

      {/* Kids / family */}
      <SectionReveal variant="left" className="border-t border-white/10 bg-slate-950/50 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">Kids & families</h2>
            <p className="mt-3 text-slate-400">
              Bumpers keep balls on lane, Kids Bowl Free keeps summers moving ({BUSINESS.name} publishes season dates on
              the live program page), and cosmic nights make Fridays feel like a mini festival.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={PATH.kidsBowlFree}
                className="rounded-full bg-cyan-500/15 px-5 py-2 text-sm font-semibold text-cyan-50 transition duration-200 hover:scale-105 hover:bg-cyan-500/30 hover:shadow-[0_0_24px_-4px_rgba(34,211,238,0.45)]"
              >
                Kids Bowl Free details
              </Link>
              <Link
                href={PATH.bowling}
                className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white transition duration-200 hover:scale-105 hover:border-orange-400/40 hover:bg-orange-500/10 hover:text-orange-50"
              >
                See bowling rates
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Bumpers on", "Lightweight gear", "Arcade next door", "Family packs"].map((t) => (
              <div
                key={t}
                className="glass-panel glass-panel-static rounded-xl px-4 py-5 text-sm font-semibold text-slate-200"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      {/* Parties grid */}
      <SectionReveal className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-center font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">
          Parties & events
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-slate-400">
          Pick a category—we tailor layouts, catering, and attractions to match.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partyCategories.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950 p-6 transition duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-cyan-400/50 hover:shadow-[0_20px_40px_-12px_rgba(34,211,238,0.25)]"
            >
              <div className="absolute inset-0 opacity-0 blur-2xl transition duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.45),transparent_55%)]" />
              <p className="relative text-sm font-semibold uppercase tracking-wider text-cyan-200 transition group-hover:text-orange-200">
                Event style
              </p>
              <p className="relative mt-2 font-[family-name:var(--font-display)] text-2xl text-white transition group-hover:text-cyan-50">
                {p.label}
              </p>
              <span className="relative mt-4 inline-flex text-sm font-semibold text-slate-300 transition group-hover:translate-x-1 group-hover:text-cyan-200">
                Open page →
              </span>
            </Link>
          ))}
        </div>
      </SectionReveal>

      {/* Food */}
      <SectionReveal variant="right" className="border-y border-white/10 bg-slate-950/60 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:items-center">
          <ExpandableImage
            src="/images/boardwalk/Brooklyn-Food-Pic-1-300x226-1.jpg"
            alt="Food from Brooklyn South Bar & Grill"
            sizes="(max-width:1024px) 100vw, 50vw"
            wrapperClassName="relative h-72 w-full cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 sm:h-96"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200">Eat · drink · lane-side</p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-white">Brooklyn South Bar & Grill</h2>
            <p className="mt-3 text-slate-400">
              Hand-tossed pizzas, burgers, shareables, and a full bar—served in-house with takeout options and delivery
              partners linked on the live site.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>Happy Hour Mon–Fri 3–6pm · $4 domestic pints & wells · $2 off select apps (per live site)</li>
              <li>Uber Eats & Grubhub links available from the Food & Drinks page</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={PATH.foodDrinks}
                className="rounded-full bg-orange-500 px-5 py-2 text-sm font-bold text-slate-950 transition duration-200 hover:scale-105 hover:bg-orange-400 hover:shadow-[0_0_28px_-4px_rgba(251,146,60,0.55)]"
              >
                Food & Drinks
              </Link>
              <Link
                href={PATH.parties}
                className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white transition duration-200 hover:scale-105 hover:border-cyan-400/45 hover:bg-cyan-500/10 hover:text-cyan-50"
              >
                Catering for events
              </Link>
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* Testimonials */}
      <SectionReveal className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-center font-[family-name:var(--font-display)] text-3xl text-white">Guests are talking</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-500">
          Placeholder social proof styled for pitch—swap with real reviews or UGC.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS_PLACEHOLDER.map((t) => (
            <blockquote
              key={t.name}
              className="glass-panel glass-panel-static rounded-2xl p-6 text-slate-300"
            >
              <p className="text-sm leading-relaxed text-slate-200">“{t.quote}”</p>
              <footer className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t.name} · {t.role}
              </footer>
            </blockquote>
          ))}
        </div>
      </SectionReveal>

      <ScrapedOnPageGallery pageKey="home" title="Boardwalk in pictures" />

      {/* Location */}
      <section className="border-t border-white/10 bg-slate-950 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Location & hours</h2>
              <p className="mt-2 text-slate-400">
                East Orlando off Colonial—easy reach from SR-50 and the 417 with on-site parking (per live site messaging).
              </p>
              <p className="mt-4 text-sm text-slate-300">{BUSINESS.fullAddress}</p>
              <div className="mt-4 space-y-1 text-sm text-slate-400">
                <TodaysHours />
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={BUSINESS.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-bold text-slate-950 transition duration-200 hover:scale-105 hover:bg-cyan-400 hover:shadow-[0_0_28px_-4px_rgba(34,211,238,0.55)]"
                >
                  Get directions
                </a>
                <Link
                  href={PATH.contact}
                  className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white transition duration-200 hover:scale-105 hover:border-orange-400/45 hover:bg-orange-500/10 hover:text-orange-50"
                >
                  Contact form
                </Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <iframe
                title="Google Map - Boardwalk Bowl"
                className="h-80 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=10749%20East%20Colonial%20Drive%20Orlando%20FL%2032817&output=embed"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CtaRibbon
        headline="Strike the night — your crew, our house."
        body="Birthdays, brackets, or “just bowl tonight”—we’ll get you on the wood with the right package."
        primary={{ label: "Plan an event", href: PATH.parties }}
        secondary={{ label: "Call now", href: BUSINESS.phoneTel }}
      />
    </>
  );
}
