# FIRE Calculator (firelic)

Global FIRE (Financial Independence, Retire Early) Calculator & Early Retirement Simulator.
클라이언트 사이드 전용 인터랙티브 은퇴 시뮬레이터 — 서버 비용 $0 목표.

- 스택: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + next-intl + next-themes + Chart.js
- 언어: en(기본) / ko / ja / es
- 관련 문서: `_planning/FIRE_Calculator_Project_Plan.md` (초기 기획안), 세션 프로젝트의 PRD/디자인 스펙 문서

## 개발

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

> 참고: 클라우드 세션의 device_bash 브릿지(마운트된 폴더)에서 `npm run build`를 실행하면 `.next` 폴더 최종 정리 단계에서
> FUSE 마운트 특성상 `EPERM: unlink` 오류가 발생할 수 있습니다(코드 오류 아님 — 타입체크와 정적 페이지 생성은 모두 성공 확인됨).
> 이 경우 Mac에서 Terminal.app으로 직접 이 폴더에 진입해 `npm run build`를 실행하면 정상 동작합니다.

## 배포

Vercel 연결 예정 (도메인 구매 후 web-backend 단계에서 진행).
