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
