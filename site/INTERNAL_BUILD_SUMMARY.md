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

## October 2026 upgrade (Elevate Digital Studios)

Checked against the live public pages on 2026-10-23. What changed:

- **SEO:** unique title + meta description per page (`lib/seo.ts` `pageMeta()`), canonical URLs, Open Graph/Twitter images (real photos), `app/sitemap.ts`, `app/robots.ts`, one H1 per page, descriptive alt text (gallery alt generated from file names in `altFromSrc`).
- **JSON-LD:** `BowlingAlley`+`EntertainmentBusiness` with opening hours (layout), `Event` for dated events (Specials page), `FAQPage` (FAQ, Bowling, Book, party pages), `BreadcrumbList`.
- **Indexing switch:** this is an unofficial concept, so `robots.txt` disallows and pages carry `noindex` unless `NEXT_PUBLIC_ALLOW_INDEXING=true`. All SEO markup still ships.
- **New `/book` request flow:** lanes / birthday / group event / league → date + start times from the real hours → guests → package or duration with a price estimate from the current rate card → contact → review → request number + .ics calendar file. Flags league nights and dated lane holds. Front-end only (production: Tripleseat / front-desk inbox).
- **Party package picker** (`components/booking/PackagePicker.tsx`) on the kids' birthday page: both packages, headcount stepper, 18% gratuity + 3% admin estimate, 10-guest minimum.
- **Specials page:** weekly specials typed out with today highlighted, happy hour, upcoming events (Latin Nights, Senior Expo Nov 4, Black Friday, Winter Pass), holiday hours; current flyers replace the April ones.
- **Leagues page:** the 15-league 2026 fall schedule as a real table (was only an image on the live site).
- **Data refresh (`lib/site-data.ts`):** current rates ($4.75/$5.75/$7.50 games, $24/$35/$45 hourly, $5 shoes, $11 billiards), dated lane holds, party packages, Fun Pack. Placeholder testimonials removed (no invented reviews).
- Header/top bar/mobile bar "Book" buttons go to `/book`.

### Fresh images (`public/images/boardwalk/2026/`, downloaded 2026-10-23, large files resized)

Source pages: https://alomabowlingcenters.com/boardwalk/ and its public sub-pages (specials-events, bowling, parties-and-event/*, food-drinks, arcade, billiards, bowling-leagues, kids-bowl-free, contact-location, tournaments). Original URLs:

- `100_0099-Jennifer-Halpern-scaled.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/06/100_0099-Jennifer-Halpern-scaled.jpg
- `100_0344-Jennifer-Halpern.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/06/100_0344-Jennifer-Halpern.jpg
- `100_0400-Jennifer-Halpern-scaled.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/06/100_0400-Jennifer-Halpern-scaled.jpg
- `Arcade-Kids-Pic-scaled.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/06/Arcade-Kids-Pic-scaled.jpg
- `BS-blk-bridge-transparency-e1753820242174.png` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/07/BS-blk-bridge-transparency-e1753820242174.png
- `BWB-Birthday_Page_1-scaled.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/06/BWB-Birthday_Page_1-scaled.jpg
- `BWB-Event-guide-combined.png` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2026/02/BWB-Event-guide-combined.png
- `BWB-Fall-26.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2026/07/BWB-Fall-26.jpg
- `BWB-Holiday-hours.pdf.png` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2026/10/BWB-Holiday-hours.pdf.png
- `BWB-rates.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2026/08/BWB-rates.jpg
- `BWB-specials.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2026/08/BWB-specials.jpg
- `Black-Friday.png` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2026/10/Black-Friday.png
- `Boardwalk--scaled.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/06/Boardwalk--scaled.jpg
- `Boardwalk-Bowling-Boardwalk-Arcade-Jennifer-Halpern.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/06/Boardwalk-Bowling-Boardwalk-Arcade-Jennifer-Halpern.jpg
- `Boardwalk-Bowling-Brooklyn-South-Billards-Jennifer-Halpern.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/06/Boardwalk-Bowling-Brooklyn-South-Billards-Jennifer-Halpern.jpg
- `Boardwalk-Bowling-Corn-Hole-Court.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/06/Boardwalk-Bowling-Corn-Hole-Court.jpg
- `Boardwalk-Bowling-Floor-Bar.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/06/Boardwalk-Bowling-Floor-Bar.jpg
- `Boardwalk-Bowling-Front-View-Twilight-Jennifer-Halpern.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/06/Boardwalk-Bowling-Front-View-Twilight-Jennifer-Halpern.jpg
- `Book-Holiday-image.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/04/Book-Holiday-image.jpg
- `FFFP-new-scaled.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2026/09/FFFP-new-scaled.jpg
- `Gift-cards.png` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2026/10/Gift-cards.png
- `Kids-bday-pic-5-scaled.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/06/Kids-bday-pic-5-scaled.jpg
- `League-photo.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/06/League-photo.jpg
- `Nov-4-bw-expo-1.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2026/10/Nov-4-bw-expo-1.jpg
- `October-2026-Calendar-Poster-scaled.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2026/09/October-2026-Calendar-Poster-scaled.jpg
- `October-2026-Latin-Night-Flyer.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2026/09/October-2026-Latin-Night-Flyer.jpg
- `Parties-image1.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/04/Parties-image1.jpg
- `Parties-image2.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/04/Parties-image2.jpg
- `Parties-image4.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/04/Parties-image4.jpg
- `Taco-Tango-Transparent-Logo.png` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2026/01/Taco-Tango-Transparent-Logo.png
- `Winter-Pass.png` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2026/10/Winter-Pass.png
- `X92GlY-blk-and-red-new-mixed-menu-side-2.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2026/05/X92GlY-blk-and-red-new-mixed-menu-side-2.jpg
- `adult-flyer.png` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2026/09/adult-flyer.png
- `bigstock-Red-Felt-Billiard-Table-With-R-2836337.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/06/bigstock-Red-Felt-Billiard-Table-With-R-2836337.jpg
- `corporate-pic.jpg.png` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/07/corporate-pic.jpg.png
- `kids-bday-pic-2.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/06/kids-bday-pic-2.jpg
- `kids-bday-pic.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/06/kids-bday-pic.jpg
- `kids-flyer.png` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2026/09/kids-flyer.png
- `league-bowler-discount-scaled.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2026/09/league-bowler-discount-scaled.jpg
- `quinceanera-2.png` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/07/quinceanera-2.png
- `team-party.png` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/07/team-party.png
- `ucf-thursday.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2026/09/ucf-thursday.jpg
- `xZApRT-blk-and-red-new-mixed-menu-side-1.jpg` ← https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2026/05/xZApRT-blk-and-red-new-mixed-menu-side-1.jpg

### Rent a lane (added 2026-10-23, user request: customers rent a lane through the website)

- `/rent-a-lane` (`components/lanes/LaneRental.tsx`, `LaneMap.tsx`, `lib/lanes.ts`): pick a day (next 14 days), bowlers and 1–3 hours → start times show how many lanes are left and the price → a bowling-alley lane map of all 80 lanes (wood lanes, arrows, pin decks; busy lanes dimmed) with neighbouring lanes pre-picked → shoes, bumpers, arcade card, bowler names for the Sync screens → contact + pay now / pay at desk → instant confirmation with lane numbers, desk code, add-to-calendar. Bookings are remembered on the device ("Your upcoming lanes").
- Availability is a seeded demo shaped by the real schedule: Tuesday league night (limited), Thursday league night (none), the Oct 25 / Oct 27–29 tournament holds and the Thanksgiving closure. Production: read the lane management / POS feed and take payment with Square or Stripe. The same booking engine can back a phone app later.
- Header, top bar, phone action bar, home hero and the Bowling page now go to "Rent a lane"; `/book` stays the party/event/league planner. `Service` + `ReserveAction` JSON-LD on the page.

### Owner admin, gift cards, game cards, discounts (added 2026-10-23, user request)

- `/admin` (PIN 1234 in the concept; noindex; no public header/footer via `ChromeGate`): dashboard (today's bookings and revenue, lanes in use, pending orders, gift/arcade sales, alerts, 7-day chart), live lane board (all 80 lanes for any date/time; close/reopen with reason, per-lane price changes, walk-ins, bookings per lane), orders (filter/search/CSV, confirm, check in, complete, mark paid, move lanes, partial or full refunds with reason, cancel with or without refund, notes, new phone/walk-in bookings), pricing (4 rate blocks, shoes, tax, premium/discount lanes, party packages), schedule (lane blocks by date/time/lane range, opening hours, daily specials on/off), parties (approve, deposit, decline), gift cards (issue, adjust balance, turn off, bonus offer), discount codes (% or $, lanes or whole order, max uses, expiry, pause), arcade game cards (packs, bonus credits, sales), customers (built from all sales, CSV), settings (pause online booking, max per lane, late hold, booking window, deposit) and an activity log.
- `/gift-cards`: buy emailed gift cards (with the owner's bonus offer), load arcade game card credits (new card or reload), check a gift card balance.
- Rent a lane now uses the admin data: owner prices and lane surcharges, closed lanes, lane blocks and booked orders take lanes off the map, promo codes and gift cards at checkout, and new bookings appear in /admin. Concept: data lives in the browser (localStorage, `lib/admin-store.ts`); production = database + staff logins + POS/lane system + Square/Stripe refunds.
