import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CompoundTool } from "@/components/tools/CompoundTool";
import { ToolShell, toolMetadata } from "@/components/tools/ToolShell";

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "ko" }];
}

const PATH = "/tools/compound-interest";
const TITLE = "복리 계산기: 매달 적립하면 원금과 수익이 어떻게 쌓이는지 그래프로";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "ko") return {};
  return toolMetadata(
    PATH,
    TITLE,
    "처음 넣는 돈, 월 적립액, 수익률, 기간으로 연도별 원금·적립·수익을 그래프와 표로 보여 주고, 수익이 넣은 돈을 넘어서는 시점과 72법칙 비교를 제공합니다.",
  );
}

export default async function CompoundPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "ko") notFound();
  setRequestLocale(locale);

  return (
    <ToolShell
      path={PATH}
      title="복리 계산기"
      lead="복리는 설명을 들을 때보다 그림으로 볼 때 이해가 빠릅니다. 숫자를 넣으면 회색(내가 넣은 돈) 위로 초록색(수익)이 얼마나 두꺼워지는지 연도별로 확인할 수 있습니다."
      backLabel="재무 도구 목록"
      related={[
        { slug: "compound-interest-and-fire-timeline", title: "복리와 FIRE 도달 시점" },
        { slug: "dollar-cost-averaging-for-fire", title: "적립식 투자의 힘, 분할 매수" },
      ]}
    >
      <CompoundTool />

      <article className="mt-14 flex flex-col gap-10 text-sm leading-7 text-[var(--color-text-secondary)]">
        <section>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">그래프에서 먼저 볼 세 곳</h2>
          <p className="mt-3">
            첫째는 회색 면의 기울기입니다. 매달 같은 금액을 넣기 때문에 일직선에 가깝게 올라갑니다. 둘째는 초록색 면이 시작되는 지점입니다. 초반 몇 년은 얇아서 거의 보이지 않습니다. 사람들이 복리를 믿지 못하고 중간에 그만두는 구간이 바로 여기입니다. 셋째는 표에서 ★로 표시된 해입니다. 수익이 내가 넣은 돈 전체를 처음 넘어서는 해로, 이때부터는 일해서 넣는 돈보다 자산이 스스로 불리는 돈이 더 큽니다. 기본 입력값(1,000만 원 + 월 50만 원, 연 5%)에서는 24년차에 이 지점이 옵니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">20년과 30년의 차이</h2>
          <p className="mt-3">
            같은 조건에서 기간만 20년으로 줄여 보세요. 총액은 30년의 절반이 되지 않습니다. 기간이 10년 늘어날 때 늘어나는 것은 선형이 아니라 가속입니다. 마지막 10년에 불어나는 돈이 앞선 20년 전체보다 큰 이유입니다. 그래서 같은 월 적립액이라면 ’얼마나 넣느냐’보다 ’언제 시작하느냐’가 결과를 더 크게 바꿉니다. 시작이 5년 늦어지는 것은 매달 몇만 원을 덜 넣는 것보다 훨씬 비쌉니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">72법칙은 얼마나 맞을까</h2>
          <p className="mt-3">
            72를 연 수익률로 나누면 원금이 두 배가 되는 햇수가 나옵니다. 연 6%라면 12년입니다. 정확히 계산한 값은 11.9년이어서, 일상에서 어림하기에 충분합니다. 다만 수익률이 아주 낮거나(1~2%) 아주 높으면(20% 이상) 오차가 커집니다. 이 계산기는 입력한 수익률로 72법칙 값과 정확한 값을 나란히 보여 주므로, 어림셈이 어디까지 믿을 만한지 직접 확인할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">복리를 깨뜨리는 것들</h2>
          <p className="mt-3">
            화면의 수익률은 한 번도 흔들리지 않는 가상의 선입니다. 현실에서 복리를 갉아먹는 것은 세 가지입니다. 연 1% 차이가 나는 수수료는 30년이면 최종 금액에서 눈에 띄게 차이가 납니다. 중간 인출은 그 돈이 앞으로 벌었을 시간까지 함께 가져갑니다. 시장이 빠졌을 때 겁이 나서 파는 행동은 회복하는 구간을 놓치게 합니다. 이 중 내가 통제할 수 있는 것은 수수료와 인출, 그리고 행동입니다. 수익률은 통제할 수 없습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">자주 묻는 질문</h2>
          <dl className="mt-3 flex flex-col gap-4">
            <div>
              <dt className="font-semibold text-[var(--color-text-primary)]">은행 이자는 세금이 있는데 반영되나요?</dt>
              <dd className="mt-1">반영하지 않았습니다. 세전 수익률 기준이므로, 세금이 붙는 상품이라면 수익률을 그만큼 낮춰 입력하세요.</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--color-text-primary)]">물가 상승은 어떻게 보나요?</dt>
              <dd className="mt-1">물가상승률이 연 2%라고 보면 실질 수익률은 입력 수익률에서 2%p를 뺀 값입니다. 실질 기준으로 보고 싶다면 그 값을 넣으세요.</dd>
            </div>
          </dl>
        </section>

        <p className="text-xs">월 단위 복리, 월말 적립 가정입니다. 입력값은 브라우저 안에서만 계산되며 어디에도 전송되지 않습니다. 실제 투자 수익은 달라질 수 있습니다.</p>
      </article>
    </ToolShell>
  );
}
