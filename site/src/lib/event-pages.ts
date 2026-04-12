import { PATH } from "./paths";

export type EventPageSlug =
  | "the-bridge-event-center"
  | "kids-birthday-parties"
  | "teen-parties"
  | "company-parties-team-building"
  | "sweet-16-quinceanera-parties"
  | "graduation-parties"
  | "fundraising"
  | "schools-daycares"
  | "youth-team-parties";

export type EventTheme = "elegant" | "playful" | "neon" | "corporate" | "celebration" | "bright";

export type EventPageConfig = {
  slug: EventPageSlug;
  title: string;
  shortTitle: string;
  eyebrow: string;
  description: string;
  theme: EventTheme;
  bullets: string[];
  faq: { q: string; a: string }[];
  cta: string;
};

export const EVENT_PAGES: Record<EventPageSlug, EventPageConfig> = {
  "the-bridge-event-center": {
    slug: "the-bridge-event-center",
    title: "The Bridge Event Center",
    shortTitle: "The Bridge",
    eyebrow: "Private venue · Full-service events",
    description:
      "The Bridge Event Center blends elegance with Boardwalk energy—perfect for receptions, banquets, corporate programs, and milestone celebrations with optional bowling and arcade add-ons.",
    theme: "elegant",
    bullets: [
      "Customizable layouts for banquets, ceremonies, and presentations",
      "Catering and bar packages tailored to your crowd",
      "AV support for slideshows, music, and speeches",
      "Add bowling or arcade time for a memorable hybrid celebration",
    ],
    faq: [
      {
        q: "Can we host a wedding reception here?",
        a: "Yes—teams use The Bridge for receptions, rehearsal dinners, and celebrations with flexible floor plans and catering.",
      },
      {
        q: "Do guests have access to bowling?",
        a: "You can add attractions as fun enhancements—ask the events team what fits your timeline and group size.",
      },
    ],
    cta: "Request Bridge availability",
  },
  "kids-birthday-parties": {
    slug: "kids-birthday-parties",
    title: "Kid’s Birthday Parties",
    shortTitle: "Kids birthdays",
    eyebrow: "Stress-free · High-energy · Parent-approved",
    description:
      "Boardwalk Bowl is built for birthday energy: bowling, games, great food, and coordinators who keep the plan on track so you can enjoy the moment.",
    theme: "playful",
    bullets: [
      "Packages designed for kids’ groups—ask about two package options",
      "Bumpers and lightweight gear for younger bowlers",
      "Arcade add-ons for nonstop smiles",
      "Dedicated birthday coordinator to lock your date and headcount",
    ],
    faq: [
      {
        q: "How far in advance should we book?",
        a: "Weekends fill quickly—reach out early, especially for prime Saturday slots.",
      },
      {
        q: "Can we bring a cake?",
        a: "Policies vary by package—note it in your inquiry and the coordinator will confirm details.",
      },
    ],
    cta: "Plan a kids birthday",
  },
  "teen-parties": {
    slug: "teen-parties",
    title: "Teen Parties",
    shortTitle: "Teen parties",
    eyebrow: "Social · Loud-in-the-right-way · Safe",
    description:
      "Give teens room to roam: bowling, arcade hits, and food that keeps up with big appetites—hosted in one high-energy Orlando venue.",
    theme: "neon",
    bullets: [
      "Bowling + arcade keeps the group moving",
      "Food packages built for hungry crews",
      "Team helps you match the vibe—music, seating, and flow",
      "Great for birthdays, celebrations, and “finally Friday” get-togethers",
    ],
    faq: [
      {
        q: "Is supervision required?",
        a: "Group policies depend on package and time—ask the team when you submit your inquiry.",
      },
    ],
    cta: "Book a teen celebration",
  },
  "company-parties-team-building": {
    slug: "company-parties-team-building",
    title: "Company Parties & Team Building",
    shortTitle: "Corporate & teams",
    eyebrow: "Presentations to playoffs",
    description:
      "Reward wins, onboard new hires, or reset the quarter with bowling-forward activities, flexible spaces, and catering that keeps teams fueled.",
    theme: "corporate",
    bullets: [
      "80 lanes + flexible layouts for large or intimate groups",
      "Interactive formats like Wheel of Bowling and Bowling Bingo",
      "Downloadable team-building overview for package ideas",
      "Private and semi-private spaces for agendas + social time",
    ],
    faq: [
      {
        q: "Can we run a short presentation?",
        a: "Yes—mention A/V needs in your inquiry so the team can match you to the right space.",
      },
    ],
    cta: "Schedule a corporate consult",
  },
  "sweet-16-quinceanera-parties": {
    slug: "sweet-16-quinceanera-parties",
    title: "Sweet 16 & Quinceañera Parties",
    shortTitle: "Sweet 16 / Quince",
    eyebrow: "Milestone moments · Styled your way",
    description:
      "Blend formal touches with fun: host in The Bridge, add bowling and arcade energy, and build a menu that fits family and friends.",
    theme: "elegant",
    bullets: [
      "Private Bridge styling for entrances, seating, and dance space",
      "Mocktails and beverage packages available",
      "Entertainment add-ons from music to arcade play",
      "Coordination support so parents can stay present",
    ],
    faq: [
      {
        q: "Can we bring vendors?",
        a: "Share your vendor list in the inquiry—teams will confirm what’s possible for your date.",
      },
    ],
    cta: "Design a milestone celebration",
  },
  "graduation-parties": {
    slug: "graduation-parties",
    title: "Graduation Parties",
    shortTitle: "Graduation",
    eyebrow: "All-in-one celebration",
    description:
      "From close friends to whole classes—celebrate the milestone with lanes, games, food, and space to breathe without splitting the party across town.",
    theme: "celebration",
    bullets: [
      "Flexible group sizes and semi-private options",
      "Food packages from pizzas to desserts",
      "Slideshow-friendly setups—ask during planning",
      "Arcade and billiards keep the energy high",
    ],
    faq: [
      {
        q: "Do you host large school groups?",
        a: "Yes—share expected headcount and timing so the team can propose the right footprint.",
      },
    ],
    cta: "Plan a grad bash",
  },
  fundraising: {
    slug: "fundraising",
    title: "Fundraising",
    shortTitle: "Fundraising",
    eyebrow: "501(c) partnerships · Proven formats",
    description:
      "Turn lane time into donations with Pick-a-Day packages, Bowl-a-Thon pledges, or a custom fundraising night with optional raffles and auctions.",
    theme: "bright",
    bullets: [
      "Pick-a-Day: pre-set 2-hour packages—org cost $11, sell up to $20 (up to $9 per package sold, per live site)",
      "Bowl-a-Thon: pledge-based formats for schools and nonprofits",
      "Custom event nights with food add-ons and prize paths",
    ],
    faq: [
      {
        q: "Who can participate?",
        a: "The live site references partnerships with 501(c) organizations—confirm eligibility with the fundraising coordinator.",
      },
    ],
    cta: "Start a fundraiser",
  },
  "schools-daycares": {
    slug: "schools-daycares",
    title: "Schools & Daycares",
    shortTitle: "Schools & daycares",
    eyebrow: "Field trips · Camps · Group packages",
    description:
      "Weather-proof fun for students and campers: bumpers, lightweight equipment, and coordinators who make arrivals smooth.",
    theme: "playful",
    bullets: [
      "Flexible weekday availability (open–4pm emphasis on live site)",
      "Group rates for schools, camps, daycares, and youth programs",
      "Bumpers and kid-friendly gear available",
      "Add arcade or food for full-day itineraries",
    ],
    faq: [
      {
        q: "What ages work best?",
        a: "Lanes can be configured for a wide range—share ages and group size for lane assignments.",
      },
    ],
    cta: "Coordinate a group visit",
  },
  "youth-team-parties": {
    slug: "youth-team-parties",
    title: "Youth & Team Parties",
    shortTitle: "Youth teams",
    eyebrow: "End-of-season energy",
    description:
      "Celebrate the roster with bowling, soft drinks, and pizza—built for teams who want simple pricing and easy planning.",
    theme: "neon",
    bullets: [
      "From $18.99 per person (published on live site) with package components—confirm details with the events desk",
      "2 hours of bowling + unlimited soft drinks; pizza included (per live site)",
      "Brunswick Sync interactive games for extra hype",
      "Minimum 10 guests; weekday windows with weekend options until 5pm (per live site)",
    ],
    faq: [
      {
        q: "Can coaches book evenings?",
        a: "Evenings may be available with adjustments—note timing in your inquiry.",
      },
    ],
    cta: "Book a team party",
  },
};

export const EVENT_SLUGS = Object.keys(EVENT_PAGES) as EventPageSlug[];

export function eventPath(slug: EventPageSlug): string {
  return `${PATH.parties}/${slug}`;
}
