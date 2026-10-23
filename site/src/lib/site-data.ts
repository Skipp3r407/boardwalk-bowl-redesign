/** Boardwalk Bowl — factual business data sourced from the live public site (alomabowlingcenters.com/boardwalk/). */

export const BUSINESS = {
  name: "Boardwalk Bowl",
  legalName: "Boardwalk Bowl Entertainment Center",
  tagline: "Orlando’s premier bowling & entertainment destination",
  phone: "407-384-0003",
  phoneTel: "tel:4073840003",
  addressLine1: "10749 East Colonial Drive",
  cityStateZip: "Orlando, FL 32817",
  fullAddress: "10749 East Colonial Drive, Orlando, FL 32817",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Boardwalk+Bowl+10749+East+Colonial+Drive+Orlando+FL+32817",
  social: {
    facebook: "https://www.facebook.com/BoardwalkBowlFL/",
    twitter: "https://twitter.com/BoardwalkBowlFL",
    instagram: "https://www.instagram.com/boardwalkbowlfl/",
  },
  kidsBowlFreeUrl: "https://kidsbowlfree.com/center.php?alley_id=5844",
  tacoTangoUrl: "https://tacotango2go.com/",
  uberEatsUrl:
    "https://www.ubereats.com/store/boardwalk-bowl-orlando/xdogDLsRSr2xn-LMSsSIpw?diningMode=DELIVERY&surfaceName=",
  grubhubUrl:
    "https://www.grubhub.com/restaurant/brooklyn-south-bar--grill-10749-e-colonial-dr-orlando/11715096",
  pdfEventGuide:
    "https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2026/02/BWB-Event-guide-combined.pdf",
  pdfPerfectGame:
    "https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2026/02/bwb-perfect-game-combined_2.pdf",
  pdfTeamBuilding:
    "https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/06/BWB-team-Building.pdf",
} as const;

export type DayHours = { day: string; hours: string };

/** Venue-wide hours as published on the live site (footer + attraction pages). */
export const HOURS_VENUE: DayHours[] = [
  { day: "Monday", hours: "10am – 10pm" },
  { day: "Tuesday", hours: "11am – 12am" },
  { day: "Wednesday", hours: "11am – 12am" },
  { day: "Thursday", hours: "11am – 12am" },
  { day: "Friday", hours: "11am – 2am" },
  { day: "Saturday", hours: "9am – 2am" },
  { day: "Sunday", hours: "9am – 10pm" },
];

/** Brooklyn South Billiards hours as published on the live billiards page. */
export const HOURS_BILLIARDS: DayHours[] = [
  { day: "Monday", hours: "10am – 12am" },
  { day: "Tuesday", hours: "10am – 12am" },
  { day: "Wednesday", hours: "10am – 12am" },
  { day: "Thursday", hours: "10am – 12am" },
  { day: "Friday", hours: "10am – 2am" },
  { day: "Saturday", hours: "9am – 2am" },
  { day: "Sunday", hours: "9am – 10pm" },
];

/** Event office hours from the live Parties & Events hub. */
export const EVENT_OFFICE_HOURS: DayHours[] = [
  { day: "Monday", hours: "10am – 7pm" },
  { day: "Tuesday", hours: "10am – 7pm" },
  { day: "Wednesday", hours: "10am – 7pm" },
  { day: "Thursday", hours: "10am – 7pm" },
  { day: "Friday", hours: "10am – 7pm" },
  { day: "Saturday", hours: "10am – 5pm" },
];

/** Recurring lane availability patterns published on the live site (verify day-of). */
export const LANE_RECURRING_NOTES = [
  "Tuesday | 6:30–9:30 p.m. | League — limited lanes",
  "Thursday | 6:30–9:30 p.m. | League — no lanes",
] as const;

/** Dated lane holds and holiday changes as listed on the live site footer (checked 2026-10-23). */
export const LANE_DATED_NOTES = [
  { date: "2026-10-25", label: "Sun, Oct 25", note: "11 a.m.–3 p.m. · No lanes" },
  { date: "2026-10-28", label: "Tue–Wed, Oct 27–28", note: "All day · HS State · No lanes" },
  { date: "2026-10-29", label: "Thu, Oct 29", note: "Open–7 p.m. · HS State · No lanes" },
  { date: "2026-11-26", label: "Thu, Nov 26", note: "Closed · Happy Thanksgiving" },
  { date: "2026-11-27", label: "Fri, Nov 27", note: "Opens 10 a.m. · Black Friday" },
] as const;

export const BOWLING_RATES = {
  perGame: [
    { label: "Mon–Fri · Open–5pm", price: "$4.75" },
    { label: "Sat & Sun · Open–5pm", price: "$5.75" },
    { label: "Sun–Thu · 5pm–close", price: "$5.75" },
    { label: "Fri & Sat · 5pm–close", price: "$7.50" },
  ],
  perHour: [
    { label: "Mon–Fri · Open–5pm", price: "$24" },
    { label: "Sat & Sun · Open–5pm", price: "$35" },
    { label: "Sun–Thu · 5pm–close", price: "$35" },
    { label: "Fri & Sat · 5pm–close", price: "$45" },
  ],
  shoes: "$5",
} as const;

export const BILLIARDS_RATES = {
  table: "$11 per hour per table (per table, not per person — split with your group)",
} as const;

export const KIDS_BOWL_FREE = {
  datesLabel: "May 25 – August 14 (season dates published on the live Kids Bowl Free page)",
  ages: "2–15",
  offer: "2 free games per day, per person",
  shoes: "Not included",
} as const;

/** Playful alley voice — homepage, top bar, footer. */
export const BOWLING_FUN_COPY = {
  heroTagline: "Cosmic lights · house music · pins that fall your way",
  planStripKicker: "Tonight at the house",
  topBar: "80 lanes · East Orlando’s alley",
  footer: "Big-house energy. Real rental shoes. Zero boring frames.",
} as const;

export const STATS_STRIP = [
  { label: "80 lanes", sub: "House-full of wood" },
  { label: "Family fun", sub: "Bumpers & cosmic" },
  { label: "Arcade", sub: "Tickets & prizes" },
  { label: "Event spaces", sub: "Spare room to party" },
  { label: "Leagues", sub: "From rookies to crankers" },
  { label: "Eat & drink", sub: "Brooklyn South bar" },
] as const;

/**
 * Arcade floor walkthrough (YouTube) — matches the neon games-floor look; embedded prominently on the homepage.
 * Swap `youtubeId` if you prefer a different official or branded upload.
 */
export const HOMEPAGE_ARCADE_SPOTLIGHT = {
  title: "Inside the arcade",
  subtitle: "Games, glow, and prizes — reloadable cards and digital tickets on the Boardwalk floor.",
  youtubeId: "tUzpKtUp_7c",
} as const;

export const FEATURED_VIDEOS = [
  {
    title: "Featured video",
    youtubeId: "OcHXXQcJkmM",
  },
  {
    title: "Featured video",
    youtubeId: "H36XIf0gXhE",
  },
] as const;

/** Weekly specials, typed out from the live "BWB-specials" flyer (2026). Day index: 0 = Sunday. */
export const DAILY_SPECIALS = [
  { day: 0, name: "Sunday Fun Day", time: "Open–noon", deals: ["$4.00 games", "All-day Family Pack $34.99: 1 hour of bowling + up to 6 pairs of shoes"] },
  { day: 1, name: "Monday Half-Off", time: "6pm–close", deals: ["50% off the hourly bowling rate", "Arcade games & billiards"] },
  { day: 2, name: "Twice on Tuesdays", time: "Open–5pm & 10pm–close", deals: ["$3 games", "$2 shoes"] },
  { day: 3, name: "Wine Down Wednesdays", time: "9pm–close", deals: ["$5 house wines, Twisted Tea & SunCruiser cans", "$8 personal cheese pizza (+$1 a topping)", "All-you-can-bowl $13"] },
  { day: 4, name: "Thursday College Knights", time: "9:30pm–close", deals: ["$3 games", "$3 shoes", "$3 domestic drafts", "$11/hour billiards"] },
  { day: 5, name: "Cosmic Fridays", time: "11pm–close", deals: ["$15 all-you-can-bowl under the cosmic lights"] },
  { day: 6, name: "Cosmic Saturdays", time: "11pm–close", deals: ["$15 all-you-can-bowl under the cosmic lights"] },
] as const;

export const HAPPY_HOUR = {
  when: "Monday–Friday · 3–6pm",
  deals: ["$2 off select apps", "$4 drafts", "$4 wells"],
  allDay: "All day, every day: Bacardi, Captain Morgan & Smirnoff — $6 singles / $10 doubles",
} as const;

/** Friends & Family Fun Pack (live "FFFP" flyer). */
export const FUN_PACK = {
  price: "$59.99 + tax per lane",
  people: "Up to 5 people per lane",
  includes: ["2 hours of bowling", "Shoe rental", "Sodas", "1 large one-topping pizza"],
  when: "Monday–Friday · Open–5pm",
  note: "Walk-in special only — not available for reservation.",
} as const;

/** Kids’ birthday packages from the live birthday flyer. Prices per child, before 18% gratuity, 3% admin fee and tax. */
export const PARTY_PACKAGES = [
  {
    id: "fun-pizza",
    name: "Fun + Pizza",
    pricePerChild: 22.99,
    includes: ["2 hours of bowling with shoes", "Pizza (2 slices per child)", "Soft drinks"],
  },
  {
    id: "fun-food-arcade",
    name: "Fun + Food + Arcade",
    pricePerChild: 26.99,
    includes: [
      "2 hours of bowling with shoes",
      "Pizza (2 slices per child) or chicken tenders",
      "Soft drinks",
      "$5 arcade card per child",
      "Birthday child receives 500 tickets",
    ],
  },
] as const;

export const PARTY_TERMS = {
  gratuity: 0.18,
  adminFee: 0.03,
  minGuests: 10,
  allPackages:
    "Every package includes a party host, place settings, and a free game of bowling for each guest to use on a future visit.",
  availability:
    "Monday–Thursday any time; Friday–Sunday open–5pm. Evening parties after 5pm depend on availability, with an evening up-charge.",
} as const;

/** 2026 Fall league schedule, typed out from the live schedule image. */
export const FALL_LEAGUES = [
  { day: "Monday", name: "Fairways Palm Valley", starts: "Meet Sept 28 · Start Oct 5", time: "10:30 AM", team: 4, weeks: "26", cost: "$12", type: "Senior · fun, social" },
  { day: "Monday", name: "Home School", starts: "Meet Aug 17 · Start Sept 14", time: "1:00 PM", team: 4, weeks: "3 × 10 wks", cost: "$12", type: "Youth · USBC" },
  { day: "Monday", name: "Practice with a Purpose", starts: "Ongoing", time: "6:30 PM", team: 1, weeks: "—", cost: "$10", type: "Youth practice with coaches" },
  { day: "Monday", name: "Breathe Easy", starts: "Meet Aug 24 · Start Aug 31", time: "6:30 PM", team: 4, weeks: "36", cost: "$20", type: "Social · competitive · USBC" },
  { day: "Monday", name: "JR Gold Sport", starts: "Meet & start Aug 3", time: "5:30 PM", team: 1, weeks: "12", cost: "$16", type: "Youth · sport shot · USBC" },
  { day: "Tuesday", name: "Central Florida Classic", starts: "Meet Aug 25 · Start Sept 1", time: "7:15 PM", team: 4, weeks: "36", cost: "$30", type: "Social · competitive · USBC" },
  { day: "Wednesday", name: "Practice Makes Perfect", starts: "Meet & start Sept 30", time: "6:30 PM", team: 4, weeks: "16", cost: "$18", type: "Social and fun" },
  { day: "Wednesday", name: "Lousy Bowlers Club", starts: "Meet & start Sept 23", time: "6:30 PM", team: 1, weeks: "8", cost: "$99 / 8 wks", type: "Learn to bowl from coaches" },
  { day: "Thursday", name: "Realm", starts: "Meet & start Sept 10", time: "12:30 PM", team: 4, weeks: "32", cost: "$12", type: "Senior · fun, social · USBC" },
  { day: "Thursday", name: "Boardwalkers", starts: "Meet Aug 20 · Start Aug 27", time: "6:30 PM", team: 4, weeks: "32", cost: "$20", type: "Social · competitive · USBC" },
  { day: "Thursday", name: "Guys & Dolls", starts: "Meet Aug 27 · Start Sept 3", time: "6:45 PM", team: 4, weeks: "36", cost: "$23", type: "Social · competitive · USBC" },
  { day: "Friday", name: "TGIF", starts: "Meet Aug 28 · Start Sept 4", time: "6:30 PM", team: 4, weeks: "36", cost: "$20", type: "Social · competitive · USBC" },
  { day: "Saturday", name: "Youth", starts: "Meet & start Aug 15", time: "10:00 AM", team: 4, weeks: "4 × 8 wks", cost: "$12", type: "Youth · USBC" },
  { day: "Saturday", name: "Brewmasters", starts: "Meet & start Sept 12", time: "6:30 PM", team: 4, weeks: "17", cost: "$17", type: "Social and fun · every other week" },
  { day: "Sunday", name: "Adult/Youth", starts: "Meet & start Aug 30", time: "5:30 PM", team: 2, weeks: "8", cost: "$12", type: "1 adult + 1 youth · every other week · USBC" },
] as const;

export const LEAGUE_CONTACT = "bwbleagues@alomabowlingcenters.com";

/** Dated events and seasonal offers from the live Specials & Events page (checked 2026-10-23). */
export const UPCOMING_EVENTS = [
  {
    id: "latin-nights",
    name: "Latin Nights Fridays at The Bridge",
    start: "2026-10-23T19:00:00-04:00",
    end: "2026-10-30T23:59:00-04:00",
    when: "Fridays in October · doors 7pm · no cover",
    detail: "Live salsa bands every Friday: Oct 23 Rika Rumba, Oct 30 El Grupo Urbanizz Express. Full bar & grill.",
    image: "/images/boardwalk/2026/October-2026-Latin-Night-Flyer.jpg",
    free: true,
  },
  {
    id: "senior-expo",
    name: "Senior Fun, Bowling & Wellness Expo",
    start: "2026-11-04T10:00:00-05:00",
    end: "2026-11-04T14:00:00-05:00",
    when: "Wednesday, Nov 4 · 10am–2pm",
    detail: "Win prizes, free lunch buffet, bowling, and health & wellness resources. Register with the events office: 407-384-0003 ext. 1.",
    image: "/images/boardwalk/2026/Nov-4-bw-expo-1.jpg",
    free: true,
  },
  {
    id: "black-friday",
    name: "Black Friday Gift Cards & Bowling Special",
    start: "2026-11-27T10:00:00-05:00",
    end: "2026-11-27T17:00:00-05:00",
    when: "Friday, Nov 27 · opens 10am",
    detail: "Buy $50 get $20, buy $100 get $50 in gift cards all day. Open–5pm: $14 for 2 games, shoes and a $5 arcade card.",
    image: "/images/boardwalk/2026/Black-Friday.png",
    free: false,
  },
  {
    id: "winter-pass",
    name: "Winter Pass",
    start: "2026-12-21T10:00:00-05:00",
    end: "2027-01-04T17:00:00-05:00",
    when: "Dec 21 – Jan 4 · open–5pm every day (not NYE)",
    detail: "$14 per person: 2 games of bowling, shoes and a $5 arcade card.",
    image: "/images/boardwalk/2026/Winter-Pass.png",
    free: false,
  },
] as const;

export const HOLIDAY_HOURS = [
  { date: "Nov 26 · Thanksgiving", hours: "Closed" },
  { date: "Nov 27 · Black Friday", hours: "Opens 10 AM" },
  { date: "Dec 24 · Christmas Eve", hours: "10 AM – 6 PM" },
  { date: "Dec 25 · Christmas Day", hours: "Opens 3 PM" },
  { date: "Dec 31 · New Year’s Eve", hours: "Opens 10 AM" },
  { date: "Jan 1 · New Year’s Day", hours: "Opens Noon" },
] as const;

/** Opening paragraph(s) from the live Boardwalk Bowl homepage (alomabowlingcenters.com/boardwalk/), preserved for fidelity. */
export const HOME_INTRO_SCRAPED =
  "Boardwalk Bowl is a great place to have fun times with family and friends. At Boardwalk Bowl you can have a great time at prices that won’t break your family’s budget. We have plenty of bumper bowling lanes just for kids! Bumpers are great to keep the bowling balls out of the gutters and smiles on the faces of your small children. We also have our COOL Cosmic Bowling where you bowl with the lights down – great music turned up and awesome special effects lighting…it looks like a nightclub! When looking for family fun in Orlando look no further than Boardwalk Bowl!";
