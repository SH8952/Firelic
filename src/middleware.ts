import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const DEV_EXCLUDE_COOKIE = "dev_exclude";
const DEV_EXCLUDE_TOKEN = process.env.DEV_EXCLUDE_TOKEN;

/**
 * Wraps next-intl's locale-routing middleware to also set a developer-
 * exclusion cookie when the site is visited with "?dev=<DEV_EXCLUDE_TOKEN>".
 * ExifLens/FlyDroneMap have the equivalent logic in src/proxy.ts (which also
 * forwards a geo-country cookie firelic doesn't use) — cookie-based (not
 * IP-based) so it works from any network, including a mobile bookmark
 * accessed away from home. Checked by /api/visitor-count and the GA4
 * inline script in src/components/GoogleAnalytics.tsx.
 */
export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  if (
    DEV_EXCLUDE_TOKEN &&
    request.nextUrl.searchParams.get("dev") === DEV_EXCLUDE_TOKEN
  ) {
    response.cookies.set(DEV_EXCLUDE_COOKIE, "1", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      httpOnly: false,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
