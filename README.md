# FIRE Calculator (firelic)

FIRE (Financial Independence, Retire Early) Calculator — 클라이언트 사이드 전용 인터랙티브 조기 은퇴 시뮬레이터.
서버 비용 $0 목표. 계획 도메인: **firelic.com** (아직 미구매 — 마지막 단계에서 구매 예정).

- 스택: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + next-intl + next-themes + Chart.js
- 언어: en(기본) / ko / ja / es
- 관련 문서: `_planning/FIRE_Calculator_Project_Plan.md` (초기 기획안), Claude 프로젝트의 PRD/디자인 스펙 문서(`fire-calculator-prd.md`, `fire-calculator-design-spec.md`, `fire-calculator-project-summary.md`)

## 개발

```bash
npm install
npm run dev        # 개발 서버 시작 + Chrome 자동 오픈 (아래 참고)
npm run dev:plain  # 자동 오픈 없이 next dev만 실행
```

또는 `FIRE Calculator 실행.command`를 더블클릭해서 실행할 수 있습니다(ExifLens/FlyDroneMap과 동일 패턴).

**Chrome 탭 종료 시 서버 자동 종료 (macOS)**: `npm run dev`로 열린 탭/창을 닫으면 몇 초 안에 dev 서버가 자동으로 종료됩니다.
AppleScript로 Chrome 탭 목록을 주기적으로 확인하는 방식이라 완벽하지는 않습니다 — 감지가 안 되면 Chrome의
`보기(View) → 개발자(Developer) → Apple Events의 JavaScript 허용(Allow JavaScript from Apple Events)`이
켜져 있는지 확인해 주세요. 감지에 실패해도 서버가 계속 켜져 있을 뿐 다른 문제는 없습니다(그럴 땐 터미널에서 Ctrl+C).

## 빌드

```bash
npm run build
```

> 참고: 클라우드 세션의 device_bash 브릿지는 실제 맥이 아니라 맥 위의 격리된 리눅스 환경이라, 그 브릿지에서
> `npm run build`/`npm install`을 실행하면 macOS용이 아닌 네이티브 바이너리가 설치/요청되어 실패할 수 있습니다
> (코드 오류 아님 — `tsc`/`eslint`는 브릿지에서도 항상 정상 통과함). 빌드/설치는 항상 이 Mac의 실제 Terminal.app에서
> 진행해 주세요.

## 로고 / 브랜드

`src/components/Logo.tsx`, `public/logo-icon.svg`, `public/logo-wordmark.svg`, `src/app/icon.svg` — 그린 계열
원형 배지 + 상승 화살표(자산 성장) + 오렌지 스파크(FIRE) 아이콘의 코드 기반 v1 로고입니다. 서비스명은
**"FIRE Calculator"**로 잠정 확정되었습니다. 필요 시 디자이너의 손을 거친 정식 버전으로 교체 가능합니다.

## 콘텐츠 (가이드 아티클)

`src/content/guides/{en,ko,ja,es}.ts` — 4개 카테고리(FIRE 기초와 핵심 개념 / 저축과 투자 전략 / 국가별 은퇴·세제 가이드 /
은퇴 후 생활과 인출 전략) × 10개 아티클 × 4개 언어(총 40개)가 각 언어 파일에 나란히 들어 있습니다(같은 slug를
언어별로 공유 — ExifLens/FlyDroneMap 패턴과 동일). 발행일(`publishedAt`)은 모두 KST(Asia/Seoul) 기준
`YYYY-MM-DD` 형식입니다. `/guides`에서 카테고리별로 목록을 볼 수 있습니다.

## 배포

Vercel 연결 예정 (firelic.com 도메인 구매 후 web-backend 단계에서 마지막에 진행).
