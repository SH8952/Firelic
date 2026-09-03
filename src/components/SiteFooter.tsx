import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

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
    <nav className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-6 gap-y-2 px-4 py-4 text-sm text-[var(--color-text-secondary)]">
      {links.map((l) => (
        <Link key={l.href} href={l.href} className="hover:text-[var(--color-primary)]">
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
