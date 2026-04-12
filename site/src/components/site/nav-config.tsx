import { PATH } from "@/lib/paths";

export type NavItem = { label: string; href: string };

export type NavGroup = { label: string; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Attractions",
    items: [
      { label: "Bowling", href: PATH.bowling },
      { label: "Arcade", href: PATH.arcade },
      { label: "Billiards", href: PATH.billiards },
      { label: "Tournaments", href: PATH.tournaments },
      { label: "Kids Bowl Free", href: PATH.kidsBowlFree },
    ],
  },
  {
    label: "Leagues",
    items: [{ label: "Bowling Leagues", href: PATH.bowlingLeagues }],
  },
  {
    label: "Events & Parties",
    items: [
      { label: "Parties & Events", href: PATH.parties },
      { label: "The Bridge Event Center", href: PATH.partiesBridge },
      { label: "Kid’s Birthday Parties", href: PATH.partiesKids },
      { label: "Teen Parties", href: PATH.partiesTeen },
      { label: "Company Parties & Team Building", href: PATH.partiesCompany },
      { label: "Sweet 16 & Quinceañera Parties", href: PATH.partiesSweet },
      { label: "Graduation Parties", href: PATH.partiesGrad },
      { label: "Fundraising", href: PATH.partiesFund },
      { label: "Schools & Daycares", href: PATH.partiesSchools },
      { label: "Youth & Team Parties", href: PATH.partiesYouth },
    ],
  },
  {
    label: "More",
    items: [
      { label: "Specials & Events", href: PATH.specialsEvents },
      { label: "Promotions", href: PATH.promotions },
      { label: "Food & Drinks", href: PATH.foodDrinks },
      { label: "Contact / Location", href: PATH.contact },
      { label: "Employment", href: PATH.employment },
      { label: "Private Events", href: PATH.privateEvents },
      { label: "FAQ", href: PATH.faq },
      { label: "Gallery", href: PATH.gallery },
    ],
  },
];

export const PRIMARY_CTAS = [
  { label: "Plan an Event", href: PATH.parties },
  { label: "Book Bowling", href: PATH.contact, variant: "secondary" as const },
  { label: "View Specials", href: PATH.specialsEvents, variant: "ghost" as const },
];
