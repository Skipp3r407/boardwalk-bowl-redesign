import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/site/SiteChrome";
import { localBusinessJsonLd } from "@/lib/json-ld";
import { BUSINESS } from "@/lib/site-data";
import { SITE_URL } from "@/lib/site-url";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Boardwalk Bowl | Orlando Bowling, Arcade & Events",
    template: "%s | Boardwalk Bowl",
  },
  description: `${BUSINESS.legalName} on East Colonial — 80 lanes, Brunswick Sync, arcade, billiards, leagues, tournaments, and private events.`,
  keywords: [
    "Orlando bowling",
    "Boardwalk Bowl",
    "East Colonial Drive bowling",
    "arcade Orlando",
    "birthday parties bowling",
    "corporate team building Orlando",
    "bowling leagues Orlando",
  ],
  openGraph: {
    title: "Boardwalk Bowl | Orlando’s Premier Bowling & Entertainment Center",
    description:
      "Bowling, arcade, billiards, Brooklyn South Bar & Grill, leagues, and private events — all at one Orlando destination.",
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Boardwalk Bowl",
    images: [
      {
        url: "/images/boardwalk/Boardwalk-Bowling-Front-View-Twilight-1536x1097.jpg",
        width: 1536,
        height: 1097,
        alt: "Boardwalk Bowl exterior at twilight",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boardwalk Bowl | Orlando Bowling & Entertainment",
    description: "80 lanes, arcade, billiards, food & drinks, leagues, and events.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = localBusinessJsonLd();
  return (
    <html lang="en" className={`${display.variable} ${dmSans.variable} h-full scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${dmSans.className} min-h-full antialiased`}>
        <div className="relative z-10 min-h-full">
          <SiteChrome>{children}</SiteChrome>
        </div>
      </body>
    </html>
  );
}
