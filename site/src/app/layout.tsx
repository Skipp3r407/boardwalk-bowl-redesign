import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/site/SiteChrome";
import { localBusinessJsonLd } from "@/lib/json-ld";
import { ALLOW_INDEXING, SITE_URL } from "@/lib/site-url";
import { JsonLd } from "@/components/JsonLd";

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
    default: "Boardwalk Bowl | 80-Lane Bowling, Arcade & Parties in Orlando",
    template: "%s | Boardwalk Bowl",
  },
  description:
    "80 lanes, cosmic bowling, arcade, billiards and a bar & grill on East Colonial Drive in Orlando. See today's special and request lanes or a party online.",
  applicationName: "Boardwalk Bowl",
  alternates: { canonical: "/" },
  robots: ALLOW_INDEXING ? { index: true, follow: true } : { index: false, follow: true },
  formatDetection: { telephone: true, address: true },
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
        alt: "Boardwalk Bowl on East Colonial Drive in Orlando at twilight",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boardwalk Bowl | Orlando Bowling & Entertainment",
    description: "80 lanes, arcade, billiards, food & drinks, leagues, and events.",
    images: ["/images/boardwalk/Boardwalk-Bowling-Front-View-Twilight-1536x1097.jpg"],
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
        <JsonLd data={jsonLd} />
      </head>
      <body className={`${dmSans.className} min-h-full antialiased`}>
        <div className="relative z-10 min-h-full">
          <SiteChrome>{children}</SiteChrome>
        </div>
      </body>
    </html>
  );
}
