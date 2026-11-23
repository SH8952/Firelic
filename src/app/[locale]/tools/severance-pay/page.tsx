import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { SeveranceTool } from "@/components/tools/SeveranceTool";
import { ToolShell, toolMetadata } from "@/components/tools/ToolShell";

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "ko" }];
}

const PATH = "/tools/severance-pay";
const TITLE = "퇴직금 계산기: 평균임금 계산 5단계와 받은 뒤 IRP로 두면 생기는 차이";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "ko") return {};
  return toolMetadata(
    PATH,
    TITLE,
    "입사일과 마지막 근무일, 최근 3개월 임금, 상여금·연차수당을 넣으면 평균임금과 예상 퇴직금을 단계별로 계산하고, 퇴직금을 쓰거나 IRP에 보관했을 때의 25년 뒤 차이를 비교합니다.",
  );
}

export default async function SeverancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "ko") notFound();
  setRequestLocale(locale);

  return (
    <ToolShell
      path={PATH}
      title="퇴직금 계산기"
      lead="퇴직금은 '월급 × 근속 연수'가 아닙니다. 퇴직 직전 3개월의 임금으로 하루 평균임금을 구하고, 거기에 30일을 곱해 근속 기간만큼 쌓는 방식입니다. 아래 세 단계를 순서대로 채워 보세요."
      backLabel="재무 도구 목록"
      related={[
        { slug: "severance-pay-job-change-irp-guide", title: "이직할 때 퇴직금, IRP로 받아야 할까" },
        { slug: "korea-irp-pension-account-fire", title: "FIRE를 위한 IRP·연금계좌 활용" },
      ]}
    >
      <SeveranceTool />

      <article className="mt-14 flex flex-col gap-10 text-sm leading-7 text-[var(--color-text-secondary)]">
        <section>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">계산 5단계</h2>
          <ol className="mt-3 list-decimal pl-5">
            <li className="mt-1">마지막 근무일 다음 날을 퇴직일로 보고, 그날부터 거슬러 3개월의 달력상 일수를 셉니다.</li>
            <li className="mt-1">그 3개월 동안 받은 임금 총액(기본급, 각종 수당, 세전)을 구합니다.</li>
            <li className="mt-1">최근 1년 동안 받은 상여금과 연차수당 총액 각각의 3/12을 더합니다.</li>
            <li className="mt-1">합계를 3개월 일수로 나눠 1일 평균임금을 구합니다.</li>
            <li className="mt-1">평균임금 × 30일 × 총 근무일수 ÷ 365가 퇴직금입니다.</li>
          </ol>
          <p className="mt-3">
            계속 근로 기간이 1년(365일) 미만이면 법정 퇴직금 지급 대상이 아닙니다. 또 주 15시간 미만의 초단시간 근로자도 대상에서 제외됩니다. 이 계산기는 근무일수만 확인하므로 근로 형태는 따로 점검해야 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">많이 놓치는 항목</h2>
          <p className="mt-3">
            가장 흔한 실수는 상여금과 연차수당을 빼는 것입니다. 연 400만 원 상여금은 3/12인 100만 원이 평균임금 계산에 더해져, 퇴직금이 수십만 원 달라질 수 있습니다. 반대로 월급에서 공제된 세금과 4대 보험료는 빼지 않고 세전 금액을 써야 합니다. 식대, 교통비 같은 정기적 수당이 임금에 포함되는지도 확인하세요. 회사가 퇴직연금(DC·DB)에 가입했다면 지급 방식과 계산 기준이 다를 수 있으니, 이 결과는 법정 기준의 참고값으로 봐 주세요.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">가상 사례</h2>
          <p className="mt-3">
            2020년 3월 2일 입사해 2026년 12월 31일에 퇴직하는 직장인이 마지막 3개월 임금으로 900만 원을 받았고 상여금과 연차수당은 없다고 가정하면, 근무일수는 2,496일, 직전 3개월 일수는 92일입니다. 1일 평균임금은 약 9만 7,826원이고, 퇴직금은 약 2,007만 원이 됩니다. 이 사례를 기본값에서 직접 바꿔 보며 어떤 항목이 결과를 크게 움직이는지 비교해 보세요.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">받은 퇴직금을 어떻게 할까</h2>
          <p className="mt-3">
            퇴직금은 퇴직 시 IRP(개인형 퇴직연금) 계좌로 받는 것이 원칙입니다. IRP에 두면 55세 이후 연금으로 받을 때 퇴직소득세가 줄어드는 혜택이 있고, 일부를 해지해 쓰면 그 혜택은 사라집니다. 결과 화면 아래 비교 상자는 당장 쓰는 비율과 수익률을 바꿔 가며 25년 뒤 금액이 어떻게 달라지는지를 보여 줍니다. 세금과 수수료는 단순화한 값이므로 방향을 보는 용도로만 쓰시고, 실제 세액은 금융기관이나 국세청 안내로 확인하세요.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">자주 묻는 질문</h2>
          <dl className="mt-3 flex flex-col gap-4">
            <div>
              <dt className="font-semibold text-[var(--color-text-primary)]">퇴직금은 언제까지 받을 수 있나요?</dt>
              <dd className="mt-1">근로기준법상 퇴직일로부터 14일 이내에 지급해야 하며, 당사자 합의가 있으면 연장할 수 있습니다.</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--color-text-primary)]">회사 계산과 금액이 다릅니다.</dt>
              <dd className="mt-1">임금에 포함하는 수당의 범위, 3개월 일수, 상여금 반영 여부가 가장 흔한 차이 원인입니다. 관할 고용노동청 상담이나 회사 급여 담당자에게 산정 내역을 요청해 항목별로 비교해 보세요.</dd>
            </div>
          </dl>
        </section>

        <p className="text-xs">
          입력한 금액과 날짜는 브라우저 안에서만 계산되며 서버로 전송되지 않습니다. 법령 기준 개요는 고용노동부(moel.go.kr)와 금융감독원 파인(fine.fss.or.kr)에서 확인할 수 있습니다. 실제 지급액은 사업장 규정과 개별 상황에 따라 다를 수 있습니다.
        </p>
      </article>
    </ToolShell>
  );
}
