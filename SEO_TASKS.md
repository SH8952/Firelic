# SEO 개선 예약 작업 (자동 진행) — FIRE Calculator (firelic)

이 파일은 매일 자동으로 실행되는 예약 작업(스케줄된 세션)이 읽고 따라야 할 작업 목록입니다.
각 항목은 서로 독립적이며, **하루에 정확히 하나씩만** 진행합니다.

ExifLens에서 먼저 운영해 효과를 검증한 동일한 자동화 프로세스를 firelic에도 적용하기로
석한님이 승인했습니다(2026-09-06). 아래 5개 항목은 저장소를 직접 점검해 실제로 비어 있는
부분만 골라 작성했습니다(추측이 아님) — firelic은 ExifLens/FlyDroneMap과 아키텍처가 달라
(shadcn `Button` 없음, CSS 변수 기반 스타일, `PolicyPageView`/`content/policies` 정책 페이지
구조), 구현 가이드는 firelic의 실제 코드 패턴에 맞게 새로 작성했습니다.

## 실행 규칙 (매일 반드시 지킬 것)

이 예약 작업은 **사용자 컴퓨터에 전혀 접근하지 않는 클라우드 전용 방식**으로 동작합니다(디바이스
바인딩 승인이 필요 없음 — 석한님이 잠들어 있어도 항상 정상 실행됩니다). ExifLens/FlyDroneMap/FIRE
Calculator의 "가이드 자동 발행" 예약 작업과 동일한 패턴입니다.

1. 저장소는 Public GitHub 저장소(`https://github.com/SH8952/firelic.git`)이므로 인증 없이
   `git clone --depth 1`로 클론한다. **어떤 GitHub 토큰/인증정보도 사용하지 않는다.**
   `device_bash`/`remote-devices` 도구는 사용하지 않는다(이 예약 작업은 컴퓨터 연결 여부와 무관하게
   항상 실행됨).
2. `npm install` 후, 이 파일(SEO_TASKS.md, 클론 안에서 읽음)에서 `- [ ]`(미완료)로 표시된 항목 중
   **가장 위에 있는 항목 하나만** 진행한다. 모두 `- [x]`면 아무 것도 바꾸지 말고 "오늘 진행할 SEO
   작업 없음"이라는 짧은 요약만 남기고 종료한다.
3. 클론 디렉터리 안에서 해당 항목을 구현한다. **firelic은 shadcn `Button`/`@/components/ui/*`가
   없다** — 기존 컴포넌트(`AffiliateBanner.tsx` 등)처럼 `var(--color-primary)`,
   `var(--color-surface)`, `var(--color-border)`, `var(--color-text-primary)`,
   `var(--color-text-secondary)` CSS 변수 + 순수 Tailwind 클래스만 사용한다. 새 npm 의존성은
   추가하지 않는다.
4. `npx tsc --noEmit`, `npx eslint <변경파일>`, `npm run build`(클라우드 환경은 정상 빌드 가능)로
   검증한다. UI에 영향이 있는 항목은 `npm run start`로 띄운 뒤 Playwright(헤드리스 크로미움,
   `/opt/pw-browsers/chromium`)로 실제 렌더링까지 확인한다(특히 한국어/일본어 줄바꿈 확인).
5. 검증이 끝나면: (a) `CHANGELOG.md` 최상단에 개발 이력 항목을 추가하고, (b) 이 파일(SEO_TASKS.md)에서
   오늘 완료한 항목의 체크박스를 `- [x]`로 바꾸고 완료 날짜를 한 줄 덧붙인다.
6. 오늘 변경/추가된 모든 파일(코드, CHANGELOG.md, SEO_TASKS.md 포함)을 **저장소 루트 기준
   상대경로를 그대로 유지한 zip 파일 하나**(`seo-task-payload.zip`)로 묶는다. zip 안에는 반드시
   `commit-message.txt`(커밋 메시지 전문, 이 파일의 항목 설명을 근거로 작성) 파일도 최상위에
   함께 포함한다.
7. 이 zip 파일 하나만 `SendUserFile`로 채팅에 첨부한다. 그리고 반드시 다음 안내를 최종 보고에
   포함한다: "첨부된 seo-task-payload.zip을 저장소의 automation 폴더
   (`~/Desktop/애드센스 제휴 마케팅/firelic/automation/`)에 넣으신 뒤, 그 안에 이미 설치되어
   있는 `apply-seo-task.command`를 더블클릭하시면 백업 → 적용 → 커밋 → push까지 맥에서 자동으로
   완료됩니다."
8. **git push는 이 클라우드 세션에서 절대 시도하지 않는다.** push는 항상 사용자 맥의
   `apply-seo-task.command`가 수행한다.
9. 광고 코드(GA4/AdSense 관련 스크립트, `AdSenseScript.tsx`, `AdSlot.tsx`, ads.txt 등)는 어떤
   항목에서도 건드리지 않는다. 조금이라도 애매하거나 위험해 보이면 해당 항목을 건너뛰고 이유를
   CHANGELOG와 최종 보고에 남긴 뒤, 체크박스는 미완료로 남겨 다음 실행에 재시도되게 한다.
10. clone이 실패하거나(저장소 접근 불가) 예상치 못한 오류가 나면, 무리해서 진행하지 말고 실패
    사실만 최종 보고에 남기고 종료한다(다음 날 재시도).
11. 항상 존댓말(한국어)로 커밋 메시지·문서를 작성한다.
12. 작업 종료 시 사용자에게 짧은 요약(오늘 진행한 항목, zip 첨부 여부, 적용 스크립트 실행 필요
    안내)을 메시지로 남긴다.
13. **이 클라우드 세션은 구글 서치 콘솔(GSC)에 접근할 수 없다.** "노출 상위 가이드"처럼 실시간
    데이터가 필요한 항목은 5일차에 정의된 객관적 대체 기준(category + publishedAt)을 그대로
    따른다 — 임의로 다른 기준을 만들지 않는다.

**중요**: 석한님이 로컬에서 `apply-seo-task.command`를 실행하지 않고 미루면(즉 push가 안 되면),
클론된 저장소에는 어제까지의 변경이 반영되지 않은 상태일 수 있습니다. 클론 직후 `git log`와 이
파일 내용을 먼저 확인해 중복 작업(직전 커밋 메시지가 오늘 항목과 동일해 보이는 경우)을 피한다.

---

## 1일차 — BreadcrumbList 구조화 데이터 추가

- [ ] 미완료

**배경**: `src/lib/seo.ts`에 `breadcrumbJsonLd` 헬퍼가 없고, 가이드 상세/목록 페이지 어디에도
구조화 데이터가 전혀 없음(직접 확인, 2026-09-06).

**구현 가이드**:
- `src/lib/seo.ts`에 `breadcrumbJsonLd(items: {name: string; url: string}[])` 헬퍼 함수 추가:
  ```ts
  export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    };
  }
  ```
- `src/app/[locale]/guides/[slug]/page.tsx`: `<article>` 최상단에 breadcrumb `<script>` 추가.
  경로: Home(`${SITE_URL}/${locale}`) → Guides(`${SITE_URL}/${locale}/guides`, 이름은 `guides.title`
  번역 키) → 현재 글(`${SITE_URL}/${locale}/guides/${slug}`, 이름은 `meta.title`). `SITE_URL`은
  이 파일 상단의 `process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"` 상수를 그대로 사용.
- `src/app/[locale]/guides/page.tsx`(가이드 목록)에도 Home → Guides 2단계 breadcrumb 추가.
- 새 번역 키 추가 불필요(기존 `guides.title` 재사용, 소문자 네임스페이스 주의 —
  firelic은 `Guides`가 아니라 `guides`).

---

## 2일차 — 가이드 상세 페이지에 Article JSON-LD 추가

- [ ] 미완료

**배경**: ExifLens/FlyDroneMap 가이드 상세 페이지에는 이미 Article JSON-LD가 있지만, firelic의
`src/app/[locale]/guides/[slug]/page.tsx`에는 구조화 데이터가 전혀 없음(직접 확인, 2026-09-06).
가장 근본적인 공백이므로 breadcrumb보다 먼저 챙길 만큼 우선순위가 높다.

**구현 가이드**:
- `GuideDetailPage` 컴포넌트 안, `<article>` 반환 직전에 아래 형태로 `articleJsonLd` 객체를
  구성:
  ```ts
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.publishedAt,
    dateModified: meta.updatedAt ?? meta.publishedAt,
    author: { "@type": "Organization", name: "FIRE Calculator" },
    publisher: { "@type": "Organization", name: "FIRE Calculator" },
    mainEntityOfPage: `${SITE_URL}/${locale}/guides/${slug}`,
    inLanguage: locale,
  };
  ```
- `<article>` 태그 안 최상단에
  `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />`
  추가.
- `GuideFrontmatter`/`GuideMeta` 타입에 `updatedAt` 필드가 있는지 먼저 `src/lib/guides.ts`에서
  확인하고, 없으면 `meta.publishedAt`만 `dateModified`로 사용(타입에 없는 필드를 억지로
  만들지 않는다).

---

## 3일차 — WebApplication JSON-LD 범위를 홈(계산기) 페이지로 한정

- [ ] 미완료

**배경**: 현재 `webApplicationJsonLd`가 `src/app/[locale]/layout.tsx`의 `<head>`에서 전체 페이지
(privacy-policy/terms/about/affiliate-disclosure/contact/guides 포함)에 동일하게 삽입되고
있음(직접 확인, 2026-09-06). firelic의 실제 도구(계산기)는 홈(`/`) 한 곳뿐이므로 홈페이지에만
적용되도록 정리한다.

**구현 가이드**:
- `src/app/[locale]/layout.tsx`에서 `webApplicationJsonLd` import 및 `<head>` 내 `<script>`
  삽입 코드를 제거.
- `src/app/[locale]/page.tsx`(홈, `FireCalculator`를 렌더링하는 페이지) 반환 JSX 최상단에
  `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd(locale)) }} />`를
  직접 추가.
- 다른 페이지(privacy-policy/terms/about/affiliate-disclosure/contact/guides/faq)는 손대지
  않는다.

---

## 4일차 — 가이드 글 내 메인 계산기 CTA 배너 추가

- [ ] 미완료

**배경**: 가이드 상세 페이지에 홈(FIRE 계산기)으로 유도하는 CTA가 전혀 없음(직접 확인,
2026-09-06). firelic은 shadcn `Button`이 없으므로 `AffiliateBanner.tsx`와 동일한 CSS 변수 +
순수 Tailwind 스타일로 새로 만든다.

**구현 가이드**:
- `src/components/GuideToolCta.tsx` 신규 컴포넌트 생성(async 서버 컴포넌트, `next-intl/server`의
  `getTranslations` 사용):
  ```tsx
  import { getTranslations } from "next-intl/server";
  import { Link } from "@/i18n/navigation";

  export async function GuideToolCta({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: "guides" });
    return (
      <div className="mt-8 flex flex-col items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--color-text-primary)]">{t("ctaBannerText")}</p>
        <Link
          href="/"
          className="shrink-0 rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          {t("ctaBannerButton")}
        </Link>
      </div>
    );
  }
  ```
- `messages/{en,ko,ja,es}.json`의 `guides` 네임스페이스(소문자)에 새 키 2개 추가:
  `ctaBannerText`, `ctaBannerButton`(예: "내 FIRE 목표를 지금 계산해보세요" /
  "Calculate Your FIRE Number Now" 등 톤에 맞게).
- `src/app/[locale]/guides/[slug]/page.tsx`에서 본문(`<div className="prose ...">`) 상단(제목
  바로 아래)과 하단(콘텐츠 끝, dev 패널 위) 두 군데에 이 컴포넌트를 배치.
- `Link` import 경로는 firelic의 `@/i18n/navigation`이 실제로 존재하는지 먼저 확인하고, 없다면
  일반 Next.js `next/link`의 `Link`를 사용(단, 로케일 프리픽스를 수동으로 붙여야 하므로
  `href={`/${locale}`}` 형태로 조정).

---

## 5일차 — 대표 가이드 2개의 타이틀/메타 디스크립션 개선 (영어)

- [ ] 미완료

**배경**: 이 클라우드 세션은 구글 서치 콘솔에 접근할 수 없으므로, "노출 상위 글"을 실시간으로 알 수
없다. 대신 객관적 기준으로 대상을 선정한다: 14개 영문 가이드의 `category`(4가지: FIRE Basics &
Concepts / Saving & Investing Strategy / Retirement Life & Withdrawal Strategy / Country & Tax
Considerations) 중 글이 가장 많은 카테고리 안에서, `publishedAt`이 가장 오래된 글 2개를 대상으로
한다.

**구현 가이드**:
- 대상 파일: 위 기준으로 클론 안에서 직접 찾은 `content/guides/en/*.mdx` 2개(frontmatter의
  `title`, `description`).
- 개선 방향: 타이틀에 숫자나 명확한 혜택(Benefit)을 포함, 메타 디스크립션은 질문형으로 시작해
  클릭을 유도하되 실제 글 내용과 반드시 일치해야 함(과장·클릭베이트 금지, 재무 조언처럼 읽히는
  확정적 문구 금지 — "당신도 은퇴할 수 있습니다" 같은 단정적 표현 대신 "FIRE 계산법", "시뮬레이션"
  같은 중립적 표현 사용).
- `generateMetadata`가 이 frontmatter를 그대로 읽어 `<title>`/`<meta description>`에 반영하는
  구조이므로 별도 코드 수정은 불필요.
- 어떤 글 2개를 선택했는지, 왜 그 기준을 적용했는지 CHANGELOG와 최종 보고에 명시할 것.

---

## 완료 후

5개 항목이 모두 `- [x]`가 되면, 이후 실행은 "오늘 진행할 SEO 작업 없음"만 보고하고 종료한다. 이
예약 작업 자체를 계속 둘지 삭제할지는 사용자가 별도로 판단한다.
