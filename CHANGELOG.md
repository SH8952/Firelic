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
