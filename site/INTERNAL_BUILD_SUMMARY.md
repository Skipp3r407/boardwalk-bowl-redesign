# Boardwalk Bowl demo — internal build summary

This file documents what was crawled from the public Boardwalk Bowl site (`https://alomabowlingcenters.com/boardwalk/`), what was recreated in the Next.js demo (`./site`), local assets, and intentional placeholders.

## Live site pages discovered (public /boardwalk/ IA)

Primary: Home, Bowling, Bowling Leagues, Arcade, Billiards, Tournaments, Kids Bowl Free, Specials & Events, Food & Drinks, Contact/Location, Employment.

Parties & Events: hub plus The Bridge Event Center, Kid’s Birthday Parties, Teen Parties, Company Parties & Team Building, Sweet 16 & Quinceañera Parties, Graduation Parties, Fundraising, Schools & Daycares, Youth & Team Parties.

Downloads/links referenced on live site: Event Planning Guide PDF, Perfect Game PDF, Team Building PDF; Taco Tango; Uber Eats; Grubhub; Kids Bowl Free enrollment; Tripleseat (event booking).

## Routes recreated in this demo (28 static outputs)

- `/` — Home (sales-style landing)
- `/bowling`
- `/bowling-leagues`
- `/arcade`
- `/billiards`
- `/tournaments`
- `/kids-bowl-free`
- `/specials-events`
- `/food-drinks`
- `/contact-location`
- `/employment`
- `/parties-and-event` — events hub
- `/parties-and-event/[slug]` — 9 event detail layouts (SSG)
- `/faq`
- `/gallery`
- `/private-events`
- `/promotions`

## Assets downloaded into `public/` (local)

`public/images/boardwalk/`

- `Boardwalk-Bowling-Front-View-Twilight-1536x1097.jpg`
- `Boardwalk-Bowling-Bowling-Lanes-3-Jennifer-Halpern.jpg`
- `Boardwalk-Bowling-Rental-Desk-Jennifer-Halpern-1.png`
- `Brooklyn-Food-Pic-1-300x226-1.jpg`
- `brooklyn-south-logo@2x-1.webp`
- `corp-pic.jpg`
- `leagues-background-1-300x202-1.png`
- `Logo.jpg`
- `MG_1108-1-300x202-1.png`
- `UTA5487_WSM_4910-1.png`

`public/images/boardwalk/flyers/`

- `april-latin-nights-.png`
- `Mothers-Day-Special.png`
- `April-6th-1.png`
- `Boardwalk-Karaoke-generic-8.5x11-r2-scaled.jpg`
- `IMG_2114.png`

## Media referenced remotely (not downloaded)

- Featured YouTube embeds on the homepage: `OcHXXQcJkmM`, `H36XIf0gXhE` (iframe `youtube-nocookie.com`).
- Open Graph / schema still references a canonical image URL on `alomabowlingcenters.com` in addition to local `/public` paths for the demo.
- The live homepage also referenced a `mediadelivery.net` embed; it was not duplicated here (YouTube set covers “featured video” intent).

## Factual business data preserved (examples)

- Address & phone: `10749 East Colonial Drive, Orlando, FL 32817` · `407-384-0003`
- Bowling game & hourly rate tables + `$4` shoe rental (from live Bowling page)
- Billiards: `$10/hr/table` + billiards hours block
- Kids Bowl Free: ages `2–15`, `2 free games/day`, shoes not included; season window text references the live program (`May 25 – Aug 14` as published on the live page at crawl time — verify annually)
- Fundraising: Pick-a-Day cost/sell spread as published (`$11` org cost, up to `$20` sell, up to `$9` margin)
- Youth & Team parties: copy references starting price and package bullets from the live page — confirm before publishing
- Tournament hosted-event list, league “2026 summer forming” callout, Happy Hour pricing — from live copy

## Lane availability / dated tournament holds

The live site listed specific March tournament blackout examples **and** recurring Tue/Thu league patterns. This demo surfaces **recurring league patterns** prominently and avoids presenting one-off tournament dates as “current” (dates go stale). Replace with a CMS block or API-fed calendar for production.

## Forms & booking tools (placeholders)

- All `DemoForm` variants (`contact`, `event`, `birthday`, `league`, `employment`) are **front-end only** success states for the pitch.
- Production should embed **Tripleseat** (as on the live site) or POST to your CRM/email service.

## SEO / metadata

- Global metadata + JSON-LD `EntertainmentBusiness` in `src/app/layout.tsx`.
- Set `NEXT_PUBLIC_SITE_URL` in Vercel for absolute OG URLs in production.

## Known manual follow-ups before launch

- Replace placeholder testimonials on the homepage with real reviews or omit.
- Event detail galleries currently reuse a generic image pool — swap photography per vertical.
- Download additional photography from the live media library if you need full-bleed marketing shots beyond what was pulled here.
- Reconcile Kids Bowl Free dates every season.
- Confirm youth party pricing/components still match operations.

## Run / deploy

```bash
cd site
npm install
npm run dev
# production
npm run build && npm start
```

Vercel: set project root to `site/` (or monorepo equivalent).
