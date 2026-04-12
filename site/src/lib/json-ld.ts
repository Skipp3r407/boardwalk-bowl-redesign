import { BUSINESS, HOURS_VENUE } from "./site-data";

export function localBusinessJsonLd() {
  const openingHours = HOURS_VENUE.map((h) => `${h.day}: ${h.hours}`).join("; ");
  return {
    "@context": "https://schema.org",
    "@type": "EntertainmentBusiness",
    name: BUSINESS.name,
    description:
      "Boardwalk Bowl is a bowling and entertainment center in Orlando featuring bowling, arcade, billiards, leagues, tournaments, and private events.",
    image:
      "https://alomabowlingcenters.com/boardwalk/wp-content/uploads/sites/2/2025/06/Boardwalk-Bowling-Front-View-Twilight.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.addressLine1,
      addressLocality: "Orlando",
      addressRegion: "FL",
      postalCode: "32817",
      addressCountry: "US",
    },
    telephone: BUSINESS.phone,
    url: "https://alomabowlingcenters.com/boardwalk/",
    openingHours,
  };
}
