import type { PolicyPage } from "@/content/policies";

export function PolicyPageView({ page }: { page: PolicyPage }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{page.title}</h1>
      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">Last updated: {page.updated}</p>
      <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-[var(--color-text-primary)]">
        {page.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
