import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { SavingGoalTool } from "@/components/tools/SavingGoalTool";
import { ToolShell, toolMetadata } from "@/components/tools/ToolShell";

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "ko" }];
}

const PATH = "/tools/monthly-saving-goal";
const TITLE = "목표 금액 역산 계산기: 1억을 모으려면 매달 얼마를 저축해야 할까";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "ko") return {};
  return toolMetadata(
    PATH,
    TITLE,
    "목표 금액과 기간, 지금 가진 돈, 수익률을 넣으면 필요한 월 저축액을 거꾸로 계산하고, 기간·수익률별 비교표로 현실적인 계획을 찾도록 돕습니다.",
  );
}

export default async function MonthlySavingGoalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "ko") notFound();
  setRequestLocale(locale);

  return (
    <ToolShell
      path={PATH}
      title="목표 금액 역산 계산기"
      lead="보통은 ’매달 50만 원씩 넣으면 얼마가 될까’를 묻지만, 목표가 먼저 정해져 있다면 질문을 뒤집어야 합니다. 도착점을 먼저 놓고 매달 얼마를 보내야 하는지를 거꾸로 구합니다."
      backLabel="계산기 목록"
      related={[
        { slug: "savings-rate-target-table-by-income", title: "소득별 저축률 목표표" },
        { slug: "fire-milestones-roadmap-1eok-to-9eok", title: "1억에서 9억까지, FIRE 단계별 로드맵" },
      ]}
    >
      <SavingGoalTool />

      <article className="mt-14 flex flex-col gap-10 text-sm leading-7 text-[var(--color-text-secondary)]">
        <section>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">왜 거꾸로 계산할까</h2>
          <p className="mt-3">
            정방향 계산은 ’지금 할 수 있는 만큼’에서 출발하기 때문에 목표와 현실의 간격이 숨어 버립니다. 반대로 1억 원, 10년이라는 도착점에서 거꾸로 걸어오면 그 길을 가려면 매달 얼마가 필요한지가 숫자 하나로 드러납니다. 그 숫자가 월 실수령의 20%라면 도전해 볼 만하고, 70%라면 목표나 기간이 잘못 잡힌 것입니다. 입력칸에 월 실수령을 넣어 두면 그 비율을 바로 보여 주는 이유입니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">비교표 읽는 법</h2>
          <p className="mt-3">
            결과 옆의 표는 같은 목표를 기간과 수익률만 바꿔 계산한 값입니다. 가로로 보면 수익률이 1~2%p 달라질 때 월 저축액이 얼마나 줄어드는지, 세로로 보면 기간을 1~2년 늘릴 때 부담이 얼마나 가벼워지는지를 알 수 있습니다. 대체로 기간이 짧을수록 수익률 차이의 효과는 작고, 기간이 길수록 커집니다. 5년짜리 목표는 결국 내가 넣는 돈이 대부분이므로 저축액 자체를 키워야 하고, 20년짜리 목표는 수익률 가정이 결과를 크게 흔듭니다. 그래서 수익률은 낙관적인 숫자보다 0%와 3% 두 줄을 같이 보며 ’최악에도 감당할 수 있는 금액’을 기준으로 삼는 편이 낫습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">목표가 비현실적으로 나왔다면</h2>
          <p className="mt-3">
            월 저축액이 실수령의 절반을 넘어 버리면 보통 세 가지 방법을 씁니다. 하나, 기간을 늘립니다. 가장 안전하고 효과가 큽니다. 둘, 목표를 단계로 쪼갭니다. 1억을 한 번에 보지 말고 3천만 원, 6천만 원처럼 중간 정거장을 만들어 각각 역산하면 흔들릴 때 덜 지칩니다. 셋, 수입을 늘리는 쪽을 병행합니다. 지출을 더 줄이는 데는 한계가 있고, 어느 선부터는 삶의 질이 무너집니다. 수익률을 높이려고 위험한 자산에 몰아넣는 방법은 권하지 않습니다. 수익률 가정을 올리면 숫자만 좋아 보일 뿐 현실이 달라지지는 않기 때문입니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">계산 방식과 한계</h2>
          <p className="mt-3">
            월 단위 복리, 월말 납입을 가정합니다. 세금과 수수료, 물가 상승은 반영하지 않았습니다. 물가가 오르면 10년 뒤의 1억 원은 지금보다 구매력이 낮으므로, 먼 목표일수록 목표 금액을 조금 높게 잡는 것이 현실적입니다. FIRE 가이드의 계산은 연 단위 납입이라 같은 조건에서도 값이 조금 다르게 나올 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">자주 묻는 질문</h2>
          <dl className="mt-3 flex flex-col gap-4">
            <div>
              <dt className="font-semibold text-[var(--color-text-primary)]">수익률은 몇 %로 넣어야 하나요?</dt>
              <dd className="mt-1">정답은 없습니다. 예금·적금 중심이면 2~4%, 분산 투자라면 장기 평균을 보수적으로 잡은 4~6% 안팎을 쓰는 사람이 많습니다. 확신이 없으면 0%, 3%, 5% 결과를 모두 보세요.</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--color-text-primary)]">현재 자산이 0원이면 어떻게 하나요?</dt>
              <dd className="mt-1">’지금 가진 돈’에 0을 넣으면 됩니다. 매달 같은 금액을 꾸준히 넣는 경로로 계산됩니다.</dd>
            </div>
          </dl>
        </section>

        <p className="text-xs">입력값은 이 브라우저 안에서만 계산되며 저장되거나 전송되지 않습니다. 결과는 가정에 따른 참고용입니다.</p>
      </article>
    </ToolShell>
  );
}
