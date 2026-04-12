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

export const BOWLING_RATES = {
  perGame: [
    { label: "Mon–Fri · Open–5pm", price: "$4.50" },
    { label: "Sat & Sun · Open–5pm", price: "$5.50" },
    { label: "Sun–Thu · 5pm–close", price: "$5.50" },
    { label: "Fri & Sat · 5pm–close", price: "$7.00" },
  ],
  perHour: [
    { label: "Mon–Fri · Open–5pm", price: "$22" },
    { label: "Sat & Sun · Open–5pm", price: "$32" },
    { label: "Sun–Thu · 5pm–close", price: "$32" },
    { label: "Fri & Sat · 5pm–close", price: "$42" },
  ],
  shoes: "$4",
} as const;

export const BILLIARDS_RATES = {
  table: "$10 per hour per table (per table, not per person — split with your group)",
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

export const TESTIMONIALS_PLACEHOLDER = [
  {
    quote:
      "Huge venue, great energy, and the staff keeps everything moving. Our group loved the arcade after bowling.",
    name: "Orlando guest",
    role: "Weekend visit",
  },
  {
    quote:
      "We hosted a team night here — lanes, food, and space to spread out. Easier than herding people across multiple spots downtown.",
    name: "Local manager",
    role: "Team outing",
  },
  {
    quote:
      "Kids Bowl Free was a win for our summer routine. Quick trip, predictable fun, and the crew is friendly with first-timers.",
    name: "East Orlando parent",
    role: "Family outing",
  },
] as const;

/** Opening paragraph(s) from the live Boardwalk Bowl homepage (alomabowlingcenters.com/boardwalk/), preserved for fidelity. */
export const HOME_INTRO_SCRAPED =
  "Boardwalk Bowl is a great place to have fun times with family and friends. At Boardwalk Bowl you can have a great time at prices that won’t break your family’s budget. We have plenty of bumper bowling lanes just for kids! Bumpers are great to keep the bowling balls out of the gutters and smiles on the faces of your small children. We also have our COOL Cosmic Bowling where you bowl with the lights down – great music turned up and awesome special effects lighting…it looks like a nightclub! When looking for family fun in Orlando look no further than Boardwalk Bowl!";
