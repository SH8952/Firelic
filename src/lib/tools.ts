/**
 * 한국어 전용 도구(비상금·목표 저축액 역산·복리·퇴직금)의 순수 계산 함수 모음.
 * UI와 분리해 두어 값 검증(스크립트)과 재사용이 쉽다. 모든 금액 단위는 호출하는 쪽이 정한다
 * (비상금·역산·복리는 "만원", 퇴직금은 "원").
 */

// ───────────────────────── 공통 표시 ─────────────────────────

/** 만원 단위 숫자를 "1억 2,345만 원" 형태로 표시한다. */
export function fmtMan(manWon: number): string {
  if (!Number.isFinite(manWon)) return "-";
  const sign = manWon < 0 ? "-" : "";
  const v = Math.round(Math.abs(manWon));
  const eok = Math.floor(v / 10000);
  const man = v % 10000;
  if (eok > 0 && man > 0) return `${sign}${eok.toLocaleString("en-US")}억 ${man.toLocaleString("en-US")}만 원`;
  if (eok > 0) return `${sign}${eok.toLocaleString("en-US")}억 원`;
  return `${sign}${man.toLocaleString("en-US")}만 원`;
}

/** 원 단위 숫자를 "1,234,567원" 으로 표시한다. */
export function fmtWon(won: number): string {
  if (!Number.isFinite(won)) return "-";
  return `${Math.round(won).toLocaleString("en-US")}원`;
}

// ───────────────────────── 비상금 ─────────────────────────

export type EmergencyProfileKey = "salaried" | "freelance" | "single-income";

export const EMERGENCY_PROFILES: Record<EmergencyProfileKey, { label: string; base: number; note: string }> = {
  salaried: {
    label: "월급이 꼬박꼬박 들어오는 직장인",
    base: 3,
    note: "고용이 비교적 안정적이라 일반적으로 3개월에서 시작합니다.",
  },
  "single-income": {
    label: "한 사람의 소득으로 가구를 책임지는 경우",
    base: 6,
    note: "소득이 끊기면 가구 전체가 흔들리므로 6개월에서 시작합니다.",
  },
  freelance: {
    label: "프리랜서·자영업 등 소득이 들쭉날쭉한 경우",
    base: 6,
    note: "수입이 없는 달이 생길 수 있어 6개월에서 시작합니다.",
  },
};

export const EMERGENCY_RISKS = [
  "돌봐야 할 가족(자녀·부모님)이 있다",
  "매달 갚아야 하는 대출 원리금이 필수 지출의 30% 이상이다",
  "이직·퇴사·사업 변경을 앞두고 있다",
  "의료비가 꾸준히 드는 지병이나 계획된 수술이 있다",
] as const;

export type EmergencyResult = {
  months: number;
  target: number;
  gap: number;
  monthsToGoal: number | null; // null: 월 저축이 0이라 도달 불가
  milestones: { label: string; amount: number; monthsAway: number | null; done: boolean }[];
};

export function calcEmergency(args: {
  essential: number; // 월 필수 지출(만원)
  profile: EmergencyProfileKey;
  riskCount: number;
  current: number; // 현재 비상금(만원)
  monthlySave: number; // 월 적립(만원)
}): EmergencyResult {
  const months = EMERGENCY_PROFILES[args.profile].base + Math.min(Math.max(args.riskCount, 0), 4);
  const target = args.essential * months;
  const gap = Math.max(0, target - args.current);
  const away = (amount: number) => {
    const need = Math.max(0, amount - args.current);
    if (need === 0) return 0;
    if (args.monthlySave <= 0) return null;
    return Math.ceil(need / args.monthlySave);
  };
  const marks: [string, number][] = [
    ["1개월치", 1],
    ["3개월치", 3],
  ];
  const milestones = marks
    .filter(([, m]) => m < months)
    .map(([label, m]) => {
      const amount = args.essential * m;
      return { label, amount, monthsAway: away(amount), done: args.current >= amount };
    });
  milestones.push({ label: `목표(${months}개월치)`, amount: target, monthsAway: away(target), done: args.current >= target });
  return { months, target, gap, monthsToGoal: away(target), milestones };
}

// ───────────────────────── 목표 저축액 역산 ─────────────────────────

/** 월 단위 복리로 목표 금액을 만들기 위한 월 저축액(만원). 이미 달성 가능하면 0. */
export function requiredMonthly(target: number, current: number, years: number, annualRatePct: number): number {
  const n = Math.max(1, Math.round(years * 12));
  const r = annualRatePct / 100 / 12;
  const grow = r === 0 ? 1 : Math.pow(1 + r, n);
  const remaining = target - current * grow;
  if (remaining <= 0) return 0;
  const annuity = r === 0 ? n : (grow - 1) / r;
  return remaining / annuity;
}

export function futureValue(current: number, monthly: number, years: number, annualRatePct: number): number {
  const n = Math.round(years * 12);
  const r = annualRatePct / 100 / 12;
  if (r === 0) return current + monthly * n;
  const grow = Math.pow(1 + r, n);
  return current * grow + (monthly * (grow - 1)) / r;
}

// ───────────────────────── 복리 ─────────────────────────

export type CompoundRow = { year: number; principal: number; contributed: number; interest: number; total: number };

/** 연도별 잔액: 초기 원금, 누적 적립, 누적 수익. 월 단위 복리, 월말 적립. */
export function compoundSchedule(initial: number, monthly: number, years: number, annualRatePct: number): CompoundRow[] {
  const r = annualRatePct / 100 / 12;
  const rows: CompoundRow[] = [];
  let balance = initial;
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) balance = balance * (1 + r) + monthly;
    const contributed = monthly * 12 * y;
    rows.push({ year: y, principal: initial, contributed, interest: balance - initial - contributed, total: balance });
  }
  return rows;
}

/** 수익이 (초기 원금 + 누적 적립)을 처음 넘어서는 연차. 없으면 null. */
export function crossoverYear(rows: CompoundRow[]): number | null {
  const hit = rows.find((row) => row.interest > row.principal + row.contributed);
  return hit ? hit.year : null;
}

/** 원금이 2배가 되는 데 걸리는 햇수: 72법칙 추정값과 정확한 값. */
export function doublingYears(annualRatePct: number): { rule72: number; exact: number } | null {
  if (annualRatePct <= 0) return null;
  return { rule72: 72 / annualRatePct, exact: Math.log(2) / Math.log(1 + annualRatePct / 100) };
}

// ───────────────────────── 퇴직금 ─────────────────────────

const MS_DAY = 24 * 60 * 60 * 1000;

/** YYYY-MM-DD 문자열을 UTC 자정 시각으로 파싱. 잘못된 값이면 null. */
export function parseYmd(s: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d);
  const back = new Date(t);
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== m - 1 || back.getUTCDate() !== d) return null;
  return t;
}

/** 마지막 근무일 기준 직전 3개월의 달력상 일수 (마지막 근무일 다음 날부터 거슬러 3개월). */
export function threeMonthDays(lastDayMs: number): number {
  const end = new Date(lastDayMs + MS_DAY); // 퇴직일(마지막 근무일 다음 날)
  const start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - 3, end.getUTCDate()));
  return Math.round((end.getTime() - start.getTime()) / MS_DAY);
}

export type SeveranceResult =
  | { ok: false; reason: string }
  | {
      ok: true;
      serviceDays: number;
      days3m: number;
      wageBase: number; // 최근 3개월 임금 총액
      bonusAdd: number; // 상여금 3/12 가산
      leaveAdd: number; // 연차수당 3/12 가산
      avgDaily: number;
      severance: number;
      eligible: boolean; // 계속근로 1년 이상
    };

export function calcSeverance(args: {
  joinYmd: string;
  lastYmd: string;
  wage3m: number; // 최근 3개월 임금 총액(원, 세전)
  annualBonus: number; // 최근 1년 상여금 총액(원)
  annualLeavePay: number; // 최근 1년 연차수당 총액(원)
}): SeveranceResult {
  const join = parseYmd(args.joinYmd);
  const last = parseYmd(args.lastYmd);
  if (join === null || last === null) return { ok: false, reason: "날짜를 입력해 주세요." };
  if (last < join) return { ok: false, reason: "마지막 근무일이 입사일보다 앞섭니다." };
  const wageBase = Math.max(0, args.wage3m);
  if (wageBase <= 0) return { ok: false, reason: "최근 3개월 임금 총액을 입력해 주세요." };
  const serviceDays = Math.round((last - join) / MS_DAY) + 1;
  const days3m = threeMonthDays(last);
  const bonusAdd = (Math.max(0, args.annualBonus) * 3) / 12;
  const leaveAdd = (Math.max(0, args.annualLeavePay) * 3) / 12;
  const avgDaily = (wageBase + bonusAdd + leaveAdd) / days3m;
  const severance = (avgDaily * 30 * serviceDays) / 365;
  return { ok: true, serviceDays, days3m, wageBase, bonusAdd, leaveAdd, avgDaily, severance, eligible: serviceDays >= 365 };
}
