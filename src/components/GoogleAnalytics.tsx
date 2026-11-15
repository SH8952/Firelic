import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import { CONSENT_REGION_CODES } from "@/lib/consent";

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          // 2026-11-16 개발자 제외 강화: gtag.js 파일이 로드되면 config 호출 없이도
          // 구글 쪽 태그 설정으로 page_view가 자동 전송되는 것이 확인되어,
          // 제외 대상(쿠키/로컬 호스트)에서는 ga-disable 플래그를 먼저 켜고
          // gtag.js 파일 자체를 로드하지 않는다.
          var __ndExcluded = /(?:^|; )dev_exclude=1(?:;|$)/.test(document.cookie) ||
            ['localhost', '127.0.0.1', '[::1]'].indexOf(location.hostname) !== -1;
          window['ga-disable-${GA_MEASUREMENT_ID}'] = __ndExcluded;
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            region: ${JSON.stringify(CONSENT_REGION_CODES)},
            wait_for_update: 500
          });
          gtag('js', new Date());
          if (!__ndExcluded) {
            var __ndGa = document.createElement('script');
            __ndGa.async = true;
            __ndGa.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}';
            document.head.appendChild(__ndGa);
            gtag('config', '${GA_MEASUREMENT_ID}');
          }
        `}
      </Script>
    </>
  );
}
