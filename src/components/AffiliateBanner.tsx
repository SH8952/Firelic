type Partner = {
  name: string;
  href: string;
};

type AffiliateBannerProps = {
  title: string;
  disclosureLabel: string;
  partners: Partner[];
};

/**
 * Placeholder affiliate banner. Links are non-functional (href="#") until
 * each partner's affiliate program approves the site (PRD 5.3 / 5 항목).
 */
export function AffiliateBanner({ title, disclosureLabel, partners }: AffiliateBannerProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <p className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {partners.map((p) => (
          <span
            key={p.name}
            className="cursor-not-allowed rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-text-secondary)]"
            title={disclosureLabel}
          >
            {p.name}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs text-[var(--color-text-secondary)]">{disclosureLabel}</p>
    </div>
  );
}
