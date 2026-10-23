import type { Metadata } from "next";

const DEFAULT_OG = {
  url: "/images/boardwalk/Boardwalk-Bowling-Front-View-Twilight-1536x1097.jpg",
  width: 1536,
  height: 1097,
  alt: "Boardwalk Bowl on East Colonial Drive in Orlando at twilight",
};

/** Unique title, description, canonical URL and Open Graph / Twitter card for one page. */
export function pageMeta({
  title,
  description,
  path,
  image,
  imageAlt,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
}): Metadata {
  const og = image ? { url: image, alt: imageAlt ?? title } : DEFAULT_OG;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | Boardwalk Bowl`,
      description,
      url: path,
      type: "website",
      locale: "en_US",
      siteName: "Boardwalk Bowl",
      images: [og],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Boardwalk Bowl`,
      description,
      images: [og.url],
    },
  };
}
