import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { EmergencyFundTool } from "@/components/tools/EmergencyFundTool";
import { ToolShell, toolMetadata } from "@/components/tools/ToolShell";

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "ko" }];
}

const PATH = "/tools/emergency-fund";
const TITLE = "비상금 목표 계산기: 내 월 지출과 직업 형태로 몇 개월치가 필요한지";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "ko") return {};
  return toolMetadata(
    PATH,
    TITLE,
    "월 필수 지출, 직업 형태, 위험 요인 네 가지를 고르면 필요한 비상금 개월 수와 금액, 도달 시점을 계산합니다. 입력값은 브라우저 안에서만 계산됩니다.",
  );
}

export default async function EmergencyFundPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "ko") notFound();
  setRequestLocale(locale);

  return (
    <ToolShell
      path={PATH}
      title="비상금 목표 계산기"
      lead="’비상금은 월급의 3~6개월치’라는 말은 누구에게나 같은 숫자가 아닙니다. 월급이 끊기면 가장 먼저 타격을 받는 사람과 그렇지 않은 사람의 기준은 다릅니다. 아래에서 내 상황을 고르면 개월 수가 달라집니다."
      backLabel="재무 도구 목록"
      related={[
        { slug: "build-emergency-fund-before-fire", title: "FIRE 전에 먼저 만들어야 할 비상금" },
        { slug: "emergency-fund-then-what-money-waterfall", title: "비상금을 채운 다음 돈은 어디로 흘러가야 할까" },
      ]}
    >
      <EmergencyFundTool />

      <article className="mt-14 flex flex-col gap-10 text-sm leading-7 text-[var(--color-text-secondary)]">
        <section>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">개월 수를 정하는 세 가지 기준</h2>
          <p className="mt-3">
            이 계산기는 세 가지만 봅니다. 첫째는 수입이 끊겼을 때 다시 채워지기까지 걸리는 시간입니다. 고용이 안정적인 직장인은 이직이나 실업급여로 비교적 빨리 흐름을 되찾지만, 프리랜서는 의뢰가 끊긴 뒤 다시 계약이 잡히기까지 몇 달이 걸리기도 합니다. 둘째는 그 돈에 기대는 사람의 수입니다. 한 사람의 월급으로 가계가 돌아간다면 그 한 줄이 끊기는 순간 모든 지출이 비상금에서 나옵니다. 맞벌이는 한쪽이 흔들려도 다른 쪽이 버팁니다. 셋째는 줄일 수 없는 지출의 크기입니다. 대출 원리금과 월세, 보험료는 소득이 없어도 날짜가 되면 빠져나갑니다.
          </p>
          <p className="mt-3">
            그래서 입력칸도 총지출이 아니라 ’필수 지출’입니다. 외식과 쇼핑, 취미 구독은 위기 때 멈출 수 있으므로 목표 금액에서 뺍니다. 필수 지출이 얼마인지 감이 오지 않는다면 지난 석 달 통장을 열어 보고 해지할 수 없는 자동이체만 더해 보세요. 생각보다 적게 나오는 경우가 많지만, 대출이 있으면 오히려 커집니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">두 가지 가상 사례</h2>
          <p className="mt-3">
            <strong className="text-[var(--color-text-primary)]">사례 A.</strong> 외벌이 가장, 월 필수 지출 260만 원(월세 90만, 대출 상환 60만, 식비·교통·보험 110만). 직업 형태는 ’혼자 버는 가구’로 기본 6개월, 돌봐야 할 자녀가 있어 위험 요인 하나를 더하면 7개월, 목표는 1,820만 원입니다. 이 사람은 3개월치 780만 원까지는 반드시 현금성 자산으로 두고, 나머지는 파킹통장에 나눠 쌓는 쪽을 택할 수 있습니다.
          </p>
          <p className="mt-3">
            <strong className="text-[var(--color-text-primary)]">사례 B.</strong> 맞벌이 직장인 부부 중 한 명, 월 필수 지출 180만 원을 부담하고 위험 요인은 없음. 기본 3개월이므로 목표는 540만 원입니다. 같은 월급이어도 B가 A보다 훨씬 가벼운 목표를 갖게 되는 것이 정상입니다. 남과 비교해서 ’나는 왜 이렇게 많이 필요하지’ 하고 위축될 이유가 없습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">모은 비상금은 어디에 둘까</h2>
          <p className="mt-3">
            비상금의 핵심은 수익이 아니라 필요한 날 바로 꺼낼 수 있는지입니다. 첫 달치는 입출금 통장에, 그다음 구간은 하루만 맡겨도 이자가 붙는 파킹통장이나 CMA처럼 당일 또는 다음 영업일에 인출되는 곳에 두는 방식이 흔합니다. 주식이나 가격이 흔들리는 자산에 넣어 두면, 하필 시장이 빠진 해에 직장까지 잃는 상황에서 손실을 확정하고 팔아야 할 수 있습니다. 목표 금액을 채운 뒤의 돈은 그때 투자나 연금계좌로 보내면 됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">자주 묻는 질문</h2>
          <dl className="mt-3 flex flex-col gap-4">
            <div>
              <dt className="font-semibold text-[var(--color-text-primary)]">대출을 갚는 중인데 비상금도 모아야 하나요?</dt>
              <dd className="mt-1">최소 한 달치 필수 지출은 먼저 확보하는 편이 안전합니다. 현금이 0이면 작은 지출에도 카드론이나 마이너스 통장을 쓰게 되어 이자가 더 커질 수 있습니다.</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--color-text-primary)]">목표를 채운 뒤에도 계속 넣어야 하나요?</dt>
              <dd className="mt-1">아니요. 채운 뒤에는 물가와 지출이 늘어난 만큼만 반년에 한 번 점검하고, 남는 돈은 다음 목표로 보냅니다.</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--color-text-primary)]">실업급여가 있는데 줄여도 되지 않나요?</dt>
              <dd className="mt-1">실업급여는 자발적 퇴사 등 수급 요건에 따라 받지 못할 수 있고, 지급까지 시간이 걸립니다. 받을 수 있다고 가정하기보다 받지 못해도 버틸 수 있는지를 기준으로 삼는 것이 안전합니다.</dd>
            </div>
          </dl>
        </section>

        <p className="text-xs">
          이 계산기의 입력값은 서버로 전송되지 않고 이 화면 안에서만 계산됩니다. 결과는 일반적인 기준에 따른 참고용 수치이며, 개인의 소득·부채·가족 상황에 따라 적정 금액은 달라질 수 있습니다.
        </p>
      </article>
    </ToolShell>
  );
}
