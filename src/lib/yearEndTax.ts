/**
 * 연말정산 환급 추정 계산 (2026년 귀속, 근로소득자 기본형).
 * 모든 금액은 원 단위. 참고용 추정치이며 회사 정산·홈택스 결과와 다를 수 있다.
 *
 * 반영: 근로소득공제, 기본공제(150만 원/인), 4대보험료 소득공제(추정 가능),
 * 신용카드 등 소득공제, 소득세 누진세율, 근로소득세액공제, 자녀세액공제,
 * 연금계좌, 보장성보험료, 의료비, 교육비, 월세, 표준세액공제(13만 원).
 * 미반영: 인적 추가공제, 기부금, 주택청약·주택자금, 대학생 자녀 교육비, 난임시술비 구분,
 *        도서·공연·체육시설 우대 공제, 각종 세액감면.
 */

export type YearEndInput = {
  /** 총급여(비과세 제외 연 총급여) */
  salary: number;
  /** 이미 낸 소득세(원천징수 합계). null이면 간이 추정 */
  withheld: number | null;
  /** 기본공제 대상 인원(본인 포함) */
  headcount: number;
  /** 20세 이하 자녀 수(카드 공제 한도 가산 대상) */
  childrenUnder20: number;
  /** 자녀세액공제 대상 자녀 수(연령 요건은 해당 연도 기준 확인 필요) */
  childTaxCreditCount: number;
  /** 4대보험료 중 소득공제 대상(국민연금+건강+고용). null이면 총급여로 추정 */
  insurance: number | null;
  creditCard: number;
  debitAndCash: number;
  marketAndTransit: number;
  pensionSavings: number;
  irp: number;
  /** 보장성보험료(연) */
  protectionInsurance: number;
  /** 본인·65세 이상·장애인·6세 이하 의료비(한도 없음) */
  medicalNoLimit: number;
  /** 그 밖의 부양가족 의료비(연 700만 원 한도) */
  medicalLimited: number;
  educationSelf: number;
  /** 자녀(미취학~고교) 교육비: 자녀 1인당 300만 원 한도 */
  educationChildren: number;
  /** 연간 월세 총액 */
  rent: number;
};

export type YearEndResult = {
  salary: number;
  earnedIncomeDeduction: number;
  earnedIncome: number;
  basicDeduction: number;
  insuranceDeduction: number;
  insuranceEstimated: boolean;
  cardThreshold: number;
  cardDeduction: number;
  taxBase: number;
  computedTax: number;
  creditEarned: number;
  creditChild: number;
  creditPension: number;
  creditInsurance: number;
  creditMedical: number;
  creditEducation: number;
  creditStandard: number;
  creditRent: number;
  creditTotal: number;
  finalTax: number;
  localTax: number;
  withheld: number;
  withheldEstimated: boolean;
  /** 양수 = 환급(소득세), 음수 = 추가 납부 */
  diff: number;
  /** 지방소득세 포함 */
  diffWithLocal: number;
  pensionTarget: number;
};

const MAN = 10000;

export function earnedIncomeDeduction(s: number): number {
  let d: number;
  if (s <= 500 * MAN) d = s * 0.7;
  else if (s <= 1500 * MAN) d = 350 * MAN + (s - 500 * MAN) * 0.4;
  else if (s <= 4500 * MAN) d = 750 * MAN + (s - 1500 * MAN) * 0.15;
  else if (s <= 10000 * MAN) d = 1200 * MAN + (s - 4500 * MAN) * 0.05;
  else d = 1475 * MAN + (s - 10000 * MAN) * 0.02;
  return Math.min(d, 2000 * MAN);
}

const BRACKETS: Array<[number, number, number]> = [
  [1400 * MAN, 0.06, 0],
  [5000 * MAN, 0.15, 126 * MAN],
  [8800 * MAN, 0.24, 576 * MAN],
  [15000 * MAN, 0.35, 1544 * MAN],
  [30000 * MAN, 0.38, 1994 * MAN],
  [50000 * MAN, 0.4, 2594 * MAN],
  [100000 * MAN, 0.42, 3594 * MAN],
  [Infinity, 0.45, 6594 * MAN],
];

export function computedTaxOf(base: number): number {
  if (base <= 0) return 0;
  for (const [limit, rate, deduct] of BRACKETS) {
    if (base <= limit) return Math.max(0, base * rate - deduct);
  }
  return 0;
}

export function earnedTaxCredit(tax: number, salary: number): number {
  const raw = tax <= 130 * MAN ? tax * 0.55 : 71.5 * MAN + (tax - 130 * MAN) * 0.3;
  let cap: number;
  if (salary <= 3300 * MAN) cap = 74 * MAN;
  else if (salary <= 7000 * MAN) cap = Math.max(74 * MAN - (salary - 3300 * MAN) * 0.008, 66 * MAN);
  else if (salary <= 12000 * MAN) cap = Math.max(66 * MAN - (salary - 7000 * MAN) * 0.5, 50 * MAN);
  else cap = Math.max(50 * MAN - (salary - 12000 * MAN) * 0.5, 20 * MAN);
  return Math.min(raw, cap);
}

/** 국민연금 4.5%(월 기준소득 상한 637만 원) + 건강·장기요양 약 3.95% + 고용 0.9% 추정 */
export function estimateInsurance(salary: number): number {
  const pensionBase = Math.min(salary, 637 * MAN * 12);
  return Math.round(pensionBase * 0.045 + salary * 0.0395 + salary * 0.009);
}

export function cardDeductionOf(
  salary: number,
  credit: number,
  debit: number,
  market: number,
  childrenUnder20: number,
): { threshold: number; deduction: number } {
  const threshold = salary * 0.25;
  let rem = threshold;
  const take = (amt: number) => {
    const used = Math.min(amt, rem);
    rem -= used;
    return amt - used;
  };
  const c = take(credit);
  const d = take(debit);
  const m = take(market);
  const dc = c * 0.15;
  const dd = d * 0.3;
  const dm = m * 0.4;
  const sum = dc + dd + dm;
  const high = salary <= 7000 * MAN;
  const kids = Math.max(0, Math.floor(childrenUnder20));
  const base = high ? 300 * MAN + Math.min(kids * 50 * MAN, 100 * MAN) : 250 * MAN + Math.min(kids * 25 * MAN, 50 * MAN);
  const extraLimit = high ? 300 * MAN : 200 * MAN;
  if (sum <= base) return { threshold, deduction: sum };
  const extra = Math.min(extraLimit, Math.min(sum - base, dm));
  return { threshold, deduction: base + extra };
}

function childCredit(n: number): number {
  const k = Math.max(0, Math.floor(n));
  if (k === 0) return 0;
  if (k === 1) return 25 * MAN;
  if (k === 2) return 55 * MAN;
  return 95 * MAN + (k - 3) * 40 * MAN;
}

export function pensionTargetOf(pensionSavings: number, irp: number): number {
  const base = Math.min(Math.max(pensionSavings, 0), 600 * MAN);
  return Math.min(base + Math.max(irp, 0), 900 * MAN);
}

function taxBefore(
  salary: number,
  headcount: number,
  insurance: number,
  card: number,
): { earnedIncomeDed: number; earnedIncome: number; basic: number; base: number; tax: number } {
  const earnedIncomeDed = earnedIncomeDeduction(salary);
  const earnedIncome = salary - earnedIncomeDed;
  const basic = Math.max(1, Math.floor(headcount)) * 150 * MAN;
  const base = Math.max(0, earnedIncome - basic - insurance - card);
  return { earnedIncomeDed, earnedIncome, basic, base, tax: computedTaxOf(base) };
}

export function calcYearEnd(input: YearEndInput): YearEndResult {
  const s = Math.max(0, input.salary);
  const insuranceEstimated = input.insurance === null;
  const insurance = input.insurance === null ? estimateInsurance(s) : Math.max(0, input.insurance);

  const card = cardDeductionOf(s, input.creditCard, input.debitAndCash, input.marketAndTransit, input.childrenUnder20);
  const t = taxBefore(s, input.headcount, insurance, card.deduction);

  const creditEarned = earnedTaxCredit(t.tax, s);
  const creditChild = childCredit(input.childTaxCreditCount);

  const pensionTarget = pensionTargetOf(input.pensionSavings, input.irp);
  const creditPension = pensionTarget * (s <= 5500 * MAN ? 0.15 : 0.12);

  const creditInsurance = Math.min(Math.max(input.protectionInsurance, 0), 100 * MAN) * 0.12;

  const medThreshold = s * 0.03;
  const medBase = Math.max(input.medicalNoLimit, 0) + Math.min(Math.max(input.medicalLimited, 0), 700 * MAN);
  const creditMedical = Math.max(medBase - medThreshold, 0) * 0.15;

  const kids = Math.max(0, Math.floor(input.childrenUnder20));
  const eduChildren = Math.min(Math.max(input.educationChildren, 0), kids * 300 * MAN);
  const creditEducation = (Math.max(input.educationSelf, 0) + eduChildren) * 0.15;

  const special = creditInsurance + creditMedical + creditEducation;

  const rentBase = s <= 8000 * MAN ? Math.min(Math.max(input.rent, 0), 1000 * MAN) : 0;
  const creditRent = rentBase * (s <= 5500 * MAN ? 0.17 : 0.15);

  // 표준세액공제(13만 원): 특별세액공제 합계가 13만 원 미만이면 표준으로 대체.
  // 월세 세액공제를 신청하는 경우 표준세액공제를 함께 적용하는지는 확인되지 않아,
  // 환급을 과대 계산하지 않도록 월세 공제가 있으면 표준세액공제를 적용하지 않는다(보수적 추정).
  const useStandard = special + creditRent < 13 * MAN;
  const creditStandard = useStandard ? 13 * MAN : 0;
  const specialApplied = useStandard ? 0 : special;

  const creditTotal = creditEarned + creditChild + creditPension + specialApplied + creditStandard + creditRent;
  const finalTax = Math.max(0, t.tax - creditTotal);

  let withheld: number;
  let withheldEstimated = false;
  if (input.withheld === null) {
    withheldEstimated = true;
    const b = taxBefore(s, input.headcount, insurance, 0);
    withheld = Math.max(0, b.tax - earnedTaxCredit(b.tax, s) - childCredit(input.childTaxCreditCount));
  } else {
    withheld = Math.max(0, input.withheld);
  }

  const diff = withheld - finalTax;
  const localTax = finalTax * 0.1;
  return {
    salary: s,
    earnedIncomeDeduction: t.earnedIncomeDed,
    earnedIncome: t.earnedIncome,
    basicDeduction: t.basic,
    insuranceDeduction: insurance,
    insuranceEstimated,
    cardThreshold: card.threshold,
    cardDeduction: card.deduction,
    taxBase: t.base,
    computedTax: t.tax,
    creditEarned,
    creditChild,
    creditPension,
    creditInsurance: useStandard ? 0 : creditInsurance,
    creditMedical: useStandard ? 0 : creditMedical,
    creditEducation: useStandard ? 0 : creditEducation,
    creditStandard,
    creditRent,
    creditTotal,
    finalTax,
    localTax,
    withheld,
    withheldEstimated,
    diff,
    diffWithLocal: diff * 1.1,
    pensionTarget,
  };
}
