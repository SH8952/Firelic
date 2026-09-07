import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { VisitorCounter } from "@/components/VisitorCounter";

export function SiteFooter() {
  const t = useTranslations("nav");
  // "About"/"Guides" moved to SiteHeader (top nav) on 2026-09-01; the
  // footer now only carries the legal/policy links.
  const links: Array<{ href: string; label: string }> = [
    { href: "/privacy-policy", label: t("privacy") },
    { href: "/terms", label: t("terms") },
    { href: "/affiliate-disclosure", label: t("affiliateDisclosure") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-sm text-[var(--color-text-secondary)] sm:flex-row">
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-[var(--color-primary)]">
            {l.label}
          </Link>
        ))}
      </nav>
      <VisitorCounter />
    </div>
  );
}
