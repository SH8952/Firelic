"use client";

import { useEffect, useMemo, useState } from "react";
import { calcYearEnd, estimateInsurance, pensionTargetOf, type YearEndInput } from "@/lib/yearEndTax";

const MAN = 10000;

type Form = {
  salary: number; // 만원
  withheld: number | null;
  headcount: number;
  childrenUnder20: number;
  childTaxCreditCount: number;
  insurance: number | null;
  creditCard: number;
  debitAndCash: number;
  marketAndTransit: number;
  pensionSavings: number;
  irp: number;
  protectionInsurance: number;
  medicalNoLimit: number;
  medicalLimited: number;
  educationSelf: number;
  educationChildren: number;
  rent: number;
};

const EMPTY: Form = {
  salary: 4000,
  withheld: null,
  headcount: 1,
  childrenUnder20: 0,
  childTaxCreditCount: 0,
  insurance: null,
  creditCard: 0,
  debitAndCash: 0,
  marketAndTransit: 0,
  pensionSavings: 0,
  irp: 0,
  protectionInsurance: 0,
  medicalNoLimit: 0,
  medicalLimited: 0,
  educationSelf: 0,
  educationChildren: 0,
  rent: 0,
};

const PRESETS: Array<{ label: string; form: Partial<Form> }> = [
  { label: "총급여 3천만 원", form: { salary: 3000, creditCard: 500, debitAndCash: 600, pensionSavings: 300 } },
  { label: "총급여 4천만 원", form: { salary: 4000, creditCard: 800, debitAndCash: 900, pensionSavings: 400, irp: 100 } },
  { label: "총급여 5천만 원", form: { salary: 5000, creditCard: 1000, debitAndCash: 1000, pensionSavings: 600, irp: 100 } },
  { label: "총급여 6천만 원", form: { salary: 6000, creditCard: 1300, debitAndCash: 1200, pensionSavings: 600, irp: 200 } },
];

type Spouse = {
  salary: number;
  withheld: number | null;
  creditCard: number;
  debitAndCash: number;
  marketAndTransit: number;
  pensionSavings: number;
  irp: number;
};
const SPOUSE_EMPTY: Spouse = {
  salary: 3000,
  withheld: null,
  creditCard: 0,
  debitAndCash: 0,
  marketAndTransit: 0,
  pensionSavings: 0,
  irp: 0,
};

const FORM_KEYS = Object.keys(EMPTY) as Array<keyof Form>;

function won(n: number): string {
  const v = Math.round(n);
  return `${v < 0 ? "-" : ""}${Math.abs(v).toLocaleString("ko-KR")}원`;
}
function manWon(n: number): string {
  const v = Math.round(n / MAN);
  return `${v < 0 ? "-" : ""}${Math.abs(v).toLocaleString("ko-KR")}만 원`;
}

function toInput(f: Form): YearEndInput {
  return {
    salary: f.salary * MAN,
    withheld: f.withheld === null ? null : f.withheld * MAN,
    headcount: f.headcount,
    childrenUnder20: f.childrenUnder20,
    childTaxCreditCount: f.childTaxCreditCount,
    insurance: f.insurance === null ? null : f.insurance * MAN,
    creditCard: f.creditCard * MAN,
    debitAndCash: f.debitAndCash * MAN,
    marketAndTransit: f.marketAndTransit * MAN,
    pensionSavings: f.pensionSavings * MAN,
    irp: f.irp * MAN,
    protectionInsurance: f.protectionInsurance * MAN,
    medicalNoLimit: f.medicalNoLimit * MAN,
    medicalLimited: f.medicalLimited * MAN,
    educationSelf: f.educationSelf * MAN,
    educationChildren: f.educationChildren * MAN,
    rent: f.rent * MAN,
  };
}

function NumberField({
  label,
  hint,
  value,
  onChange,
  unit = "만 원",
  allowEmpty = false,
  emptyPlaceholder,
}: {
  label: string;
  hint?: string;
  value: number | null;
  onChange: (v: number | null) => void;
  unit?: string;
  allowEmpty?: boolean;
  emptyPlaceholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-[var(--color-text-primary)]">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={value === null ? "" : value.toLocaleString("ko-KR")}
          placeholder={value === null ? emptyPlaceholder : undefined}
          onChange={(e) => {
            const digits = e.target.value.replace(/[^0-9]/g, "");
            if (digits === "") {
              onChange(allowEmpty ? null : 0);
              return;
            }
            onChange(Math.min(Number(digits), 100000000));
          }}
          className="tabular-nums w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-right text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
        />
        <span className="w-12 shrink-0 text-xs text-[var(--color-text-secondary)]">{unit}</span>
      </span>
      {hint ? <span className="text-xs text-[var(--color-text-secondary)]">{hint}</span> : null}
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <legend className="px-1 text-sm font-semibold text-[var(--color-primary)]">{title}</legend>
      <div className="mt-2 grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function fv10(annual: number): number {
  return annual * ((Math.pow(1.05, 10) - 1) / 0.05);
}

export function YearEndTaxCalculator() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [extraPension, setExtraPension] = useState(0); // 만원
  const [extraCard, setExtraCard] = useState(0); // 만원
  const [couple, setCouple] = useState(false);
  const [sp, setSp] = useState<Spouse>(SPOUSE_EMPTY);
  const [copied, setCopied] = useState(false);

  // 주소의 ?preset=3000~6000 또는 개별 값(?salary=4000&...)으로 입력을 미리 채운다.
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const preset = q.get("preset");
      if (preset) {
        const hit = PRESETS.find((x) => String(x.form.salary) === preset);
        if (hit) {
          setForm({ ...EMPTY, ...hit.form });
          return;
        }
      }
      const next: Partial<Form> = {};
      for (const k of FORM_KEYS) {
        const raw = q.get(k);
        if (raw !== null && raw !== "" && Number.isFinite(Number(raw))) {
          (next as Record<string, number>)[k] = Math.min(Math.max(Number(raw), 0), 100000000);
        }
      }
      if (Object.keys(next).length > 0) setForm({ ...EMPTY, ...next });
    } catch {
      // 주소 해석 실패 시 기본값 유지
    }
  }, []);

  function copyLink() {
    try {
      const q = new URLSearchParams();
      for (const k of FORM_KEYS) {
        const v = form[k];
        if (v !== null && v !== EMPTY[k]) q.set(k, String(v));
      }
      const url = `${window.location.origin}${window.location.pathname}${q.toString() ? `?${q.toString()}` : ""}`;
      void navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch {
      // 클립보드 사용 불가 시 무시
    }
  }

  const set = <K extends keyof Form>(key: K, v: Form[K]) => setForm((p) => ({ ...p, [key]: v }));
  const input = useMemo(() => toInput(form), [form]);
  const r = useMemo(() => calcYearEnd(input), [input]);

  const remainPension = Math.max(0, 900 - pensionTargetOf(input.pensionSavings, input.irp) / MAN);
  const pensionExtra = Math.min(extraPension, remainPension);
  const rPension = useMemo(
    () => calcYearEnd({ ...input, irp: input.irp + pensionExtra * MAN }),
    [input, pensionExtra],
  );
  const rCredit = useMemo(
    () => calcYearEnd({ ...input, creditCard: input.creditCard + extraCard * MAN }),
    [input, extraCard],
  );
  const rDebit = useMemo(
    () => calcYearEnd({ ...input, debitAndCash: input.debitAndCash + extraCard * MAN }),
    [input, extraCard],
  );

  const refund = r.diff >= 0;
  const insuranceHint = `비워 두면 총급여로 추정합니다 (추정 약 ${manWon(estimateInsurance(input.salary))}).`;
  const gainPension = rPension.diff - r.diff;
  const gainCardDebit = rDebit.diff - rCredit.diff;
  const investBase = Math.max(r.diff, 0);

  const coupleRows = useMemo(() => {
    if (!couple) return null;
    const spouse: YearEndInput = {
      salary: sp.salary * MAN,
      withheld: sp.withheld === null ? null : sp.withheld * MAN,
      headcount: 1,
      childrenUnder20: 0,
      childTaxCreditCount: 0,
      insurance: null,
      creditCard: sp.creditCard * MAN,
      debitAndCash: sp.debitAndCash * MAN,
      marketAndTransit: sp.marketAndTransit * MAN,
      pensionSavings: sp.pensionSavings * MAN,
      irp: sp.irp * MAN,
      protectionInsurance: 0,
      medicalNoLimit: 0,
      medicalLimited: 0,
      educationSelf: 0,
      educationChildren: 0,
      rent: 0,
    };
    const options: Array<{ label: string; family: "A" | "B"; medical: "A" | "B" }> = [
      { label: "가족 공제·의료비 모두 본인", family: "A", medical: "A" },
      { label: "가족 공제 본인 + 의료비 배우자", family: "A", medical: "B" },
      { label: "가족 공제 배우자 + 의료비 본인", family: "B", medical: "A" },
      { label: "가족 공제·의료비 모두 배우자", family: "B", medical: "B" },
    ];
    const rows = options.map((o) => {
      const a: YearEndInput = { ...input };
      const b: YearEndInput = { ...spouse };
      if (o.family === "B") {
        b.headcount = input.headcount;
        b.childrenUnder20 = input.childrenUnder20;
        b.childTaxCreditCount = input.childTaxCreditCount;
        b.educationChildren = input.educationChildren;
        a.headcount = 1;
        a.childrenUnder20 = 0;
        a.childTaxCreditCount = 0;
        a.educationChildren = 0;
      }
      if (o.medical === "B") {
        b.medicalNoLimit = input.medicalNoLimit;
        b.medicalLimited = input.medicalLimited;
        a.medicalNoLimit = 0;
        a.medicalLimited = 0;
      }
      const ra = calcYearEnd(a);
      const rb = calcYearEnd(b);
      return { ...o, tax: ra.finalTax + rb.finalTax, diff: ra.diff + rb.diff, estimated: ra.withheldEstimated || rb.withheldEstimated };
    });
    const baseline = rows[0].tax;
    const best = rows.reduce((m, x) => (x.tax < m.tax ? x : m), rows[0]);
    return { rows, baseline, best };
  }, [couple, sp, input]);

  const recs = useMemo(() => {
    const list: Array<[string, string]> = [];
    const cardUsed = input.creditCard + input.debitAndCash + input.marketAndTransit;
    if (cardUsed < r.cardThreshold * 1.15 || r.cardDeduction < 3000000) {
      list.push(["credit-vs-debit-card-year-end-tax-split", "카드 공제: 신용카드·체크카드 비율"]);
    }
    if (remainPension > 0) list.push(["pension-savings-irp-december-deposit-refund", "연금저축·IRP 12월 납입 환급표"]);
    if (form.rent === 0 || r.creditRent > 0) list.push(["monthly-rent-tax-credit-requirements-refund", "월세 세액공제 조건과 환급액"]);
    if (form.medicalNoLimit + form.medicalLimited > 0 || form.educationSelf + form.educationChildren > 0) {
      list.push(["medical-education-donation-year-end-tax-checklist", "의료비·교육비 공제 체크리스트"]);
    }
    if (couple || form.headcount > 1) list.push(["dual-income-dependents-year-end-tax-allocation", "맞벌이·부양가족 공제 배분"]);
    if (r.diff < 300000) list.push(["why-year-end-tax-refund-is-small-checklist", "환급이 적게 나온 이유 진단"]);
    return list.slice(0, 4);
  }, [input, r, remainPension, form, couple]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--color-text-secondary)]">예시로 채우기</span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setForm({ ...EMPTY, ...p.form })}
              className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setForm(EMPTY)}
            className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
          >
            초기화
          </button>
          <button
            type="button"
            onClick={copyLink}
            className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
          >
            {copied ? "링크 복사됨" : "입력값 링크 복사"}
          </button>
        </div>

        <Section title="기본 정보">
          <NumberField label="총급여 (연, 세전, 비과세 제외)" value={form.salary} onChange={(v) => set("salary", v ?? 0)} />
          <NumberField
            label="이미 낸 소득세 (원천징수 합계)"
            hint="급여명세서 소득세 합계를 넣어 주세요. 비워 두면 간이 추정합니다."
            value={form.withheld}
            allowEmpty
            emptyPlaceholder="추정"
            onChange={(v) => set("withheld", v)}
          />
          <NumberField label="기본공제 인원 (본인 포함)" value={form.headcount} unit="명" onChange={(v) => set("headcount", Math.max(1, v ?? 1))} />
          <NumberField label="20세 이하 자녀 수" value={form.childrenUnder20} unit="명" onChange={(v) => set("childrenUnder20", v ?? 0)} />
          <NumberField
            label="자녀세액공제 대상 자녀 수"
            hint="연령 요건은 해당 연도 기준을 홈택스에서 확인하세요."
            value={form.childTaxCreditCount}
            unit="명"
            onChange={(v) => set("childTaxCreditCount", v ?? 0)}
          />
          <NumberField
            label="4대보험료 (국민연금+건강+고용, 연)"
            hint={insuranceHint}
            value={form.insurance}
            allowEmpty
            emptyPlaceholder="추정"
            onChange={(v) => set("insurance", v)}
          />
        </Section>

        <Section title="카드·현금영수증 사용액 (연간)">
          <NumberField label="신용카드" value={form.creditCard} onChange={(v) => set("creditCard", v ?? 0)} />
          <NumberField label="체크카드·현금영수증" value={form.debitAndCash} onChange={(v) => set("debitAndCash", v ?? 0)} />
          <NumberField label="전통시장·대중교통" value={form.marketAndTransit} onChange={(v) => set("marketAndTransit", v ?? 0)} />
        </Section>

        <Section title="연금계좌·보험 (연간 납입액)">
          <NumberField label="연금저축" value={form.pensionSavings} onChange={(v) => set("pensionSavings", v ?? 0)} />
          <NumberField label="IRP (본인 부담)" value={form.irp} onChange={(v) => set("irp", v ?? 0)} />
          <NumberField label="보장성 보험료" hint="연 100만 원까지 12% 공제" value={form.protectionInsurance} onChange={(v) => set("protectionInsurance", v ?? 0)} />
        </Section>

        <Section title="의료비·교육비·월세 (연간)">
          <NumberField label="의료비 (본인·65세 이상·장애인·6세 이하)" hint="한도 없음 그룹" value={form.medicalNoLimit} onChange={(v) => set("medicalNoLimit", v ?? 0)} />
          <NumberField label="의료비 (그 밖의 부양가족)" hint="연 700만 원까지 인정" value={form.medicalLimited} onChange={(v) => set("medicalLimited", v ?? 0)} />
          <NumberField label="본인 교육비" value={form.educationSelf} onChange={(v) => set("educationSelf", v ?? 0)} />
          <NumberField label="자녀 교육비 (미취학~고교)" hint="자녀 1인당 300만 원 한도" value={form.educationChildren} onChange={(v) => set("educationChildren", v ?? 0)} />
          <NumberField label="월세 (연간 총액)" hint="총급여 8천만 원 이하 무주택 세대주 등 요건 충족 시" value={form.rent} onChange={(v) => set("rent", v ?? 0)} />
        </Section>

        <fieldset className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <legend className="px-1 text-sm font-semibold text-[var(--color-primary)]">맞벌이 부부 비교 (선택)</legend>
          <label className="mt-2 flex items-center gap-2 text-sm text-[var(--color-text-primary)]">
            <input type="checkbox" checked={couple} onChange={(e) => setCouple(e.target.checked)} />
            배우자 정보를 넣고 가족 공제·의료비를 누구 앞으로 올릴지 비교하기
          </label>
          {couple ? (
            <>
              <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                위 &lsquo;기본공제 인원&rsquo;은 배우자를 제외한 인원(본인 포함)으로 입력하세요. 연금저축·카드·월세 등은 각자 본인 앞으로 계산하고, 가족 공제(기본공제·자녀세액공제·자녀 교육비)와 의료비만 배분을 바꿔 봅니다.
              </p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <NumberField label="배우자 총급여 (연)" value={sp.salary} onChange={(v) => setSp((p) => ({ ...p, salary: v ?? 0 }))} />
                <NumberField label="배우자 이미 낸 소득세" value={sp.withheld} allowEmpty emptyPlaceholder="추정" onChange={(v) => setSp((p) => ({ ...p, withheld: v }))} />
                <NumberField label="배우자 신용카드" value={sp.creditCard} onChange={(v) => setSp((p) => ({ ...p, creditCard: v ?? 0 }))} />
                <NumberField label="배우자 체크카드·현금영수증" value={sp.debitAndCash} onChange={(v) => setSp((p) => ({ ...p, debitAndCash: v ?? 0 }))} />
                <NumberField label="배우자 전통시장·대중교통" value={sp.marketAndTransit} onChange={(v) => setSp((p) => ({ ...p, marketAndTransit: v ?? 0 }))} />
                <NumberField label="배우자 연금저축" value={sp.pensionSavings} onChange={(v) => setSp((p) => ({ ...p, pensionSavings: v ?? 0 }))} />
                <NumberField label="배우자 IRP" value={sp.irp} onChange={(v) => setSp((p) => ({ ...p, irp: v ?? 0 }))} />
              </div>
            </>
          ) : null}
        </fieldset>
      </div>

      <div className="flex flex-col gap-5 lg:sticky lg:top-4 lg:self-start">
        <div className="rounded-xl border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/5 p-5" aria-live="polite">
          <p className="text-sm text-[var(--color-text-secondary)]">예상 결과 (소득세 기준)</p>
          <p className={`tabular-nums mt-1 text-3xl font-bold ${refund ? "text-[var(--color-primary)]" : "text-red-500"}`}>
            {refund ? "환급 " : "추가 납부 "}
            {won(Math.abs(r.diff))}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            지방소득세(결정세액의 10%)까지 합치면 약 {won(Math.abs(r.diffWithLocal))} {refund ? "환급" : "추가 납부"}
          </p>
          {r.withheldEstimated ? (
            <p className="mt-2 text-xs text-[var(--color-text-secondary)]">기납부세액을 입력하지 않아 간이 추정값({won(r.withheld)})으로 계산했습니다. 급여명세서 값을 넣으면 더 정확합니다.</p>
          ) : null}
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">계산 과정</p>
          <table className="mt-3 w-full text-sm">
            <tbody className="divide-y divide-[var(--color-border)]">
              {[
                ["총급여", won(r.salary)],
                ["근로소득공제", `- ${won(r.earnedIncomeDeduction)}`],
                ["기본공제", `- ${won(r.basicDeduction)}`],
                [`4대보험료 공제${r.insuranceEstimated ? " (추정)" : ""}`, `- ${won(r.insuranceDeduction)}`],
                [`카드 소득공제 (문턱 ${manWon(r.cardThreshold)})`, `- ${won(r.cardDeduction)}`],
                ["과세표준", won(r.taxBase)],
                ["산출세액", won(r.computedTax)],
                ["근로소득세액공제", `- ${won(r.creditEarned)}`],
                ["자녀세액공제", `- ${won(r.creditChild)}`],
                ["연금계좌 세액공제", `- ${won(r.creditPension)}`],
                ["보험·의료·교육 세액공제", `- ${won(r.creditInsurance + r.creditMedical + r.creditEducation)}`],
                ["표준세액공제", `- ${won(r.creditStandard)}`],
                ["월세 세액공제", `- ${won(r.creditRent)}`],
                ["결정세액", won(r.finalTax)],
                [`기납부세액${r.withheldEstimated ? " (추정)" : ""}`, won(r.withheld)],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td className="py-1.5 pr-2 text-[var(--color-text-secondary)]">{k}</td>
                  <td className="tabular-nums py-1.5 text-right text-[var(--color-text-primary)]">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">12월 시뮬레이션: 지금 더 하면 얼마나 늘까?</p>

          <div className="mt-4">
            <p className="text-xs text-[var(--color-text-secondary)]">연말까지 연금계좌(IRP) 추가 납입</p>
            <input
              type="range"
              min={0}
              max={Math.max(0, Math.floor(remainPension))}
              step={10}
              value={pensionExtra}
              disabled={remainPension <= 0}
              onChange={(e) => setExtraPension(Number(e.target.value))}
              className="mt-2 w-full"
              aria-label="추가 납입 금액"
            />
            <p className="tabular-nums mt-1 text-sm text-[var(--color-text-primary)]">
              {remainPension <= 0 ? "연 900만 원 한도를 이미 채웠습니다." : `추가 ${pensionExtra.toLocaleString("ko-KR")}만 원 (남은 한도 ${Math.floor(remainPension).toLocaleString("ko-KR")}만 원)`}
            </p>
            {pensionExtra > 0 ? (
              <p className="mt-1 text-sm font-semibold text-[var(--color-primary)]">
                환급 {won(Math.max(gainPension, 0))} 증가 → 총 {rPension.diff >= 0 ? "환급 " : "추가 납부 "}
                {won(Math.abs(rPension.diff))}
              </p>
            ) : null}
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">낸 세금(결정세액)보다 많이 돌려받을 수는 없어 환급 증가분이 납입액의 12~15%보다 작을 수 있습니다.</p>
          </div>

          <div className="mt-5 border-t border-[var(--color-border)] pt-4">
            <p className="text-xs text-[var(--color-text-secondary)]">연말까지 카드로 더 쓸 예정 금액</p>
            <div className="mt-2 max-w-[220px]">
              <NumberField label="추가 사용 예정액" value={extraCard} onChange={(v) => setExtraCard(v ?? 0)} />
            </div>
            {extraCard > 0 ? (
              <p className="mt-2 text-sm text-[var(--color-text-primary)]">
                신용카드로 쓰면 환급 {won(rCredit.diff - r.diff)} 증가, 체크카드·현금영수증으로 쓰면 {won(rDebit.diff - r.diff)} 증가합니다
                {gainCardDebit > 0 ? ` (체크카드가 ${won(gainCardDebit)} 유리)` : ""}.
              </p>
            ) : null}
          </div>
        </div>

        {coupleRows ? (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">부부 배분 비교 (두 사람 결정세액 합계)</p>
            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[var(--color-text-secondary)]">
                  <th className="py-1 pr-2 font-normal">배분 방식</th>
                  <th className="py-1 text-right font-normal">결정세액 합계</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {coupleRows.rows.map((row) => (
                  <tr key={row.label} className={row === coupleRows.best ? "font-semibold text-[var(--color-primary)]" : ""}>
                    <td className="py-1.5 pr-2">{row.label}{row === coupleRows.best ? " (가장 유리)" : ""}</td>
                    <td className="tabular-nums py-1.5 text-right">{won(row.tax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-sm text-[var(--color-text-primary)]">
              {coupleRows.baseline - coupleRows.best.tax > 1000
                ? `'${coupleRows.best.label}'로 올리면 '모두 본인' 대비 세금이 약 ${won(coupleRows.baseline - coupleRows.best.tax)} 줄어듭니다.`
                : "배분 방식에 따른 세금 차이가 거의 없습니다."}
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">세액공제는 본인이 낸 세금까지만 받을 수 있어, 소득이 낮은 배우자에게 몰아도 낸 세금이 적으면 효과가 제한됩니다. 같은 가족을 두 사람이 중복 공제할 수는 없습니다.</p>
          </div>
        ) : null}

        {recs.length > 0 ? (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">내 입력에 맞는 가이드</p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {recs.map(([slug, label]) => (
                <li key={slug}>
                  <a href={`/ko/guides/${slug}`} className="text-sm text-[var(--color-text-primary)] hover:text-[var(--color-primary)]">
                    {label} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">환급금을 투자하면?</p>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {investBase > 0
              ? `이 금액(${won(investBase)})을 매년 연 5% 수익률로 10년간 투자하면(연 1회 납입 가정) 약 ${won(fv10(investBase))}가 됩니다.`
              : "환급이 생기면 투자로 이어졌을 때의 효과를 여기서 보여 드립니다."}
          </p>
          <a href="/ko" className="mt-3 inline-block text-sm font-medium text-[var(--color-primary)]">
            FIRE 계산기에서 내 은퇴 시점 확인하기 →
          </a>
        </div>

        <p className="text-xs leading-6 text-[var(--color-text-secondary)]">
          2026년 귀속(2027년 초 정산) 현행 기준의 참고용 추정치입니다. 인적 추가공제, 기부금, 주택청약·주택자금, 대학생 자녀 교육비, 난임시술비 구분, 도서·공연·체육시설 우대 공제, 각종 감면은 반영하지 않으며 4대보험료와 기납부세액은 입력하지 않으면 추정합니다. 실제 결과는 회사 정산과 홈택스 연말정산 미리보기로 확인하세요.
        </p>
      </div>
    </div>
  );
}
