"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function GuideViewTracker({ slug, locale }: { slug: string; locale: string }) {
  useEffect(() => {
    trackEvent("guide_article_view", { slug, locale });
  }, [slug, locale]);
  return null;
}
