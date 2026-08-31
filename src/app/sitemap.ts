import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getGuides } from "@/lib/guides";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

const STATIC_PATHS = ["", "/about", "/privacy-policy", "/terms", "/affiliate-disclosure", "/guides"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.6,
      });
    }
    for (const guide of getGuides(locale)) {
      entries.push({
        url: `${SITE_URL}/${locale}/guides/${guide.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
