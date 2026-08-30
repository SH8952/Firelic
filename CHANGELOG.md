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
