import Script from "next/script";

const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
// AdSense's script tag requires the "ca-" prefixed client id (e.g.
// "ca-pub-XXXX"), while ads.txt and most dashboards use the bare "pub-XXXX"
// form. Normalize here so either form works in the env var (same pattern
// used in ExifLens/FlyDroneMap).
const ADSENSE_CLIENT_ID = ADSENSE_PUBLISHER_ID
  ? ADSENSE_PUBLISHER_ID.startsWith("ca-")
    ? ADSENSE_PUBLISHER_ID
    : `ca-${ADSENSE_PUBLISHER_ID}`
  : undefined;

/**
 * Loads the AdSense site-verification/auto-ads script. No-op until
 * NEXT_PUBLIC_ADSENSE_PUBLISHER_ID is set. This only loads Google's script
 * for crawler verification and (if enabled in the AdSense dashboard) auto
 * ads — it does not render manual ad units. AdSlot stays a placeholder
 * until the account is approved and real ad unit slot IDs exist.
 */
export function AdSenseScript() {
  if (!ADSENSE_CLIENT_ID) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
