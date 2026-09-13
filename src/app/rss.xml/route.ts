import { routing } from "@/i18n/routing";
import { getGuides } from "@/lib/guides";

/**
 * Site-wide RSS 2.0 feed of guide articles across every locale, submitted to
 * search-engine webmaster tools (Naver Search Advisor 등) so new/updated
 * guides get discovered faster than waiting on the crawler's own sitemap
 * revisit cadence. Mirrors ExifLens's / FlyDroneMap's `src/app/rss.xml/route.ts`.
 *
 * Kept as a plain hand-built XML string (no extra dependency) — the feed is
 * simple enough (title/description/link/pubDate/guid) that a package isn't
 * warranted.
 *
 * SITE_URL is redefined locally (not imported) to match this file's existing
 * sibling conventions (`sitemap.ts`/`robots.ts`), since firelic's `lib/seo.ts`
 * keeps its own SITE_URL private (unexported).
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

const MAX_ITEMS = 50;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const allItems = routing.locales.flatMap((locale) =>
    getGuides(locale).map((guide) => ({
      title: guide.title,
      description: guide.description,
      url: `${SITE_URL}/${locale}/guides/${guide.slug}`,
      date: new Date(guide.updatedAt ?? guide.publishedAt),
      slug: guide.slug,
      locale,
    })),
  );

  allItems.sort((a, b) => b.date.getTime() - a.date.getTime());

  const items = allItems.slice(0, MAX_ITEMS);

  const itemsXml = items
    .map(
      (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.url}</link>
      <guid isPermaLink="true">${item.url}</guid>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`,
    )
    .join("");

  const lastBuildDate =
    items.length > 0 ? items[0].date.toUTCString() : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>FIRE Calculator Guides</title>
    <link>${SITE_URL}</link>
    <description>FIRE Calculator savings &amp; early-retirement guides — new and updated articles across all languages.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
