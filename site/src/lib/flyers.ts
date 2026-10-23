/** Current promotional graphics from the live Specials & Events page (downloaded 2026-10-23, see INTERNAL_BUILD_SUMMARY.md). */
export type Flyer = {
  id: string;
  title: string;
  category: "featured" | "nightlife" | "seasonal" | "community";
  image: string;
  alt: string;
};

const F = "/images/boardwalk/2026/";

export const FLYERS: Flyer[] = [
  { id: "weekly-specials", title: "Weekly Specials", category: "featured", image: F + "BWB-specials.jpg", alt: "Boardwalk Bowl weekly specials: Twice on Tuesdays, Wine Down Wednesdays, College Knights, Cosmic Fridays and Saturdays, Sunday Fun Day" },
  { id: "october-calendar", title: "October 2026 Calendar", category: "featured", image: F + "October-2026-Calendar-Poster-scaled.jpg", alt: "Boardwalk Bowl October 2026 events calendar" },
  { id: "latin-nights", title: "Latin Nights Fridays", category: "nightlife", image: F + "October-2026-Latin-Night-Flyer.jpg", alt: "Latin Nights Fridays at The Bridge, October 2026, doors 7pm, no cover" },
  { id: "college-knights", title: "Thursday College Knights", category: "nightlife", image: F + "ucf-thursday.jpg", alt: "Thursday College Knights: $3 games, $3 shoes, $3 domestic drafts after 9:30pm" },
  { id: "fun-pack", title: "Friends & Family Fun Pack", category: "featured", image: F + "FFFP-new-scaled.jpg", alt: "Friends and Family Fun Pack: $59.99 per lane for 2 hours of bowling, shoes, sodas and a large pizza" },
  { id: "senior-expo", title: "Senior Wellness Expo · Nov 4", category: "community", image: F + "Nov-4-bw-expo-1.jpg", alt: "Senior Fun, Bowling and Wellness Expo on Wednesday November 4, 10am to 2pm" },
  { id: "black-friday", title: "Black Friday", category: "seasonal", image: F + "Black-Friday.png", alt: "Black Friday gift card bonuses and $14 bowling special" },
  { id: "holiday-gift-cards", title: "Holiday Gift Card Special", category: "seasonal", image: F + "Gift-cards.png", alt: "Holiday gift card special November 28 to December 24" },
  { id: "winter-pass", title: "Winter Pass", category: "seasonal", image: F + "Winter-Pass.png", alt: "Winter Pass December 21 to January 4: $14 for 2 games, shoes and a $5 arcade card" },
  { id: "holiday-hours", title: "Holiday Hours", category: "seasonal", image: F + "BWB-Holiday-hours.pdf.png", alt: "Boardwalk Bowl holiday hours for Thanksgiving through New Year's Day" },
  { id: "league-benefits", title: "League Bowler Benefits", category: "community", image: F + "league-bowler-discount-scaled.jpg", alt: "League bowler benefits card: $2.50 games, $2.50 shoes, 20% off food" },
  { id: "kids-flyer", title: "Kids Specials", category: "community", image: F + "kids-flyer.png", alt: "Boardwalk Bowl kids specials flyer" },
];
