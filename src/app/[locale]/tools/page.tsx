import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { BackLink } from "@/components/back-link";
import { toolMetadata } from "@/components/tools/ToolShell";
import { breadcrumbJsonLd } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "ko" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "ko") return {};
  return toolMetadata(
    "/tools",
    "재무 계산 도구 모음: 비상금·저축 목표·복리·퇴직금",
    "FIRE를 준비하는 과정에서 자주 막히는 네 가지 계산, 비상금 목표, 목표 금액 역산, 복리, 퇴직금을 각각 다른 방식으로 풀어 주는 무료 계산 도구 모음입니다.",
  );
}

const TOOLS = [
  {
    href: "/ko/tools/emergency-fund",
    name: "비상금 목표 계산기",
    when: "월급이 끊겨도 버틸 돈이 얼마인지 모르겠을 때",
    how: "직업 형태와 위험 요인을 고르면 필요한 개월 수와 도달 시점을 알려 줍니다.",
  },
  {
    href: "/ko/tools/monthly-saving-goal",
    name: "목표 금액 역산 계산기",
    when: "'1억을 언제까지'처럼 목표가 먼저 있을 때",
    how: "필요한 월 저축액과, 기간·수익률을 바꿨을 때의 비교표를 보여 줍니다.",
  },
  {
    href: "/ko/tools/compound-interest",
    name: "복리 계산기",
    when: "오래 투자하면 정말 불어나는지 눈으로 확인하고 싶을 때",
    how: "원금·적립·수익이 쌓이는 모습을 그래프와 연도별 표로 보여 줍니다.",
  },
  {
    href: "/ko/tools/severance-pay",
    name: "퇴직금 계산기",
    when: "퇴사나 이직을 앞두고 받을 돈을 미리 알고 싶을 때",
    how: "평균임금 계산을 단계별로 보여 주고, 받은 뒤의 활용 차이도 비교합니다.",
  },
];

export default async function ToolsHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "ko") notFound();
  setRequestLocale(locale);
  const tBack = await getTranslations("BackNav");
  const crumbs = breadcrumbJsonLd([
    { name: "Home", url: `${SITE_URL}/ko` },
    { name: "재무 계산 도구", url: `${SITE_URL}/ko/tools` },
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 [word-break:keep-all] [overflow-wrap:break-word]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <BackLink href="/ko" label={tBack("home")} />
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">재무 계산 도구 모음</h1>
      <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
        FIRE 계산기는 은퇴 시점이라는 큰 그림을 보여 주지만, 그 길에는 작은 질문이 많습니다. 비상금은 얼마나 두어야 하는지, 목표를 위해 매달 얼마를 모아야 하는지, 시간이 정말 내 편인지, 퇴사할 때 받는 돈은 얼마인지. 이 도구들은 그 질문 하나씩에 답하도록 만들었습니다.
      </p>
      <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {TOOLS.map((t) => (
          <li key={t.href} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <a href={t.href} className="text-base font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)]">
              {t.name}
            </a>
            <p className="mt-2 text-xs font-medium text-[var(--color-primary)]">{t.when}</p>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{t.how}</p>
            <a href={t.href} className="mt-3 inline-block text-sm font-medium text-[var(--color-primary)]">
              계산해 보기 →
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-xs leading-6 text-[var(--color-text-secondary)]">
        모든 계산은 브라우저 안에서만 이루어지며 입력값은 저장되거나 전송되지 않습니다. 결과는 단순화한 가정에 따른 참고용이며 투자나 세무 자문이 아닙니다.
      </p>
    </div>
  );
}
