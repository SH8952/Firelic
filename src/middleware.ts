import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const DEV_EXCLUDE_COOKIE = "dev_exclude";
const DEV_EXCLUDE_TOKEN = process.env.DEV_EXCLUDE_TOKEN;

/**
 * Wraps next-intl's locale-routing middleware to also set a developer-
 * exclusion cookie when the site is visited with "?dev=<DEV_EXCLUDE_TOKEN>".
 * ExifLens/FlyDroneMap have the equivalent logic in src/proxy.ts — cookie-based (not
 * IP-based) so it works from any network, including a mobile bookmark
 * accessed away from home. Checked by /api/visitor-count and the GA4
 * inline script in src/components/GoogleAnalytics.tsx.
 */
export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  // 방문자 국가(Vercel 엣지의 x-vercel-ip-country 헤더)를 짧은 수명의 쿠키로 전달.
  // 동의 배너(src/components/ConsentBanner.tsx)가 브라우저에서 이 쿠키를 읽어
  // 필요 여부를 판정한다(FlyDroneMap/ExifLens의 src/proxy.ts와 동일 방식).
  const country = request.headers.get("x-vercel-ip-country");
  if (country) {
    response.cookies.set("geo-country", country, {
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });
  }

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
