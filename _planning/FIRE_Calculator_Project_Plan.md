# [기획서] 글로벌 FIRE (조기 은퇴/재정 자립) 시뮬레이터 Web App

---

## 1. 프로젝트 개요

* **프로젝트명:** Global FIRE Calculator & Early Retirement Simulator (가칭)
* **목적:** 전 세계 사용자를 대상으로 조기 은퇴(FIRE족) 목표 달성 시점과 자산 성장 곡선을 인터랙티브하게 시각화해 주는 웹 기반 유틸리티 도구 개발
* **핵심 타겟:** 미국, 영국, 캐나다, 호주, 유럽 등 Tier 1 국가 중심의 2040 직장인 및 자산 형성층 (기본 언어: English, 다국어 지원)
* **비용 구조:** **서버 유지비 $0/월** (Cloudflare Pages / Vercel Edge Hosting 활용, 100% Client-Side JS 로직 처리)

---

## 2. 기존 개발 서비스와의 공통 아키텍처 (FlyDroneMap & EXIFND 방식)

기존에 제작하신 **FlyDroneMap** 및 **EXIFND**와 동일한 기술 스택 및 배포 파이프라인을 그대로 적용합니다.

1. **No-Server / Pure Client-Side Architecture:**
   * 모든 재정/이자 계산 및 차트 렌더링을 브라우저(JavaScript / WebAssembly) 내부에서 수행.
   * 백엔드 API 서버를 두지 않아 서버 비용, DB 비용, maintenance 부담이 전혀 없음.
2. **글로벌 CDN 및 Edge Deployment:**
   * Cloudflare Pages 또는 Vercel을 통한 정적 웹사이트 배포로 도메인 비용 외 유지비 $0 구현.
   * 전 세계 어디서든 1초 미만(Sub-second) 빠른 로딩 속도 확보.
3. **i18n 다국어 URL 구조:**
   * 기본 라우팅: `/en/` (미국/글로벌 기본), `/ko/`, `/ja/`, `/de/`, `/es/` 등
   * SEO 최적화를 위한 OpenGraph 및 Hreflang 태그 자동 구성.

---

## 3. 핵심 기능 및 UI/UX 인터랙션 설계

### 3.1. 사용자 개입을 유도하는 슬라이더 & 파라미터

| 파라미터명 | 설명 | 기본 설정값 (Default) | 유저 조작 방식 |
| :--- | :--- | :--- | :--- |
| **Current Age / Target Age** | 현재 나이 / 목표 은퇴 나이 | 30세 / 45세 | 슬라이더 / Number Input |
| **Current Portfolio** | 현재 투자 자산 총액 | $50,000 | 슬라이더 / Input |
| **Monthly Contribution** | 월 저축 및 투자 금액 | $1,500 | 슬라이더 / Input |
| **Annual Expenses in FIRE** | 은퇴 후 연간 필요 생활비 | $40,000 | 슬라이더 / Input |
| **Expected Real Return (%)** | 예상 연간 실질 수익률 (인플레이션 차감) | 6.0% | 슬라이더 (0% ~ 15%) |
| **Safe Withdrawal Rate (%)** | 안전 인출률 (4% Rule 기준) | 4.0% | 슬라이더 (2% ~ 6%) |
| **Effective Tax Rate (%)** | 인출 시 예상 실효 세율 (글로벌 범용) | 15.0% | 슬라이더 (0% ~ 40%) |

### 3.2. 실시간 시각화 & 인터랙티브 대시보드

* **Canvas 기반 실시간 Chart (Chart.js / Highcharts):**
  * 사용자가 슬라이더를 움직이는 즉시 **자산 증가 곡선(Accumulation Phase)**과 **은퇴 후 자산 인출 곡선(Withdrawal Phase)**이 애니메이션 효과와 함께 업데이트됨.
* **FIRE Target Milestones (목표 달성 지표):**
  * **FIRE Number (목표 자산):** 예) `$1,176,470` (실효세율 고려 자동 산출)
  * **FIRE Age / Years to FIRE:** 목표 자산 도달 나이 및 남은 기간 (예: `42.5세 / 12.5년 남음`)
  * **Coast FIRE / Lean FIRE Indicator:** 부가적 목표 지표 칩(Chip) 표시

---

## 4. 세법 및 국가별 복잡성 회피 전략

1. **실효 세율(Effective Tax Rate) 슬라이더 내재화:**
   * 국가별(미국 401k/Roth, 영국 ISA, 한국 연금저축 등) 복잡한 세법을 직접 코딩하지 않고, 유저가 **예상 실효 세율(%)**을 직접 조절하도록 설계.
   * 국가별 가이드는 하단 텍스트 문서(SEO 영역)로만 제공하여 기술적/법적 리스크 차단.
2. **통화(Currency) 기호 선택기:**
   * 유저가 `$` (USD), `€` (EUR), `£` (GBP), `₩` (KRW), `¥` (JPY) 중 아이콘 선택 가능 (계산 공식은 동일).

---

## 5. 체류 시간 극대화 및 광고 수익화 전략

### 5.1. 체류 시간(Dwell Time) 확보 구조

* **Default-First UI:** 접속 시 이미 완성된 예시 차트가 바로 시각화되어 높은 초기 만족도 제공.
* **Interactive Adjustments:** 유저가 자신의 나이/자산 상황을 맞추기 위해 최소 5~10회 이상 슬라이더를 조정하도록 유도 (체류 시간 수 분 이상 확보).
* **Scenario Comparison Mode:** "A 시나리오(60세 은퇴) vs B 시나리오(45세 은퇴)"를 탭으로 비교할 수 있는 인터랙티브 기능 제공.

### 5.2. 애드센스 & 제휴 마케팅 레이아웃

* **상단/하단 디스플레이 광고:** 차트 바로 상단 및 하단에 반응형 디스플레이 광고 배치.
* **인터랙션 영역 네이티브 광고:** 입력 슬라이더 영역과 계산 결과 섹션 사이에 네이티브 광고 탑재.
* **금융/증권사 제휴 링크 (Affiliate Integration):**
  * 예: 차트 하단에 *"Ready to invest? Compare Top Brokerages for FIRE (Interactive Brokers, eToro, Webull)"* 텍스트 뱅크 배치.

---

## 6. 개발 단계별 로드맵 (Action Items)

1. **1단계: 기능 명세 및 UI/UX 와이어프레임 설계**
   * HTML/CSS/JS 단일 파일 시제품 제작 (기본 계산 로직 및 Chart.js 연동).
2. **2단계: 반응형 레이아웃 & 다국어(i18n) 세팅**
   * 영문(`en`)을 메인으로 한국어(`ko`), 일어(`ja`), 스페인어(`es`) 다국어 구조 템플릿화.
3. **3단계: Cloudflare Pages / Vercel 배포 및 도메인 연결**
   * 기존 FlyDroneMap 배포와 동일하게 Git 레포지토리 연동 후 자동 빌드 설정.
4. **4단계: SEO 최적화 & 구글 애드센스 승인 신청**
   * 하단에 FIRE Calculator 관련 영문 가이드 및 FAQ 아티클 3~5개 배치 후 애드센스 신청.

---
