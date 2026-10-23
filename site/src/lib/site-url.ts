export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://boardwalk-bowl-redesign-site.vercel.app";

/**
 * This is an unofficial concept site, so search engines are asked not to index it unless
 * NEXT_PUBLIC_ALLOW_INDEXING=true (set that when the real business launches it on its own domain).
 * All the SEO markup (titles, descriptions, canonicals, Open Graph, JSON-LD, sitemap) is still output.
 */
export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
