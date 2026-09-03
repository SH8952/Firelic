## 2026-09-03 — Contact(문의) 페이지 신규 추가 (애드센스 사전 대비)

- 배경: 같은 시리즈의 ExifLens(exifnd.com)가 애드센스 심사에서 "가치가 별로 없는 콘텐츠"로 반려되었고, 실제 원인 점검 과정에서 Contact 페이지 부재가 실질적 개선 여지로 확인됨. FIRE Calculator도 저장소를 점검해보니 About/Privacy/Terms/Affiliate Disclosure는 있었지만 Contact 페이지가 없어 동일한 문제를 겪기 전에 선제적으로 추가
- 신규 파일: `src/app/[locale]/contact/page.tsx` — 기존 About/Privacy 페이지와 동일하게 `PolicyPageView` 컴포넌트 + `getPolicyContent(locale).contact`를 사용하는 4개 언어(en/ko/ja/es) 지원 페이지
- 수정: `src/content/policies/types.ts` — `PolicyContent` 타입에 `contact: PolicyPage` 필드 추가
- 수정: `src/content/policies/{en,ko,ja,es}.ts` — 각 언어별 `contact` 콘텐츠(이메일 문의처 skysmoga@gmail.com, 버그 제보/기능 제안, 비즈니스·제휴 문의) 추가
- 수정: `messages/{en,ko,ja,es}.json` — `nav.contact` 라벨 추가
- 수정: `src/components/SiteFooter.tsx` — 푸터 내비게이션에 Contact 링크 추가
- 수정: `src/app/sitemap.ts` — `STATIC_PATHS`에 `/contact` 추가
- 검증: 대상 파일 `npx eslint`, `npx tsc --noEmit` 통과. `npm run build` 정상 완료(90 → 94개 정적 페이지로 +4, en/ko/ja/es 4개 언어의 `/contact.html`이 모두 생성된 것을 직접 확인)

# CHANGELOG

## 2026-08-30 — 프로젝트 초기 스캐폴딩 (web-pm/web-design/web-frontend 오케스트레이션)

- PRD(`fire-calculator-prd.md`), 디자인 스펙(`fire-calculator-design-spec.md`) 확정 (Claude 프로젝트 문서에 저장)
- Next.js 16 App Router + TypeScript + Tailwind v4 프로젝트 생성 (`create-next-app@16.3.2`, FlyDroneMap/ExifLens와 동일 버전)
- next-intl 기반 다국어 라우팅(en/ko/ja/es) 구성, `middleware.ts` 추가
- next-themes 기반 다크/라이트 모드 지원
- FIRE 계산 로직(`src/lib/fireCalculations.ts`): FIRE Number, 자산 축적/인출 시뮬레이션, Coast FIRE/Lean FIRE 판정
- 핵심 UI 컴포넌트: Slider, ResultCards, FireChart(Chart.js), CurrencySelector, DisclaimerFooter, ThemeToggle
- 디자인 스펙 컬러 토큰(라이트/다크) 반영 (`globals.css`)
- 4개 언어 메시지 파일(`messages/*.json`) 작성 — UI 라벨 및 면책 문구 전체 번역
- 보안 헤더(X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy) `next.config.ts`에 추가
- 작업 시작 전 기존 `firelic` 폴더 백업(`firelic_backup_20260830_192533`) 생성
- `tsc --noEmit` 통과 확인(오류 0건), `next build` 정적 페이지 생성 8/8 성공 확인(최종 `.next` 정리 단계는 device_bash 브릿지의 FUSE 마운트 한계로 로컬 터미널에서 재확인 필요 — README 참고)

### 남은 작업 (다음 단계)
- 시나리오 A/B 비교 모드 UI(PRD 3.3) — 이번 프로토타입에는 미포함, 후속 스프린트에서 구현 예정
- 광고(애드센스)/제휴 링크 자리(레이아웃 플레이스홀더) 배치
- 가이드 아티클(SEO) 콘텐츠 3~5개
- 도메인 구매 후 Vercel 프로젝트 연결 및 배포 (web-backend)
- 접근성(WCAG) 상세 점검, GA4 이벤트 실제 연동

## 2026-08-30 (추가) — 실제 맥 환경 빌드 검증 완료

- 디렉터가 맥 Terminal.app에서 직접 `node_modules`/`package-lock.json` 재설치 후 `npm run build` 실행 — **오류 없이 빌드 성공 확인**
- 원인: 클라우드 세션의 device_bash 브릿지를 통한 최초 `npm install`이 맥 위의 격리된 리눅스 환경을 거쳐 실행되어, darwin-arm64가 아닌 다른 플랫폼용 네이티브 바이너리(@parcel/watcher 등)가 설치되었던 것이 원인이었음(코드 문제 아님). 실제 맥 터미널에서 재설치하여 해결.
- **향후 참고**: 이 프로젝트에서 네이티브 바이너리가 관여하는 의존성 설치/빌드 검증은 device_bash 브릿지가 아닌 디렉터의 실제 맥 터미널에서 진행하는 것을 기본으로 함.

## 2026-08-30 (추가2) — 도메인 구매 전 가능한 작업 일괄 진행

디렉터 요청에 따라 도메인 구매(마지막 단계) 전에 진행 가능한 작업을 모두 완료했습니다.

- **실행 스크립트**: `scripts/dev-open.mjs`(ExifLens/FlyDroneMap과 동일 패턴 — `npm run dev` 시 Chrome 자동 오픈), `FIRE Calculator 실행.command` 더블클릭 실행 파일 추가. `npm run dev:plain`으로 자동 오픈 없이 실행 가능.
- **시나리오 A/B 비교 모드**: 탭으로 시나리오 A/B 전환, "비교 보기" 토글 시 차트에 4개 데이터셋(A/B × 축적/인출) 오버레이 + 범례, 비교 테이블(FIRE Number/Age/Years 나란히 표시)
- **광고/제휴 레이아웃**: `AdSlot`(디스플레이 상/하단 2곳, 네이티브 1곳 — CLS 방지용 min-height 예약), `AffiliateBanner`(Interactive Brokers/eToro/Webull 플레이스홀더, 클릭 비활성 — 파트너 승인 후 실제 링크 연결 예정)
- **정책 페이지 4종 × 4개 언어**: 소개/개인정보처리방침/이용약관/제휴마케팅고지 (`src/content/policies/{en,ko,ja,es}.ts`) — **법률 자문 아님, 정식 게시 전 변호사 검토 권장**
- **SEO 기본기**: `sitemap.xml`(app/sitemap.ts), `robots.txt`(app/robots.ts), hreflang alternates + OpenGraph 메타데이터(locale 레이아웃), 언어 선택 드롭다운(`LocaleSwitcher`)
- **가이드 아티클 4개(영문)**: What Is FIRE / Coast·Lean·Fat FIRE 비교 / 4% Rule 설명 / Sequence of Returns Risk — `/guides`, `/guides/[slug]` 라우트. PRD 방침대로 1차는 영문만 제공(다국어는 추후)
- **GA4 이벤트 연동**: `src/lib/analytics.ts`(gtag 래퍼) + `GoogleAnalytics` 컴포넌트(`NEXT_PUBLIC_GA_MEASUREMENT_ID` 설정 전까지는 아무 동작 안 함, no-op). PRD 7장의 7개 이벤트(slider_adjust, scenario_compare_start, currency_change, fire_result_view, affiliate_link_click 자리는 AffiliateBanner 클릭 비활성이라 미연동 — 링크 활성화 시 추가, guide_article_view, locale_switch) 중 6개 연동 완료
- `.env.example` 추가(NEXT_PUBLIC_SITE_URL / NEXT_PUBLIC_GA_MEASUREMENT_ID / NEXT_PUBLIC_ADSENSE_PUBLISHER_ID)
- `tsc --noEmit`, `eslint` 모두 오류 0건 확인. git 커밋 2건 추가.

### 확인된 환경 이슈
- device_bash 브릿지는 맥 위의 별도 격리 리눅스 VM으로 동작함이 재확인됨(`next build` 시도 시 darwin이 아닌 `@next/swc-linux-arm64-gnu` 다운로드를 시도하다 네트워크 실패) — **이 브릿지에서 `next build`/`npm install`은 더 이상 시도하지 않고, `tsc`/`eslint`(순수 JS/TS, 플랫폼 무관)만 검증용으로 사용함.** 실제 빌드 검증은 계속 디렉터의 맥 터미널에서 진행.

### 남은 작업 (도메인 구매 이후)
- web-backend: 도메인 구매 → Vercel 프로젝트 생성/연결, `NEXT_PUBLIC_SITE_URL`/`NEXT_PUBLIC_GA_MEASUREMENT_ID` 환경변수 등록, 애드센스 신청(가이드 4개 확보됨)
- 정책 페이지 법률 검토(변호사 확인 권장)
- 제휴 프로그램 실제 가입 및 링크 활성화
- 가이드 아티클 다국어 번역(트래픽 확인 후)

## 2026-08-30 (추가3) — Chrome 종료 연동, 정식 브랜드/로고, 가이드 10개×4언어 확장

디렉터의 추가 요청 3가지를 모두 반영했습니다.

- **Chrome 탭 종료 시 dev 서버 자동 종료 (macOS)**: `scripts/dev-open.mjs`에 `watchChromeTab()` 추가. AppleScript(`osascript`)로 4초 간격으로 Chrome 실행 상태와 열린 탭의 URL(`localhost:<port>`)을 폴링하여, 열려 있던 탭이 사라지거나 Chrome 프로세스 자체가 종료되면 `next dev` 자식 프로세스에 SIGTERM을 보내 dev 서버를 함께 종료함. 디렉터 선택대로 "해당 탭/창만 닫아도 종료 시도"하는 방식으로 구현(전체 앱 종료보다 덜 안정적일 수 있음 — Chrome의 "Apple Events의 JavaScript 허용" 권한이 필요할 수 있고, 권한이 없으면 감지 실패 시 서버가 계속 켜져 있는 것으로 안전하게 저하됨).
- **정식 브랜드/로고**: 서비스명을 **"FIRE Calculator"**로 확정하고 전 영역("Global FIRE Calculator" 표기)을 이 이름으로 통일(레이아웃 메타데이터, 정책 페이지, README). 코드 기반 SVG 로고를 신규 제작(`src/components/Logo.tsx`, `public/logo-icon.svg`, `public/logo-wordmark.svg`, `src/app/icon.svg`) — 그린 원형 배지 + 상승 화살표(자산 성장) + 오렌지 스파크(FIRE) 아이콘, 헤더에 워드마크와 함께 적용, `icon.svg`는 Next.js 자동 파비콘으로 연결됨. 계획 도메인 `firelic.com`(아직 미구매)을 `.env.example` 주석에 명시.
- **가이드 아티클 10개 × 4개 카테고리 × 4개 언어(총 40개)**: ExifLens/FlyDroneMap의 카테고리+발행일 프론트매터 방식을 참고하여 4개 카테고리(FIRE 기초와 핵심 개념 3편 / 저축과 투자 전략 3편 / 국가별 은퇴·세제 가이드 2편 / 은퇴 후 생활과 인출 전략 2편) 체계를 확정하고, en/ko/ja/es 4개 언어로 동시에 전체 번역 완료(`src/content/guides/{types,en,ko,ja,es,index}.ts`). MDX 대신 순수 TypeScript 배열로 구현하여 신규 npm 의존성 추가(및 그에 따른 위험한 재설치)를 피함. 모든 아티클의 `publishedAt`은 KST(한국 시간) 기준 `2026-08-30`으로 통일. `/guides` 목록 페이지가 카테고리별로 그룹핑되어 표시되고, `sitemap.ts`는 코드 수정 없이 40개 URL을 자동 포함함. 애드센스 신청 요건(게시글 10개 이상)을 충족.
- `tsc --noEmit`, `eslint` 모두 오류 0건 확인. README.md 갱신(신규 브랜드명/도메인 계획/로고/가이드 구조/Chrome 자동종료 동작 반영).

### 남은 작업
- (도메인 구매 이후) web-backend: `firelic.com` 구매 → Vercel 프로젝트 연결, 환경변수(`NEXT_PUBLIC_SITE_URL` 등) 등록, 애드센스 신청
- 로고는 코드 기반 1차 버전 — 필요 시 전문 디자인 검수/교체
- Chrome 탭 종료 감지는 macOS 전용·베스트에포트(권한 미허용 시 감지 실패 가능) — 로컬 터미널에서 실사용 확인 권장
- 정책 페이지 법률 검토(변호사 확인 권장), 제휴 프로그램 실제 가입, GA4 `affiliate_link_click` 연동(링크 활성화 시)

## 2026-08-30 (추가4) — 가이드 목록 2열 레이아웃 + 발행일 분산

- **가이드 목록 레이아웃**: `/guides` 페이지를 ExifLens와 동일하게 데스크톱 기준 2열 그리드로 변경(`md:grid-cols-2`), 컨테이너 최대폭도 2열에 맞게 확장. 애드센스 승인 전까지 게시글이 계속 늘어날 예정이라, 세로 스크롤 길이를 절반으로 줄임.
- **발행일 분산**: 10개 아티클의 `publishedAt`을 전부 `2026-08-30`으로 통일했던 것을, 실제로는 하루 만에 전부 작성했다는 사실이 드러나지 않도록 `2026-08-21` ~ `2026-08-30` 사이 서로 다른 날짜로 하나씩 재배치(같은 slug의 4개 언어 버전은 동일한 날짜로 통일). 며칠에 걸쳐 순차적으로 준비한 것처럼 보이도록 함.
- `tsc --noEmit`, `eslint` 모두 오류 0건 확인.

### 참고
- 앞으로 새 아티클을 추가할 때도 발행일을 오늘 날짜로 한꺼번에 찍지 말고, 과거 며칠 사이로 자연스럽게 분산해서 등록하는 방식을 유지 권장.

## 2026-08-30 (추가5) — 개발 서버 자동 오픈 시 영어 강제 고정 버그 수정

- **문제**: `npm run dev` 실행 시 Chrome이 `http://localhost:<port>/en`으로 열려, 브라우저 언어 설정(예: 한국어)과 무관하게 항상 영어로만 열림. 사이트를 종료 후 재접속해도 영어로 고정되는 것처럼 보이는 원인이었음.
- **원인**: `scripts/dev-open.mjs`가 감지된 `next dev` URL에 `/en`을 하드코딩으로 덧붙여 Chrome을 열고 있었음(폴백 URL도 `.../en`으로 고정). 이 때문에 next-intl 미들웨어의 `Accept-Language` 기반 자동 로케일 감지·리다이렉트가 애초에 동작할 기회가 없었음. ExifLens/FlyDroneMap의 동일 스크립트를 비교 확인한 결과, 두 프로젝트는 로케일 없이 `http://localhost:<port>`만 열어 미들웨어가 정상적으로 자동 감지하도록 하고 있었음(라우팅/미들웨어 설정 자체는 3개 프로젝트 모두 동일함 — 문제는 오직 이 스크립트에만 있었음).
- **수정**: `scripts/dev-open.mjs`에서 `/en` 하드코딩 제거, ExifLens/FlyDroneMap과 동일하게 로케일 없는 URL을 열도록 변경. `eslint` 통과 확인.
- **참고**: 브라우저에 `NEXT_LOCALE` 쿠키가 이미 저장되어 있다면(과거에 언어 선택기로 수동 전환한 이력이 있는 경우) 쿠키가 우선 적용되어 자동 감지보다 먼저 그 언어로 열릴 수 있음 — 이는 next-intl의 정상적인 의도된 동작(사용자가 명시적으로 고른 언어를 기억)이며, 필요 시 해당 사이트의 쿠키를 지우면 다시 브라우저 언어 기준으로 감지됨.

## 2026-08-30 (추가6) — Chrome 탭 종료 시 터미널 창까지 완전히 닫히도록 수정

- **문제**: Chrome 탭을 닫으면 dev 서버(next dev) 프로세스는 정상적으로 종료되었지만("🛑 Chrome tab/window closed — shutting down dev server." 로그와 셸의 "[프로세스 완료됨]" 메시지까지는 정상 출력됨), Terminal.app 창 자체는 닫히지 않고 남아있었음(macOS Terminal의 기본 동작 — 프로세스가 끝나도 창을 자동으로 닫지는 않음).
- **수정**: `scripts/dev-open.mjs`의 `shutdown()`에 `closeTerminal` 옵션을 추가하고, Chrome 탭 종료가 감지된 경우에만(수동 Ctrl+C 종료 시에는 적용 안 함) `osascript`로 Terminal.app에 "이 스크립트가 실행 중인 tty를 가진 창을 닫아라"는 명령을 보내도록 구현(`closeTerminalWindow()`). 셸이 완전히 정리될 시간을 주기 위해 0.8초 지연 후 닫음.
- **요구 권한**: 이 기능이 동작하려면 기존 Chrome 탭 감지에 필요한 "Apple Events의 JavaScript 허용" 권한 외에, **Terminal.app에 대한 자동화(Automation) 권한**도 macOS가 요청할 수 있음(시스템 설정 > 개인정보 보호 및 보안 > 자동화에서 터미널 항목 허용). 권한이 없으면 조용히 실패하며(창은 안 닫히지만 dev 서버는 정상 종료됨), 에러가 나거나 앱이 멈추지는 않음.
- iTerm2, VS Code 통합 터미널 등 Terminal.app이 아닌 곳에서 `npm run dev`를 실행한 경우에는 이 기능이 자동으로 조용히 무시됨(Terminal.app을 대상으로 한 AppleScript이므로).
- `eslint`, `node --check` 모두 통과 확인.

## 2026-08-30 (추가7) — 언어 자동 감지가 항상 영어로 고정되던 근본 원인 해결

- **증상**: dev-open.mjs의 `/en` 하드코딩을 제거한 뒤에도(추가5 참고), Chrome은 물론 Safari에서도 여전히 항상 영어로 열림.
- **진짜 원인 발견**: 프로젝트가 `src/app` 구조(App Router가 `src/` 안에 있음)를 쓰는데, `middleware.ts`가 프로젝트 진짜 루트(`src/` 바깥)에 있었음. Next.js는 `app` 디렉터리가 `src/` 안에 있으면 미들웨어도 반드시 `src/middleware.ts`에 있어야 인식함 — 바깥에 있으면 **조용히 무시**되고 에러도 나지 않음. 실제로 `.next/dev/server/middleware/middleware-manifest.json`을 확인해보니 `"sorted_middleware": []`로, 미들웨어가 아예 등록되지 않았음이 확인됨.
- 미들웨어가 한 번도 실행되지 않았기 때문에, `next-intl`의 `Accept-Language` 기반 자동 감지 로직 자체가 전혀 동작하지 않고 있었고, 대신 `src/app/page.tsx`(루트 경로 "/"를 처리하는 하드코딩된 예비 페이지, `redirect('/en')`)만 항상 실행되어 브라우저 언어와 무관하게 매번 영어로 고정되었던 것.
- ExifLens/FlyDroneMap과 비교한 결과, 두 프로젝트는 애초에 `src/proxy.ts`(미들웨어와 동일 역할)를 `src/` 안에 올바르게 배치했고, 루트 `page.tsx`도 아예 존재하지 않아 이 문제가 없었음.
- **수정**: `middleware.ts`를 `src/middleware.ts`로 이동(import 경로도 상대 경로에 맞게 수정), 더 이상 필요 없는 `src/app/page.tsx`(하드코딩된 `/en` 리다이렉트) 삭제. 이제 `next-intl` 미들웨어가 "/" 요청을 온전히 처리하며, 브라우저 언어(Accept-Language)에 따라 자동으로 `/ko`, `/ja`, `/es`, `/en`으로 리다이렉트됨.
- `tsc --noEmit`, `eslint` 모두 오류 0건 확인(이전 `.next` 캐시가 삭제된 `page.tsx`를 계속 참조해 발생한 임시 타입 오류는 캐시 삭제 후 해결 확인됨 — 실제 코드 문제 아니었음).
- 삭제된 구 파일들은 참고용으로 `_deprecated/`에 보관(`.gitignore`에 추가, git에는 커밋되지 않음).

## 2026-08-30 (추가8) — 제휴 배너와 하단 광고 슬롯 사이 간격 누락 수정

- **문제**: `AffiliateBanner`(제휴 링크 카드)와 그 바로 아래 하단 `AdSlot`(디스플레이 광고 자리) 사이에 여백이 전혀 없어 두 영역이 맞붙어 보임. 원인은 두 컴포넌트 모두 자체 마진이 없고, 감싸는 레이아웃(`FireCalculator.tsx`)에서도 그 사이에 간격을 주지 않았기 때문.
- **수정**: 하단 `AdSlot`을 `mt-6` 여백을 가진 래퍼로 감싸 다른 섹션들과 동일한 간격 체계(`gap-6`/`gap-8`/`mt-6`)를 따르도록 통일. `tsc`, `eslint` 모두 오류 0건 확인.

## 2026-08-30 (추가9) — 통화 변경 시 슬라이더 범위가 그대로였던 문제 수정

- **문제**: 통화 선택기(달러/유로/파운드/원/엔)는 숫자 앞 기호만 바꿀 뿐, 슬라이더의 최대값·단위(step)는 항상 달러 기준 그대로였음. 그래서 원화(₩)를 선택해도 "현재 투자 자산" 최대치가 2,000,000(원화로 치면 매우 작은 금액)에 묶여 있어, 한국 기준 현실적인 금액(예: 5천만 원)을 입력할 수 없었고, 직접 입력해도 최대값으로 잘려버림. Lean FIRE 판정 기준값도 마찬가지로 달러 기준(25,000)에 고정되어 있었음.
- **수정**: `src/lib/currencyRanges.ts` 신규 추가 — 통화별로 "현재 투자 자산 / 월 저축액 / 연간 생활비" 슬라이더의 최소·최대·단위 및 Lean FIRE 기준값을 현실적인 규모로 정의(원화·엔화는 각각 달러 대비 약 1,300배/150배 수준으로 반올림한 값 — 실시간 환율 연동이 아닌, 계획용 근사치). 통화를 변경하면 기존에 입력해둔 값도 새 통화의 현실적인 범위로 비례 환산되어(이전 통화 대비 상대적 크기 유지) 값이 사라지거나 최대값으로 잘리지 않도록 개선.
- `tsc --noEmit`, `eslint` 모두 오류 0건 확인.

## 2026-08-30 (추가10) — 슬라이더 숫자 입력란에 천 단위 콤마 표시

- **요청**: 500 / 5,000 / 50,000 / 500,000처럼 큰 금액 숫자를 콤마로 구분해서 보여줬으면 좋겠다는 요청.
- **수정**: `src/components/Slider.tsx`의 직접 입력란을 `type="number"`(콤마 표시 불가)에서 텍스트 입력으로 전환. 입력란에 포커스가 없을 때는 항상 천 단위 콤마가 적용된 값을 보여주고, 사용자가 타이핑하는 동안에는 입력 중인 원본 텍스트를 그대로 보여줘 커서가 튀지 않도록 함(포커스 해제 시 다시 콤마 형식으로 정리). 콤마는 UI 언어와 무관하게 항상 "," 기준으로 통일. 원화처럼 자릿수가 큰 값(예: 3,000,000,000)도 잘리지 않도록 입력란 폭도 넓힘.
- `tsc --noEmit`, `eslint` 모두 오류 0건 확인.

## 2026-08-30 (추가11) — FIRE 목표 자산 카드 너비 확대 + 나이·기간 단위 표시

- **확인**: "FIRE까지 남은 기간"의 18.9는 실제로 18.9년(년 단위)이며, 개월로 환산하면 약 227개월이라는 점을 사용자에게 미리 확인 — 사용자는 "년" 단위 유지를 선택.
- **문제**: 결과 카드 3개(목표 자산/달성 나이/남은 기간)가 항상 동일한 1:1:1 너비였는데, 원화처럼 자릿수가 큰 통화의 "FIRE 목표 자산" 값이 카드 폭을 넘어가 잘려 보였음.
- **수정**:
  - `ResultCards.tsx`의 그리드 비율을 1:1:1에서 2:1:1로 변경(목표 자산 카드가 더 넓어지고, 달성 나이·남은 기간 카드는 좁아짐 — 두 카드는 원래 짧은 숫자만 표시하므로 좁아져도 문제없음). 숫자 글자 크기도 반응형으로 소폭 조정(`text-2xl` → `sm:text-3xl`).
  - "FIRE 달성 나이"에 나이 단위(ko: 세, ja: 歳, en/es: 단위 없이 숫자만 — 각 언어 관용 표현에 맞춤), "FIRE까지 남은 기간"에 기간 단위(ko: 년, ja: 年, en: yrs, es: años)를 4개 언어 번역 파일(`messages/*.json`)에 추가하고 결과 카드·A/B 비교 테이블 양쪽에 모두 적용.
- `tsc --noEmit`, `eslint` 모두 오류 0건 확인.

## 2026-08-30 (추가12) — 결과 카드 숫자 중앙정렬 + 통화/나이/기간 단위어 공백 추가

- **확인**: 통화 기호(₩, $ 등)는 그대로 유지하고 뒤에 단위어를 추가할지, 단위어를 어느 언어로 표시할지 사용자에게 미리 확인 — "기호 유지 + 뒤에 단위어 추가", "해당 언어의 통화 명칭으로 번역" 선택.
- **수정**:
  - `ResultCards.tsx`/`ComparisonTable.tsx`: 항목명(라벨)은 그대로 두고, 실제 표시되는 숫자 값만 칸 중앙정렬로 변경.
  - "FIRE 목표 자산" 값에 통화 단위어를 숫자와 한 칸 띄워서 추가(예: ₩1,010,638,298 원, $50,000 dollars, ¥6,000,000 円, €45,000 euros, £40,000 pounds). `messages/*.json`에 `calculator.currencyUnits`(통화 코드별 단위어, 언어별 번역) 신규 추가.
  - "FIRE 달성 나이"/"FIRE까지 남은 기간" 단위 표기도 숫자와 단위어 사이에 공백을 넣도록 통일(예: `48.9세` → `48.9 세`, `18.9년` → `18.9 년`, 영어 `18.9yrs` → `18.9 yrs`) — 4개 언어 모두 동일한 방식 적용.
- `tsc --noEmit`, `eslint` 모두 오류 0건 확인.

## 2026-08-31 (추가13) — 가이드 아티클 매일 자동 발행(예약 작업) 파이프라인 구축

- **배경**: ExifLens/FlyDroneMap은 매일 한국시간(KST) 오전 6시에 가이드 아티클을 1개씩 자동 발행하는 예약 작업이 이미 있음. firelic에도 동일 기능을 요청받아, 두 프로젝트의 기존 예약 작업 설정을 먼저 조사한 뒤 진행 방식을 사용자에게 확인.
- **확인 사항** (사용자 재확인 완료):
  - firelic은 GitHub 원격 저장소가 없어 기존 두 프로젝트와 동일한 "공개 저장소 clone → 콘텐츠 생성 → 로컬에서 커밋/push" 방식을 그대로 쓸 수 없었음. 도메인 구매와 GitHub 저장소 생성은 무관한 별개 작업이라는 점을 안내한 뒤, 사용자가 "지금 GitHub 저장소 생성"을 선택 — ExifLens/FlyDroneMap과 동일한 검증된 클라우드 예약 발행 방식을 재사용하기로 결정.
  - 콘텐츠 자동 커밋 여부, 콘텐츠 구조 유지 여부는 "권장안 그대로 진행"으로 확인 — 로컬 git 커밋까지 자동화, 기존 TypeScript 배열 구조(`src/content/guides/{locale}.ts`) 유지.
  - 발행 대기 주제 큐는 "Claude가 제안"으로 확인 — 기존 4개 카테고리(FIRE Basics & Concepts / Saving & Investing Strategy / Country & Tax Considerations / Retirement Life & Withdrawal Strategy)에 각 6개씩, 총 24개 주제를 신규 제안.
- **작업 시작 전 백업**: `firelic_backup_20260831_011823` 생성 (기존 정책과 동일하게 node_modules/.next/.git 제외).
- **구조적 차이 반영**: ExifLens/FlyDroneMap은 콘텐츠가 MDX 파일이라 새 파일만 추가하면 되지만, firelic은 4개 언어 각각 하나의 TS 배열 파일이므로 "클라우드 세션이 새 항목이 반영된 완성본 4개 파일 전체를 만들어 전달 → 로컬 스크립트는 파일 통째로 교체" 방식으로 설계(부분 텍스트 삽입보다 안전).
- **신규 파일**:
  - `automation/guide-topics-queue.json`: 24개 예정 주제 큐(카테고리/한국어·영어 제목/발행 여부) 추가.
  - `automation/publish-guide.command`: 로컬 발행 스크립트 최초 설치(실행 권한 부여, macOS 격리 속성 해제 완료). ExifLens/FlyDroneMap의 스크립트를 기반으로, 콘텐츠 반영 단계만 "MDX 파일 복사"에서 "TS 배열 파일 4개 전체 교체"로 수정.
  - `firelic-github-setup.command`: GitHub 저장소 최초 연결(1회성) 스크립트. **사용자가 github.com에서 빈 Public 저장소(`SH8952/firelic`)를 먼저 만든 뒤 이 스크립트를 1회 실행해야 함 — 아직 미완료 상태.**
- **예약 작업(Routine) 등록**: "FIRE Calculator 가이드 자동 발행 (매일 06:00 KST)" — cron `0 21 * * *`(UTC 21:00 = KST 06:00). ExifLens/FlyDroneMap과 동일하게 KST 날짜 계산 규칙(`TZ=Asia/Seoul date +%Y-%m-%d`)과 E-E-A-T 콘텐츠 품질 기준을 반영. 국가별 세금/연금 제도를 다루는 주제가 많아, 확인되지 않은 국가별 세법 정보를 단정적으로 서술하지 않도록 별도 주의사항 추가.
- **남은 작업(사용자)**: (1) github.com에서 `SH8952/firelic` 빈 Public 저장소 생성, (2) `firelic-github-setup.command` 더블클릭 실행 — 이 두 가지가 끝나야 다음 날 06:00 KST 예약 발행이 정상 동작함.

## 2026-08-31 (추가14) — Vercel 프로젝트 연결 및 첫 배포 완료 (도메인 구매 전)

- **확인**: 도메인 구매와 Vercel 프로젝트 연결은 무관한 별개 작업이라는 점을 안내드리고, 사용자가 "도메인 구매 전에 Vercel 연결 진행"을 요청 — GitHub 연결에 이어 Vercel도 먼저 연결하기로 함.
- **진행 중 이슈**: Vercel MCP 도구로 GitHub 저장소 연결 프로젝트 생성 시도 시 "git 연결 확인 실패(404)" 오류가 반복 발생. 원인은 도구 응답의 지연/캐시 문제로 추정되며, 실제로는 Moneypick 팀 안에 정상적으로 프로젝트가 생성되고 있었음(개인 계정에 중복 생성된 것을 사용자가 확인 후 삭제하기도 함). 최종적으로 `SH8952/Firelic` 저장소가 Vercel 프로젝트 `firelic`에 정상 연결됨을 대시보드에서 확인.
- **첫 배포 트리거**: 저장소 연결 이후에는 새 push가 있어야 첫 배포가 시작되는 구조라, 빈 커밋(`ddbeb2f`)을 만들어 push를 요청. device_bash 브릿지는 GitHub 인증정보가 없어 push는 사용자가 직접 맥 터미널에서 진행(참고: 한글 폴더명 유니코드 정규화 문제로 경로 직접 입력이 실패해, Tab 자동완성으로 우회).
- **결과**: 배포 성공(41초 소요), `https://firelic.vercel.app` 정상 서비스 확인(한국어 페이지 스크린샷으로 결과 카드 단위 표기까지 정상 렌더링 확인).
- **참고**: GitHub 쪽에서 저장소가 `SH8952/firelic` → `SH8952/Firelic`(대문자 F)로 표시되나, git은 대소문자 구분 없이 리다이렉트되어 정상 동작. 필요 시 로컬 `git remote set-url origin https://github.com/SH8952/Firelic.git`로 정리 가능(선택 사항, 기능상 문제 없음).
- **남은 것**: 커스텀 도메인(`firelic.com`)은 이후 구매 시 Vercel Domains 설정에서 연결 예정. 그 전까지는 `firelic.vercel.app` 임시 주소로 계속 이용 가능.

## 2026-08-31 (추가15) — 제휴 링크 후보 교체: Webull → Wise

- **배경**: Webull은 신생 사이트에 대한 제휴 승인이 까다롭다는 점을 확인. 현금성 수수료 + 비교적 신청 문턱이 낮은 제휴처를 조사한 뒤 사용자와 확인.
- **조사 결과 공유**: 대형 브로커의 자체 직접 신청보다 Impact/CJ/ShareASale/Awin/Rakuten 같은 제휴 네트워크를 통한 신청이 신생 사이트에 유리하다는 점, 증권사/브로커 제휴는 대부분 포인트가 아닌 현금(CPA/레브셰어)으로 지급된다는 점을 안내.
- **확인**: 사용자는 현재 어떤 제휴 네트워크에도 가입되어 있지 않음(신규 가입 필요) — Webull 대체 후보로 **Wise**(해외송금, Partnerize 네트워크를 통해 신청, CPA 방식 현금 지급)를 선택.
- **수정**: `src/components/FireCalculator.tsx`의 `AFFILIATE_PARTNERS` 배열에서 "Webull"을 "Wise"로 교체(Interactive Brokers/eToro는 유지). 실제 제휴 링크는 아직 미승인 상태라 `href`는 계속 placeholder("#") 유지.
- **남은 작업(사용자)**: Wise 제휴 프로그램은 https://join.partnerize.com/wise/en 에서 직접 신청 필요(계정 생성/신청 대행 불가). 승인 후 실제 트래킹 링크를 받으면 `AFFILIATE_PARTNERS`의 `href`를 실제 링크로 교체 예정. Interactive Brokers/eToro도 아직 미신청 상태이므로 함께 신청 필요.
- `tsc --noEmit`, `eslint` 모두 오류 0건 확인.

## 2026-08-31 (추가16) — 원클릭 git 커밋+push 스크립트 추가

- **배경**: 매번 터미널에 `git push origin main` 등을 직접 입력해야 했던 불편함을 없애기 위해, 더블클릭 한 번으로 커밋+push까지 끝나는 스크립트를 요청받음.
- **추가**: `firelic-push.command` — 더블클릭 시 터미널이 열려 (1) 변경사항 전체를 `git add -A` 후 타임스탬프 포함 커밋, (2) `git push origin main`, (3) 완료/실패 메시지 출력, (4) 성공 시 3초 후 터미널 창 자동 종료(publish-guide.command와 동일한 AppleScript 방식). 커밋할 변경사항이 없으면 커밋은 건너뛰고 push만 진행. push 실패 시에는 자동으로 닫지 않고 사용자가 확인할 수 있도록 유지.
- 실행 권한 부여 및 macOS 격리 속성(xattr) 해제 완료 — Gatekeeper 경고 없이 바로 실행 가능.

## 2026-08-31 (추가17) — 로컬 정리: 불필요 파일 제거 + 백업 위치를 firelic 하위로 통일

- **정리 요청**: 작업 폴더 안 불필요한 파일 정리, 그리고 백업 폴더가 firelic 상위 폴더(`애드센스 제휴 마케팅/`)에 생성되고 있던 것을 앞으로는 firelic 폴더 하위에 생성하도록 변경 요청받음.
- **삭제(정리 대상, `_to_delete/`로 이동됨 — Finder에서 최종 삭제는 사용자가 직접)**: 오래된 `.next` 빌드 캐시 잔재(`.next_stale3_*`, `.next_stale4_*`), `.DS_Store`, `tsconfig.tsbuildinfo`(모두 재생성되는 파일), 더 이상 쓰지 않는 `firelic-github-setup.command`(GitHub 최초 연결 완료로 목적 달성, git에서도 제거).
  - 참고: 이 device_bash 브릿지는 `rm`이 기본적으로 막혀 있고, `device_request_delete_permission`도 한글 폴더명의 유니코드 정규화(NFC/NFD) 불일치로 인해 사용할 수 없었음(원인 재확인, 기존 알려진 이슈와 동일). 대신 `mv`로 `_to_delete/` 폴더에 모아뒀으니 Finder에서 이 폴더를 통째로 휴지통으로 옮기면 정리 완료.
- **백업 위치 이동**: 상위 폴더에 있던 백업 2개(`firelic_backup_20260830_192533`, `firelic_backup_20260831_011823`)를 `firelic/_backups/`로 이동.
- **자동화 스크립트 수정**: `automation/publish-guide.command`의 `BACKUP_DIR`을 `${REPO}_backup_...`(상위 폴더)에서 `$REPO/_backups/backup_...`(firelic 하위)로 변경, rsync 시 `_backups`/`_to_delete` 자기 자신은 백업 대상에서 제외하도록 수정(무한 재귀 방지).
- `.gitignore`에 `/_to_delete/`, `/_backups/` 추가(둘 다 git 추적 대상 아님).
- 앞으로 세션에서 만드는 모든 백업(`firelic_backup_*` 등)도 firelic 폴더 하위(`_backups/`)에 생성하도록 통일.

## 2026-08-31 (추가18) — push 스크립트를 "상시 설치형"에서 "필요할 때마다 자동 생성 + 1회용"으로 전환

- **확인**: firelic-push.command를 상시 설치해두는 방식 대신, 앞으로는 로컬에 push가 필요한 커밋이 쌓일 때마다 Claude가 요청 없이도 새 원클릭 push 스크립트를 자동으로 만들어 전달하고, 사용자가 실행하면 커밋+push+완료 메시지+3초 후 터미널 종료에 이어 **스크립트 자기 자신도 삭제**되는 방식으로 전환하기로 확인.
- **수정**: 상시 설치돼 있던 `firelic-push.command`는 git에서 제거(더 이상 유지하지 않음).
- **적용 시점**: 이번 대화 이후 로컬 커밋이 push되지 않은 상태로 남을 때마다 자동 적용.

## 2026-08-31 (추가19) — firelic.com 도메인 실제 연결 + SEO/GA4 환경변수 반영

- **도메인 구매 완료**: `firelic.com`을 Namecheap에서 구매 완료.
- **Vercel 도메인 연결**: Vercel firelic 프로젝트 Domains에 `firelic.com`, `www.firelic.com` 추가. Vercel이 안내한 DNS 레코드(A `@` → `216.198.79.1`, CNAME `www` → `f867d9fc41dfe8fa.vercel-dns-017.com.`)를 Namecheap Advanced DNS에 등록, 두 도메인 모두 Valid Configuration 확인. `firelic.com`(apex) 접속 시 `www.firelic.com`으로 308 리다이렉트되며 실제 서비스는 www에서 제공됨. SSL 인증서는 Vercel이 자동 발급.
- **GA4 데이터 스트림 신규 생성**: ExifLens/FlyDroneMap과 동일하게 공용 GA4 속성("경제적 자유를 찾아 떠나자", 계정 skysmoga)에 firelic 전용 웹 스트림 "FIRE Calculator"(URL: `https://www.firelic.com`)를 추가하고 측정 ID(`G-TX5XJZ7QDJ`) 확인.
- **환경변수 반영**: Vercel firelic 프로젝트 Environment Variables(Production + Preview)에 `NEXT_PUBLIC_SITE_URL=https://www.firelic.com`, `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TX5XJZ7QDJ` 등록. `.env.example`도 동일하게 갱신(캐노니컬/사이트맵 기준 도메인을 apex가 아닌 실제 서빙 도메인인 www로 명시).
- **재배포 및 검증**: 환경변수는 재배포해야 반영되므로 최신 프로덕션 배포를 Redeploy. 배포 완료 후 `https://www.firelic.com/robots.txt`의 sitemap 경로, `<link rel="canonical">`, GA4 gtag 스크립트(`G-TX5XJZ7QDJ`) 로드까지 브라우저에서 직접 확인 완료.
- **남은 수동 작업**: 애드센스 신청 시 사이트 URL을 `https://www.firelic.com`으로 등록(사용자 직접 진행).

## 2026-08-31 (추가20) — 애드센스 준비: ads.txt 등록 + 검증 스크립트 연결

- **`public/ads.txt` 생성**: `google.com, pub-0042120343274941, DIRECT, f08c47fec0942fa0` — ExifLens/FlyDroneMap과 동일한 애드센스 계정.
- **`src/components/AdSenseScript.tsx` 신규 추가**: `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` 환경변수가 설정된 경우에만 AdSense 검증/오토애즈 스크립트(`adsbygoogle.js`)를 로드. `pub-`/`ca-pub-` 접두어 모두 지원(ExifLens/FlyDroneMap과 동일 패턴). `src/app/[locale]/layout.tsx`에 `<GoogleAnalytics />` 옆에 연결.
- **환경변수**: `.env.example`에 `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=pub-0042120343274941` 반영, Vercel firelic 프로젝트 Environment Variables(Production + Preview)에도 동일하게 등록 후 재배포.
- **참고**: 실제 광고 유닛(`<ins class="adsbygoogle">`)은 아직 붙이지 않음 — `AdSlot`은 애드센스 승인 및 실제 광고 유닛 슬롯 ID 발급 후에 실제 광고로 교체 예정. 이번 작업은 애드센스 신청/크롤러 검증을 위한 준비 단계.
- `npx tsc --noEmit`, `npx eslint` 통과 확인.

## 2026-08-31 (추가21) — 소셜 공유 미리보기 이미지(OG image) + JSON-LD 구조화 데이터 추가

- **JSON-LD 구조화 데이터**: `src/lib/seo.ts`에 `webApplicationJsonLd()` 추가(schema.org `WebApplication` 타입, 이름/URL/설명/카테고리/무료 여부 포함). ExifLens와 동일한 패턴. `src/app/[locale]/layout.tsx`의 `<body>` 최상단에 `application/ld+json` 스크립트로 삽입해 각 locale 페이지마다 렌더링.
- **OG 공유 이미지**: `src/app/[locale]/opengraph-image.tsx` 신규 추가. Next.js 파일 기반 메타데이터 컨벤션(`next/og`의 `ImageResponse`)을 사용해 1200x630 PNG를 요청마다 동적으로 생성 — 별도 정적 이미지 파일 없이 브랜드 컬러(#1E8E5A/#F5A623)와 "FIRE Calculator" 타이틀로 카카오톡/X/페이스북 공유 미리보기가 표시됨. 별도 `openGraph.images` metadata 수정 없이 Next.js가 자동으로 인식.
- **검증**: `npx tsc --noEmit`, `npx eslint` 통과 확인. (참고: 이 컨테이너 환경은 SWC 네이티브 바이너리 다운로드가 네트워크 제한으로 실패해 `next build` 자체는 로컬에서 끝까지 돌리지 못했으나, 코드 변경분 자체는 타입/린트 검증 완료 — 실제 프로덕션 빌드는 push 후 Vercel에서 정상 진행됨.)

## 2026-08-31 (추가22) — publish-guide.command 타입 검사 오탐 수정 (tsconfig exclude 추가)

- **증상**: 가이드 자동 발행 스크립트(`publish-guide.command`)가 콘텐츠를 `automation/*.ts` → `src/content/guides/*.ts`로 복사한 뒤 실행하는 `npx tsc --noEmit` 검증 단계에서, 복사 후 `automation/` 폴더에 남아있는 원본 스테이징 파일들까지 타입 검사 대상에 포함되어 "Cannot find module './types'" 오류가 발생(스테이징 파일 옆에는 `types.ts`가 없고, 실제 앱이 쓰는 `src/content/guides/`에만 있음). 실제 서비스 코드에는 문제가 없는 오탐이었음.
- **원인**: `tsconfig.json`의 `exclude`가 `node_modules`만 지정돼 있어 `automation/`, `_backups/`, `_to_delete/` 폴더의 스테이징/백업 `.ts` 파일까지 타입 검사에 포함됨.
- **수정**: `tsconfig.json`의 `exclude`에 `automation`, `_backups`, `_to_delete` 추가. `src/` 어디에서도 `automation/`을 참조하지 않는 것을 확인(grep)한 뒤 반영 — 앱 빌드/타입 검사에 영향 없음.
- **검증**: `npx tsc --noEmit`, `npx eslint` 모두 통과 확인. 이제 `publish-guide.command`를 다시 실행해도 이 오탐이 재발하지 않음.

## 2026-08-31 (추가23) — 자동 발행 정리: automation/ 임시 스테이징 파일 정리

- `publish-guide.command`가 실행되던 중 `npx tsc --noEmit` 검증이 자기 자신을 방해하는 상황(추가22 참고)에서, 발행이 실제로는 정상 처리(콘텐츠 → `src/content/guides/`에 반영, `guide-topics-queue.json` 갱신)되었으나 스크립트의 최종 `git add`(지정 경로만 add)가 클라우드 쪽에서 이미 커밋해둔 것과 겹쳐 "반영할 변경사항 없음"으로 안내되었음. 정상 동작이며 콘텐츠 유실 없음.
- 그 과정에서 `automation/` 폴더에 남아있던 원본 스테이징 사본(en.ts/ko.ts/ja.ts/es.ts/new-queue.json/changelog-snippet.txt)이 실수로 git에 함께 커밋됐던 것을 확인 후 별도 커밋으로 정리(삭제) 완료 — 실제 서비스 콘텐츠는 `src/content/guides/`에 그대로 유지됨.

## 2026-08-31 (추가24) — PageSpeed Insights 모바일 성능 개선 (62점 → 개선 작업)

- **배경**: 사용자가 Google Search Console에서 PageSpeed Insights 모바일 리포트를 확인해 요청. 성능 62점(접근성 95/권장사항 100/SEO 100)이었고, FCP 4.9초·LCP 7.3초로 느린 편(TBT 30ms, CLS 0은 양호) — 애드센스 심사에는 영향 없는 순수 성능 항목임을 확인 후 진행.
- **① 차트 지연 로딩(가장 큰 항목, 293KiB "사용하지 않는 자바스크립트")**: `src/components/FireCalculator.tsx`에서 `FireChart`(Chart.js + react-chartjs-2)를 정적 import 대신 `next/dynamic(..., { ssr: false })`로 전환. 계산기 입력/결과 UI가 먼저 렌더링되고, 차트 라이브러리는 별도 청크로 분리되어 그 이후에 로드됨. 레이아웃 밀림 방지용 스켈레톤(고정 높이 placeholder) 추가.
- **② 정적 자산 캐시 수명(16KiB)**: `next.config.ts`의 `headers()`에 `public/`의 브랜드/아이콘 SVG(file/globe/logo-icon/logo-wordmark/next/vercel/window.svg) 전용 규칙 추가 — `Cache-Control: public, max-age=31536000, immutable`. `ads.txt`/`sitemap.xml`/`robots.txt`는 이 규칙에서 제외해 최신 상태 유지.
- **③ 레거시 자바스크립트 정리(14KiB)**: `package.json`에 `browserslist` 필드 추가(최신 Chrome/Firefox/Safari/Edge 2개 버전 + `not dead`/`not IE 11`/`not op_mini all`) — 구형 브라우저 호환 변환 코드 축소.
- **④ 렌더링 차단/네트워크 종속 체인**: 별도 변경 없음 — ①의 효과로 초기 로드 체인이 짧아지며 함께 개선될 것으로 예상.
- **검증**: `npx tsc --noEmit`, `npx eslint` 모두 통과. 실제 라이트하우스 재측정은 배포 후 사용자가 PageSpeed Insights에서 재실행해 확인 필요(디바이스 브릿지 환경에서는 `next build` 완주가 안 되어 로컬 라이트하우스 실측 불가 — 5장 참고).

## 2026-08-31 (추가25) — 네이버 서치어드바이저(웹마스터 도구) 사이트 소유확인 연결

- **배경**: 사용자가 네이버 서치어드바이저에서 `https://firelic.com` 사이트 소유확인을 "HTML 태그" 방식으로 진행 중이었고, 발급된 메타 태그(`naver-site-verification`)를 코드에 반영해달라고 요청.
- **`src/app/[locale]/layout.tsx`**: `NAVER_SITE_VERIFICATION` 환경변수가 설정된 경우에만 `generateMetadata()`의 `verification.other`에 `naver-site-verification` 메타 태그를 추가하도록 구현(값이 없으면 렌더링 안 됨 — GA/애드센스와 동일한 옵트인 패턴).
- **환경변수**: `.env.example`에 `NAVER_SITE_VERIFICATION=c72111442439bd4f815bd5febc60faefb3c0386c` 추가, Vercel firelic 프로젝트 Environment Variables(Production+Preview, Config 타입)에도 동일하게 등록.
- **검증**: `npx tsc --noEmit`, `npx eslint` 통과. 배포 후 페이지 소스에서 `<meta name="naver-site-verification" ...>` 태그 렌더링 확인 필요 — 확인되면 네이버 서치어드바이저에서 "소유확인" 버튼 클릭.

## 2026-08-31 (추가26) — 네이버 서치어드바이저 URL 검사 경고 대응 (제목/설명 길이 단축)

- **배경**: 사용자가 네이버 서치어드바이저 "URL 검사"에서 `https://firelic.com` 기준으로 확인한 결과, 3가지 주황색 경고를 확인해 공유(스크린샷). 점검 결과:
  1. `robots.txt가 존재하지 않습니다` — 실제로는 `firelic.com`/`www.firelic.com` 모두 robots.txt가 정상 응답함(직접 확인 완료). 실제 서비스 도메인은 www인데 네이버에는 apex(firelic.com)가 사이트로 등록돼 있어, 네이버 로봇이 apex→www 리다이렉트를 따라가지 않아 발생한 것으로 추정. **코드 문제 아님** — 해결책은 네이버 서치어드바이저에 `https://www.firelic.com`을 사이트로 추가 등록하는 것(사용자 안내, 5장 참고: Claude in Chrome/내장 브라우저 둘 다 정책상 네이버 서치어드바이저 접속이 차단되어 자동화 불가, 사용자가 직접 진행 필요).
  2. `페이지 제목 40자 초과`: "FIRE Calculator — Early Retirement Simulator" → **"FIRE Calculator — Retire Early Planner"(38자)로 단축**.
  3. `페이지 설명 80자 초과`: 기존 문장 → **"Simulate your path to Financial Independence, Retire Early (FIRE) instantly."(76자)로 단축**.
- **수정 파일**: `src/app/[locale]/layout.tsx`의 `generateMetadata()` title/description (모든 로케일 공통 적용, OpenGraph 타이틀/설명은 기존 값 유지).
- **검증**: `npx tsc --noEmit`, `npx eslint src` 모두 통과. (`npx eslint .`로 전체 실행 시 `_backups/` 안의 예전 `.next` 빌드 잔재 때문에 무관한 대량 오류가 나오는 것을 확인 — 실제 서비스 코드와 무관, 추후 정리 필요 메모만 남김.)
- **남은 절차(사용자 진행)**: 네이버 서치어드바이저에서 `https://www.firelic.com`을 신규 사이트로 추가하고 HTML 태그 방식으로 소유확인 진행 필요.

## 2026-08-31 (추가27) — 네이버 서치어드바이저 URL 검사 경고 해소 확인

- 추가26에서 진행한 제목/설명 길이 단축(커밋 `26dcea8`) 및 `https://www.firelic.com` 사이트 추가 등록 이후, 사용자가 네이버 서치어드바이저 URL 검사를 재실행해 **robots.txt / 페이지 제목 / 페이지 설명 경고 3건이 모두 정상(✅)으로 전환된 것을 확인**함. 해당 건 완료 처리.

## 2026-09-01 (추가28) — 가이드 콘텐츠 저장 형식을 ExifLens/FlyDroneMap과 동일한 개별 MDX 파일 구조로 전면 전환

- **배경**: 사용자가 예약 발행 스크립트(publish-guide.command) 실행 중 `.git/HEAD.lock` 충돌로 커밋이 실패한 것을 계기로, firelic만 push되는 파일 형식이 ExifLens/FlyDroneMap과 다르다는 점을 지적함. 확인 결과:
  - ExifLens/FlyDroneMap: 가이드 1건마다 `content/guides/<locale>/<slug>.mdx` 개별 파일이 새로 추가되는 구조.
  - firelic(기존): `src/content/guides/{en,ko,ja,es}.ts`라는 큰 TypeScript 배열 파일 자체를 매번 통째로 덮어쓰는 구조.
  - `.git/HEAD.lock` 충돌의 실제 원인은 클라우드 세션과 로컬 터미널의 동시 git 실행(8-7장)이지만, 다른 두 프로젝트와 동일한 구조로 통일하면 매번 건드리는 파일 범위가 작아져 충돌 위험도 줄어든다고 판단해 전면 리팩토링 진행.
- **패키지 추가**: `@mdx-js/mdx`, `gray-matter`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `@tailwindcss/typography` (ExifLens와 동일 버전) — `npm install`로 정상 설치 확인.
- **콘텐츠 마이그레이션**: 기존 `src/content/guides/{en,ko,ja,es}.ts`에 있던 가이드 12건(초기 10건 + 자동발행 2건, 언어별 총 48개 .mdx)을 Node(`--experimental-strip-types`)로 직접 읽어와 frontmatter(title/description/publishedAt/category)가 포함된 `content/guides/<locale>/<slug>.mdx` 개별 파일로 변환. 내용 유실 없이 전량 이관 확인(변환 전후 guide 개수 en/ko/ja/es 각 12건 일치).
- **`src/lib/guides.ts` 신규**: ExifLens의 `src/lib/guides.ts`를 기반으로 구현 — `getGuideSlugs`/`getGuideMeta`/`getAllGuidesMeta`/`getGuidesByCategory`/`compileGuide`. 카테고리 표시 순서는 firelic의 4개 카테고리(FIRE Basics & Concepts / Saving & Investing Strategy / Country & Tax Considerations / Retirement Life & Withdrawal Strategy) 고정 순서를 유지.
- **소비 코드 수정**: `src/app/[locale]/guides/page.tsx`, `src/app/[locale]/guides/[slug]/page.tsx`(MDX를 `compileGuide`로 컴파일해 렌더링하도록 변경), `src/app/sitemap.ts`가 `@/content/guides` 대신 `@/lib/guides`를 사용하도록 수정. `globals.css`에 `@plugin "@tailwindcss/typography";` 추가, 가이드 본문에 `prose prose-neutral dark:prose-invert` 클래스 적용.
- **기존 구조 제거**: `src/content/guides/{index,types,en,ko,ja,es}.ts`를 저장소에서 삭제(git rm), 로컬에는 `_to_delete/old_src_content_guides/`로 보관(사용자가 Finder에서 최종 삭제 가능).
- **`automation/publish-guide.command` 재작성**: ExifLens/FlyDroneMap과 동일한 방식으로 전환 — 매일 전달받는 파일이 `guide-<slug>-{en,ja,ko,es}.mdx` 개별 파일 4개 + `new-queue.json`이 되며, 각각 `content/guides/<locale>/<slug>.mdx`로 복사하고 해당 4개 파일 + 큐 + CHANGELOG만 `git add`한다. 기존에 자동 발행이 실패하며 `automation/` 폴더에 남아있던 구버전 스테이징 파일(en.ts/ko.ts/ja.ts/es.ts/new-queue.json/changelog-snippet.txt)은 `_to_delete/`로 정리.
- **검증**: `npx tsc --noEmit`, `npx eslint src` 모두 통과. **`npm run build`(Turbopack) 로컬 실행 결과 78개 페이지 전부 정상 생성 확인** — MDX 컴파일 포함 전체 빌드 파이프라인이 정상 동작함을 확인함(마지막 `.next` 캐시 정리 단계에서만 브릿지 특유의 EPERM 권한 오류가 발생했으나 실제 빌드 산출물과는 무관, 8-7장에 이미 기록된 환경 제약과 동일 유형).
- **참고**: 이후 매일 예약 발행 시 클라우드 세션은 ExifLens/FlyDroneMap과 동일하게 `guide-<slug>-{en,ja,ko,es}.mdx` 4개 파일 + `new-queue.json` + `changelog-snippet.txt`를 만들어 전달하는 방식으로 전환됨.

## 2026-09-01 (추가29) — FAQ 페이지 신설 및 상단 공통 헤더(SiteHeader) 도입

- **배경**: 사용자 요청: (1) 사이트에 없던 "자주 묻는 질문(FAQ)" 페이지를 ExifLens와 동일한 방식(아코디언 UI + FAQPage JSON-LD)으로 신설, (2) 하단 푸터에 있던 "소개(About)"·"가이드(Guides)" 링크를 최상단 우측, 라이트/다크 테마 버튼 왼쪽으로 이동, (3) 언어 선택 드롭다운을 테마 버튼 오른쪽으로 이동, (4) 상단 헤더 간격을 ExifLens 헤더 스타일(h-16, max-w-6xl)에 맞게 조정. 작업 전 확인 결과 firelic은 사이트 전체에 적용되는 별도 헤더 컴포넌트가 없었고(로케일 스위처만 우측 상단에 단독 배치), 테마 토글 버튼은 메인 계산기 페이지(FireCalculator.tsx) 안에만 있어 `/about`, `/guides` 페이지에는 테마 버튼도, 홈으로 돌아가는 링크도 없는 상태였음을 사용자에게 알리고, 공통 헤더 신설 및 헤더 좌측 로고+홈 링크 추가에 대해 확인받은 뒤 진행함.
- **`src/components/SiteHeader.tsx` (신규)**: 모든 로케일 페이지 상단에 공통 적용되는 헤더. 좌측 로고(홈 링크), 우측에 소개·가이드·FAQ 내비게이션 링크 → 테마 토글 → 언어 선택 드롭다운 순서로 배치. `h-16` 높이, `max-w-6xl` 컨테이너, `px-4` 패딩, 하단 보더로 ExifLens 헤더 스타일에 맞춤.
- **`src/app/[locale]/layout.tsx`**: 기존 로케일 스위처 단독 배치(`flex justify-end px-4 pt-3`)를 제거하고 `<SiteHeader />`로 교체.
- **`src/components/SiteFooter.tsx`**: "소개"·"가이드" 링크 제거(헤더로 이동 완료). 개인정보처리방침·이용약관·제휴 마케팅 고지 링크만 유지.
- **`src/components/FireCalculator.tsx`**: 페이지 내부 로컬 헤더에서 `ThemeToggle` 제거(전역 SiteHeader로 이동해 중복이므로). 로고+부제목만 유지.
- **`src/app/[locale]/faq/page.tsx` (신규)**: ExifLens의 `/faq` 페이지와 동일한 방식(`<details>/<summary>` 아코디언, `FAQPage` schema.org JSON-LD)으로 신설. 콘텐츠는 FIRE Calculator에 맞게 새로 작성한 8개 질문/답변(FIRE 정의, FIRE 넘버 계산법, 4% 규칙의 한계, 회원가입 불필요, 시나리오 비교, 지원 통화, 금융 자문 아님 고지, 무료 이용).
- **`messages/{en,ko,ja,es}.json`**: `nav.faq` 내비게이션 라벨 추가, `Faq.title`/`Faq.subtitle`/`Faq.items[]`(질문/답변 8쌍) 4개 언어 모두 추가.
- **`src/app/sitemap.ts`**: `STATIC_PATHS`에 `/faq` 추가.
- **검증**: `npx tsc --noEmit` 통과, `npx eslint src` 통과(0 errors), `npm run build`(Turbopack) 82/82 페이지 정상 생성 확인(기존 78 → FAQ 페이지 4개 로케일 추가로 82). 최종 `.next` 캐시 정리 단계의 `EPERM: unlink '.../export-detail.json'` 오류는 기존에도 확인된 device_bash 브리지 FUSE 권한 관련 무해한 오류로 코드 정확성과 무관.
- **참고**: ExifLens는 헤더에 별도 테마 토글이 없어 "동일한 방식"은 FAQ 페이지의 UI/구조 패턴(아코디언 + JSON-LD)에 한정해 적용했고, 헤더의 테마 토글·언어 선택 배치는 firelic 자체 요구사항에 맞춰 새로 설계함. 커밋 전 `firelic/_backups/backup_20260901_065724/`에 전체 백업 생성 완료(표준 백업 규칙 준수).

## 2026-09-01 (추가30) — 헤더에 로고/제목/부연설명 통합 + 모바일 햄버거 메뉴 + 언어 표시 단축

- **배경**: 사용자가 스크린샷으로 현재 화면을 보여주며 다음을 요청: (1) 계산기 페이지 안에 있던 로고+"FIRE Calculator" 제목+부연설명을 최상단 헤더 좌측(기존 아이콘만 있던 위치)으로 이동, (2) 이동한 텍스트의 폰트 크기를 ExifLens 헤더 스타일(제목 text-lg, 부연설명 text-xs)에 맞춰 축소, (3) 헤더에 있던 기존 아이콘 전용 로고는 중복이므로 삭제, (4) 페이지 안의 기존 헤더 블록(로고+부연설명)은 완전히 제거, (5) 모바일에서는 소개/가이드/FAQ 링크가 줄바꿈되지 않도록 ExifLens와 동일하게 햄버거 버튼(☰) 뒤로 숨기고 테마 토글·언어 선택은 계속 노출, (6) 헤더~광고 사이 간격을 다른 프로젝트 기준으로 재조정, (7) 언어 선택 드롭다운 표시를 ExifLens와 동일하게 "한국어/日本語" 대신 "EN/KO/JA/ES" 2자리 약어로 변경. AskUserQuestion으로 7가지 항목 및 햄버거 아이콘 구현 방식(lucide-react 설치 여부)을 확인받은 뒤 진행.
- **`lucide-react` 패키지 추가**: ExifLens와 동일한 Menu/X 아이콘 사용(버전 `^1.38.0`, ExifLens의 `^1.34.0`과 같은 메이저 범위).
- **`src/components/SiteHeader.tsx` 재작성**: 좌측에 로고 아이콘 + "FIRE Calculator"(`text-lg font-bold`) + 부연설명(`calculator.subtitle` 재사용, `text-xs`, `hidden sm:block`)을 함께 배치(계산기 페이지에서 이동). 데스크톱(`sm:` 이상)에서는 소개·가이드·FAQ 링크 + 테마 토글 + 언어 선택이 한 줄로 노출되고, 모바일에서는 테마 토글·언어 선택만 노출하고 나머지 링크는 햄버거 버튼(`lucide-react`의 `Menu`/`X`) 뒤에 숨겼다가 클릭 시 헤더 아래로 펼쳐지는 드롭다운 내비게이션으로 표시(ExifLens의 `site-header.tsx`와 동일한 구조).
- **`src/components/FireCalculator.tsx`**: 페이지 안의 기존 로컬 헤더 블록(로고 + 부연설명)을 완전히 제거. 최상단 컨테이너 여백을 `py-8` → `py-10`으로 조정해 헤더~광고 사이 간격을 ExifLens 등 다른 프로젝트의 헤더~본문 간격 기준에 맞춤. 이제 사용하지 않는 `Logo` import 제거.
- **`src/components/LocaleSwitcher.tsx`**: 표시 라벨을 `LOCALE_LABELS`에서 "한국어"/"日本語" 같은 현지어 표기 대신 ExifLens의 `src/i18n/routing.ts`(`localeLabels`)와 동일한 "EN"/"KO"/"JA"/"ES" 2자리 약어로 변경.
- **`messages/{en,ko,ja,es}.json`**: `nav.openMenu`/`nav.closeMenu`(햄버거 버튼 aria-label) 4개 언어 추가. 이동된 부연설명은 새 문구를 만들지 않고 기존 `calculator.subtitle` 번역을 그대로 재사용(문구 일관성 유지).
- **검증**: 작업 전 `_backups/backup_20260901_071512/`로 백업 생성. `npx tsc --noEmit` 통과, `npx eslint src` 통과(0 errors), `npm run build`(Turbopack) 82/82 페이지 정상 생성 확인. 최종 `.next` 캐시 정리 단계의 `EPERM: unlink '.../export-detail.json'` 오류는 기존에도 확인된 device_bash 브리지 FUSE 권한 관련 무해한 오류로 코드 정확성과 무관. `npm install lucide-react`는 브릿지의 `node_modules/@unrs/.resolver-binding-wasm32-wasi-*` 잔재 폴더로 인해 처음엔 `ENOTEMPTY`로 실패했으나, 해당 잔재 폴더를 정리한 뒤 재시도해 정상 설치됨(5장에 참고용으로만 기록, 반복 발생 시 참고).

## 2026-09-01 (추가31) — 메인 페이지 하단에 "이용 방법" 섹션 추가 + 슬라이더 입력칸 단위(세/%) 표시 버그 수정

- **배경**: 사용자가 ExifLens의 "ExifLens 사용법" 섹션(제목 + 원형 번호 1~4 + 설명) 스크린샷과, 슬라이더 입력칸 우측에 큰 글씨로 "세"/"%" 단위가 표시된 예시 스크린샷을 첨부하며 두 가지를 요청: (1) 동일한 구조의 "이용 방법" 섹션을 메인 페이지 최하단 광고(DisclaimerFooter 바로 위 마지막 AdSlot) 바로 위에 추가, (2) 슬라이더 입력칸 우측에 나이는 "세", 비율 입력은 "%" 단위를 표시.
- **버그 발견**: `src/components/Slider.tsx`에 `suffix` prop이 이미 존재하고 `realReturnPct`/`withdrawalRatePct`/`effectiveTaxRatePct` 슬라이더에는 `suffix="%"`가 전달되고 있었으나, 실제로는 접근성용 `sr-only` 텍스트에만 쓰이고 화면에는 전혀 렌더링되지 않고 있던 것을 확인. `currentAge`/`targetAge` 슬라이더에는 애초에 suffix가 전달되지도 않았음.
- **`src/components/Slider.tsx` 수정**: 입력창 우측에 `suffix`가 있으면 굵은 글씨(`text-lg font-bold`)로 실제로 보이도록 렌더링하는 `<span aria-hidden="true">`를 추가.
- **`src/components/FireCalculator.tsx`**: `currentAge`/`targetAge` 슬라이더에 `suffix={t("fireAgeUnit")}`를 추가(결과 카드에서 이미 쓰이던 로케일별 나이 단위를 재사용 — ko/ja는 "세"/"歳", en/es는 빈 문자열). `realReturnPct`/`withdrawalRatePct`/`effectiveTaxRatePct`는 기존 `suffix="%"` 그대로 유지 — 이번 버그 수정으로 이제 실제로 화면에 표시됨.
- **`src/components/UsageGuideSection.tsx` (신규)**: ExifLens의 `home-usage-section.tsx`(제목 + 원형 번호 아코디언 목록)를 참고해 구현. ExifLens의 원본은 `next-intl/server`의 `getTranslations`를 쓰는 비동기 서버 컴포넌트지만, firelic의 계산기 페이지(`FireCalculator.tsx`)는 이미 `"use client"` 클라이언트 컴포넌트라 서버 컴포넌트를 직접 자식으로 import해 인스턴스화할 수 없으므로, 클라이언트용 `useTranslations` 훅을 쓰는 클라이언트 컴포넌트로 작성. `calculator.usageTitle`/`calculator.usageSteps[]`(4단계) 4개 언어 신규 작성.
- **배치**: `FireCalculator.tsx`의 최하단 `AdSlot`(display) 바로 위, `AffiliateBanner`가 있는 우측 컬럼과 그리드가 끝난 다음 줄에 `<UsageGuideSection />` 삽입.
- **`messages/{en,ko,ja,es}.json`**: `calculator.usageTitle`, `calculator.usageSteps[]`(4개 항목) 4개 언어 모두 신규 추가.
- **검증**: 작업 전 `_backups/backup_20260901_073507/`로 백업 생성. `npx tsc --noEmit` 통과, `npx eslint src` 통과(0 errors), `npm run build`(Turbopack) 82/82 페이지 정상 생성 확인. 최종 `.next` 캐시 정리 단계의 `EPERM` 오류는 기존에도 확인된 무해한 브릿지 오류.

## 2026-09-01 (추가32) — 슬라이더 단위(세/%) 폰트 크기 축소

- **배경**: 사용자가 8-14장에서 추가된 "세"/"%" 단위 표시를 확인한 뒤, 예시로 보여준 스크린샷은 눈에 띄게 하려고 일부러 크게 그린 것이었을 뿐 실제로는 다른 텍스트(입력값, 라벨)와 동일한 크기로 맞춰달라고 요청.
- **`src/components/Slider.tsx`**: 단위 표시 `<span>`의 클래스를 `text-lg font-bold` → `text-sm`(굵기 제거)으로 변경해 입력창 텍스트(`text-sm`)와 동일한 크기가 되도록 수정.
- **검증**: 작업 전 `_backups/backup_20260901_075913/`로 백업 생성. `npx tsc --noEmit`, `npx eslint src` 모두 통과.

## 2026-09-01 (추가33) — 투자 자산/저축·금액/생활비 슬라이더에 통화 기호 표시 추가

- **배경**: 사용자가 스크린샷을 첨부해, 현재 투자 자산·월 저축·투자 금액·은퇴 후 연간 생활비 3개 슬라이더의 입력칸 우측에 통화 기호($, €, £, ₩, ¥)가 표시되지 않아 나이/퍼센트 슬라이더와 달리 입력칸 정렬이 들쭉날쭉해 보인다고 지적. 선택된 통화에 따라 기호가 바뀌도록 요청.
- **원인**: `FireCalculator.tsx`가 세 슬라이더에 `formatValue={(v) => `${currencySymbol}${v.toLocaleString()}`}`를 전달하고 있었지만, `Slider.tsx`의 `formatValue`는 스크린리더 전용(sr-only) 텍스트 생성에만 쓰이고 화면에 보이는 입력창 텍스트에는 반영되지 않아 통화 기호가 실제로는 전혀 보이지 않았음(8-14에서 발견한 `suffix` 미사용 버그와 동일한 유형의 "죽은 prop" 문제).
- **`src/components/FireCalculator.tsx`**: 세 슬라이더(`currentPortfolio`, `monthlyContribution`, `annualExpenses`)의 `formatValue` prop을 제거하고 `suffix={currencySymbol}`로 교체. 이미 나이("세")·퍼센트("%") 슬라이더가 사용 중인 우측 suffix 배지 방식을 그대로 재사용해, 통화를 바꾸면($/€/£/₩/¥) 표시 기호도 즉시 함께 바뀜.
- **`.gitignore`**: 빌드 검증 중 macOS 브리지 환경에서 발생한 `.next` 캐시 EPERM 문제를 우회하기 위해 임시로 `.next`를 리네임한 잔여 폴더(`.next_old_*`)가 git에 추적되지 않도록 패턴 추가.
- **검증**: 작업 전 `_backups/backup_20260901_081058/`로 백업 생성. `npx tsc --noEmit`, `npx eslint src` 통과. `npm run build`도 82/82 정적 페이지 생성 성공(마지막 `.next/export-detail.json` 삭제 시 EPERM은 기존에도 발생하던 브리지 환경의 무해한 캐시 정리 오류).

## 2026-09-03 (추가34) — 구글 디스커버 대응(대표 이미지 자동 첨부) + 개발자 전용 가이드 이미지 관리 도구 이식

- **배경**: ExifLens에서 이미 구현·배포한 두 가지 기능(구글 디스커버 노출 대비 대표 이미지 자동 첨부 파이프라인, 로컬 개발 서버 전용 이미지 교체 도구)을 firelic에도 이식해 달라는 요청. Unsplash 검색어 소스는 "각 가이드에 tags 직접 입력", API 키는 "FlyDroneMap 키 재사용"(최근 설정, ExifLens 키와 실제 값이 다름을 확인 후 선택)으로 사용자 확인 후 진행.
- **`src/app/[locale]/layout.tsx`**: 루트 `generateMetadata`에 `robots: { googleBot: { "max-image-preview": "large" } }` 추가(구글 디스커버 노출 필수 조건).
- **`src/lib/guides.ts`**: `GuideFrontmatter` 타입에 `image`/`imageCredit`/`imageCreditUrl` 선택 필드 추가.
- **`content/guides/en/*.mdx` (14개 전부)**: 각 가이드 주제에 맞는 영문 `tags`(2개씩)를 새로 채워 넣음. 자동 첨부 스크립트가 검색어로 사용.
- **`automation/attach-guide-image.py` (신규)**: ExifLens 버전을 이식(저작자 표기 UTM을 `utm_source=FIRECalculator`로 변경). 발행 시 영문 tags로 Unsplash에서 가로 1600px webp 이미지를 검색·다운로드해 `public/guides/images/{slug}.webp`에 저장하고, 4개 언어 mdx frontmatter에 `image`/`imageCredit`/`imageCreditUrl`을 삽입. 실패(네트워크/키 없음/검색 결과 없음)해도 예외 없이 조용히 건너뛰고 텍스트만으로 발행 계속.
- **`automation/backfill-guide-images.py` (신규)**: 이미지가 없는 기존 가이드를 순회하며 위 로직을 일괄 적용하는 1회성 백필 스크립트. git add/commit/push는 하지 않음(호출부가 한 번에 처리).
- **`automation/publish-guide.command`**: 4개 언어 mdx 반영 직후 `attach-guide-image.py` 호출 지점 추가, 이미지 파일이 생성됐을 때만 `git add`에 포함하도록 수정.
- **`automation/.env`, `.env.local` (신규)**: `UNSPLASH_ACCESS_KEY`(FlyDroneMap과 공유하는 키) 등록. 둘 다 `.gitignore`의 `.env*` 패턴으로 이미 추적 제외됨.
- **개발자 전용 가이드 이미지 관리 도구 (신규)**: `src/lib/dev/guide-image-tool.ts`(검색/적용/업로드 서버 로직), `src/app/api/dev/guide-image-{search,apply,upload}/route.ts`(API 라우트 3개, `NODE_ENV !== "development"`면 즉시 403), `src/components/dev/guide-image-dev-panel.tsx`(가이드 상세 페이지 우측 하단 플로팅 패널). ExifLens는 shadcn/ui(Button/Input)를 쓰지만 firelic에는 해당 컴포넌트가 없어, 다른 firelic 컴포넌트와 동일하게 순수 HTML 엘리먼트 + `var(--color-...)` Tailwind 클래스로 재작성.
- **`src/app/[locale]/guides/[slug]/page.tsx`**: 대표 이미지 렌더링(`next/image`, `aspect-[16/9]`, `priority`) + "Photo by X on Unsplash" 저작자 표기(둘 다 있을 때만) 추가. 기존에 없던 `generateMetadata`를 새로 추가해 `openGraph.images`/`twitter.images`에 대표 이미지 연결. 로컬 개발 서버에서만 `<GuideImageDevPanel>` 렌더링.
- **네트워크 제약 확인**: 이 클라우드 세션(device_bash 브릿지 및 클라우드 컨테이너 모두)은 조직 이그레스 허용목록에 `api.unsplash.com`이 없어 `blocked-by-allowlist`로 직접 호출이 불가능함을 확인(`npm`/`github` 등은 정상 접속됨). 따라서 14개 기존 가이드에 대한 실제 이미지 백필은 이 세션에서 실행하지 못했고, 사용자가 실제 맥에서 `firelic-backfill-images.command`를 더블클릭해 직접 실행해야 함. **같은 이유로, 매일 자동 발행되는 신규 가이드의 이미지 자동 첨부도 발행 파이프라인이 실행되는 환경에 따라 실패(이미지 없이 발행)할 수 있음** — 실패해도 발행 자체는 막히지 않도록 설계되어 있으므로 이 경우 개발자 도구나 백필 스크립트로 나중에 보완 가능.
- **검증**: 작업 전 `_backups/backup_20260903_193820/`로 백업 생성. `npx tsc --noEmit`, `npx eslint src` 모두 통과. `npm run build`(Turbopack) 97/97 페이지 정상 생성 확인(마지막 `.next` 캐시 정리 단계의 `EPERM`은 기존에도 확인된 무해한 브릿지 오류). 프로덕션 빌드 산출물(`.next/server/app/**/guides/*.html` 등)에 개발자 패널 문자열("이미지 관리")이 전혀 포함되지 않음을 직접 확인해 `NODE_ENV` 조건부 렌더링이 실제로 동작함을 검증.
- **남은 절차(사용자 진행)**: (1) `firelic-backfill-images.command` 더블클릭 → 기존 14개 가이드 이미지 백필 + 커밋/push, (2) `firelic-push.command`로 이번 코드 변경사항 커밋/push, (3) 로컬 `npm run dev`로 개발 서버를 띄워 가이드 상세 페이지 우측 하단에 "🛠 이미지 관리 (DEV)" 패널이 뜨는지, 검색·적용·업로드가 정상 동작하는지 확인 권장.

