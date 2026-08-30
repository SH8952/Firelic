export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

type GtagEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * GA4 event taxonomy (see PRD section 7): slider_adjust, scenario_compare_start,
 * currency_change, fire_result_view, affiliate_link_click, guide_article_view,
 * locale_switch. No-op until NEXT_PUBLIC_GA_MEASUREMENT_ID is configured
 * (web-backend follow-up, after domain/Vercel setup).
 */
export function trackEvent(name: string, params: GtagEventParams = {}) {
  if (typeof window === "undefined") return;
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
