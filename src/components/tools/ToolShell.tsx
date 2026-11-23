import { BackLink } from "@/components/back-link";
import { breadcrumbJsonLd } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export type RelatedGuide = { slug: string; title: string };

/** 한국어 전용 도구 페이지의 공통 껍데기: 상단 탐색, 제목, 도구 영역, 관련 가이드. 본문 글은 각 페이지가 직접 쓴다. */
export function ToolShell({
  path,
  title,
  lead,
  backLabel,
  related,
  children,
}: {
  path: string;
  title: string;
  lead: string;
  backLabel: string;
  related: RelatedGuide[];
  children: React.ReactNode;
}) {
  const crumbs = [
    { name: "Home", url: `${SITE_URL}/ko` },
    { name: "계산기", url: `${SITE_URL}/ko/calculators` },
    { name: title, url: `${SITE_URL}/ko${path}` },
  ];
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 [word-break:keep-all] [overflow-wrap:break-word]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      <BackLink href="/ko/calculators" label={backLabel} />
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{title}</h1>
      <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">{lead}</p>
      <div className="mt-8">{children}</div>
      {related.length > 0 ? (
        <aside className="mt-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">이어서 읽으면 좋은 가이드</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {related.map((g) => (
              <li key={g.slug}>
                <a href={`/ko/guides/${g.slug}`} className="text-[var(--color-primary)] hover:underline">
                  {g.title} →
                </a>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </div>
  );
}

export function toolMetadata(path: string, title: string, description: string) {
  const url = `${SITE_URL}/ko${path}`;
  return {
    title,
    description,
    alternates: { canonical: url, languages: { ko: url } },
    openGraph: {
      title,
      description,
      url,
      type: "website" as const,
      images: [{ url: `${SITE_URL}/ko/opengraph-image`, width: 1200, height: 630, alt: title }],
    },
  };
}
