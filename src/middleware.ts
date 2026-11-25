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

// 2026-11-25 CPU 다이어트(Vercel 경로별 분석: 미들웨어 CPU가 다른 두 사이트와 달리 줄지 않음): ExifLens/FlyDroneMap과 같은 방식으로
// 적용 범위를 줄였다. 하는 일은 (1) 언어 접두사가 없는 주소의 언어 이동, (2) geo-country 쿠키 심기, (3) ?dev= 개발자 제외 쿠키 심기뿐이므로
//  - 언어 접두사가 없는 주소(/, /about 등)는 항상 실행하고,
//  - 언어 접두사가 있는 주소(/ko/…)는 "geo-country 쿠키가 아직 없는 일반 방문자"에게만 실행한다(쿠키가 이미 있는 재방문자와 검색엔진·크롤러는 건너뜀),
//  - 단 ?dev= 가 붙은 주소는 개발자 제외 쿠키를 심어야 하므로 항상 실행한다.
// 접두사 주소의 페이지는 setRequestLocale(locale) 로 언어를 직접 받으므로 미들웨어 없이도 같게 렌더링된다.
// 언어를 추가하면 아래 (ko|en|ja|es) 세 곳도 함께 고쳐야 한다. 되돌리려면 matcher 를 ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"] 한 줄로.
export const config = {
  matcher: [
    "/((?!(?:ko|en|ja|es)(?:/|$)|api|trpc|_next|_vercel|.*\\..*).*)",
    {
      source: "/:locale(ko|en|ja|es)/:path*",
      missing: [
        { type: "cookie", key: "geo-country" },
        {
          type: "header",
          key: "user-agent",
          value:
            ".*([Bb]ot|[Cc]rawl|[Ss]pider|[Ss]lurp|[Ff]acebookexternalhit|[Pp]review|[Mm]ediapartners|[Ll]ighthouse).*",
        },
      ],
    },
    {
      source: "/:locale(ko|en|ja|es)/:path*",
      has: [{ type: "query", key: "dev" }],
    },
  ],
};
