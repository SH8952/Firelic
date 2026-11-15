// GA4 measurement ID (firelic 전용 속성, 2026-11-15 속성 분리). exiflens/flydronemap 과 같은 방식으로
// 코드에 고정하고, 로컬 개발(npm run dev)에서는 수집하지 않도록 production 빌드에서만 사용한다.
// (예전 Vercel 환경변수 NEXT_PUBLIC_GA_MEASUREMENT_ID 는 더 이상 사용하지 않는다.)
export const GA_MEASUREMENT_ID: string | undefined =
  process.env.NODE_ENV === "production" ? "G-BJLE06QNMV" : undefined;

type GtagEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * GA4 event taxonomy (see PRD section 7): slider_adjust, scenario_compare_start,
 * currency_change, fire_result_view, affiliate_link_click, guide_article_view,
 * locale_switch. No-op outside production builds (see GA_MEASUREMENT_ID above).
 */
export function trackEvent(name: string, params: GtagEventParams = {}) {
  if (typeof window === "undefined") return;
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
