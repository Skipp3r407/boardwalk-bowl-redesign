/** Promotional graphics downloaded from the live Specials & Events page (filenames local). */
export type Flyer = {
  id: string;
  title: string;
  category: "featured" | "nightlife" | "seasonal" | "community";
  image: string;
  alt: string;
};

export const FLYERS: Flyer[] = [
  {
    id: "latin-nights",
    title: "Latin Nights",
    category: "nightlife",
    image: "/images/boardwalk/flyers/april-latin-nights-.png",
    alt: "Latin Nights promotional graphic",
  },
  {
    id: "mothers-day",
    title: "Mother’s Day Special",
    category: "seasonal",
    image: "/images/boardwalk/flyers/Mothers-Day-Special.png",
    alt: "Mother’s Day special promotional graphic",
  },
  {
    id: "april-6",
    title: "Featured April Event",
    category: "featured",
    image: "/images/boardwalk/flyers/April-6th-1.png",
    alt: "April event promotional graphic",
  },
  {
    id: "karaoke",
    title: "Karaoke",
    category: "community",
    image: "/images/boardwalk/flyers/Boardwalk-Karaoke-generic-8.5x11-r2-scaled.jpg",
    alt: "Karaoke promotional flyer",
  },
  {
    id: "img-2114",
    title: "Happening at Boardwalk Bowl",
    category: "featured",
    image: "/images/boardwalk/flyers/IMG_2114.png",
    alt: "Upcoming happenings graphic",
  },
];
