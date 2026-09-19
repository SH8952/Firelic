import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import { CONSENT_REGION_CODES } from "@/lib/consent";

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
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
          if (!/(?:^|; )dev_exclude=1(?:;|$)/.test(document.cookie)) {
            gtag('config', '${GA_MEASUREMENT_ID}');
          }
        `}
      </Script>
    </>
  );
}
